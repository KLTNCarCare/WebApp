import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

interface InvoicePrintModalProps {
  open: boolean;
  onClose: () => void;
  invoiceData: any;
}

const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  open,
  onClose,
  invoiceData,
}) => {
  const { t } = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, (canvas.height * 80) / canvas.width],
      });
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        80,
        (canvas.height * 80) / canvas.width
      );
      pdf.save(`invoice_${invoiceData.invoiceId}.pdf`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {t('invoice.preview')}
      </DialogTitle>
      <DialogContent
        sx={{
          width: '80mm',
          margin: '0 auto',
          padding: 2,
          fontFamily: 'monospace',
          border: '1px solid #ddd',
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Box ref={contentRef} sx={{ padding: 2 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#3f51b5',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              marginBottom: 1,
            }}
          >
            {t('invoice.title')}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          {/* Invoice Details */}
          <Box>
            {[
              { label: t('invoice.id'), value: invoiceData.invoiceId },
              {
                label: t('invoice.customerName'),
                value: invoiceData.customer.name,
              },
              {
                label: t('invoice.customerPhone'),
                value: invoiceData.customer.phone,
              },
              {
                label: t('invoice.vehicleLicensePlate'),
                value: invoiceData.vehicle.licensePlate,
              },
              {
                label: t('invoice.vehicleModel'),
                value: invoiceData.vehicle.model,
              },
              {
                label: t('invoice.status'),
                value:
                  invoiceData.status === 'unpaid'
                    ? t('invoice.unpaid')
                    : t('invoice.paid'),
              },
              {
                label: t('invoice.createdAt'),
                value: invoiceData.createdAt
                  ? new Date(invoiceData.createdAt).toLocaleDateString()
                  : 'N/A',
              },
              {
                label: t('invoice.updatedAt'),
                value: invoiceData.updatedAt
                  ? new Date(invoiceData.updatedAt).toLocaleDateString()
                  : 'N/A',
              },
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {label}:
                </Typography>
                <Typography variant="body2">{value}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ margin: '10px 0' }} />

          {/* Items Section */}
          <Typography
            variant="h6"
            align="center"
            sx={{ fontWeight: 'bold', marginBottom: 1, color: '#2196f3' }}
          >
            {t('invoice.items')}
          </Typography>
          {invoiceData.items.map((item: any, index: number) => (
            <Box
              key={index}
              sx={{
                marginBottom: 1,
                padding: 1,
                backgroundColor: '#f1f1f1',
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                }}
              >
                <Typography variant="body2">
                  {index + 1}. {item.serviceName}
                </Typography>
                <Typography variant="body2">
                  {item.price ? item.price.toLocaleString() : 'N/A'} VND
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {t('invoice.discount')}:
                </Typography>
                <Typography variant="body2">
                  {item.discount ? item.discount : 'N/A'}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {t('invoice.total')}:
                </Typography>
                <Typography variant="body2">
                  {item.price && item.discount !== undefined
                    ? (
                        item.price -
                        (item.price * item.discount) / 100
                      ).toLocaleString()
                    : 'N/A'}{' '}
                  VND
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Final Calculation */}
          <Divider sx={{ margin: '10px 0' }} />
          <Box>
            {[
              {
                label: t('invoice.subTotal'),
                value: invoiceData.sub_total
                  ? `${invoiceData.sub_total.toLocaleString()} VND`
                  : 'N/A',
              },
              {
                label: t('invoice.discount'),
                value:
                  invoiceData.discount.per && invoiceData.discount.value_max
                    ? `${
                        invoiceData.discount.per
                      }% (${invoiceData.discount.value_max.toLocaleString()} VND)`
                    : 'N/A',
              },
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {label}:
                </Typography>
                <Typography variant="body2">{value}</Typography>
              </Box>
            ))}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', fontSize: '16px', color: '#d32f2f' }}
              >
                {t('invoice.finalTotal')}:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', fontSize: '16px', color: '#d32f2f' }}
              >
                {invoiceData.final_total
                  ? invoiceData.final_total.toLocaleString()
                  : 'N/A'}{' '}
                VND
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          paddingBottom: 2,
          backgroundColor: '#f0f0f0',
        }}
      >
        <Button onClick={handleSave} color="primary" variant="contained">
          {t('dashboard.save')}
        </Button>
        <Button onClick={onClose} color="primary" variant="outlined">
          {t('dashboard.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePrintModal;
