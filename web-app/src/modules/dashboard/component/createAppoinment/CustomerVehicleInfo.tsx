import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Autocomplete,
  MenuItem,
  Select,
  Paper,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetAllCustomer } from 'src/api/customer/useGetAllCustomer';
import useDebounce from 'src/lib/hooks/useDebounce';

type CustomerVehicleInfoProps = {
  onCustomerVehicleChange: (data: any) => void;
};

const CustomerVehicleInfo: React.FC<CustomerVehicleInfoProps> = ({
  onCustomerVehicleChange,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useFormContext();
  const { t } = useTranslation();
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedSearchPhone = useDebounce(inputValue, 500);

  const { data, error, refetch } = useGetAllCustomer(
    null,
    null,
    'phone',
    debouncedSearchPhone,
    {
      enabled: debouncedSearchPhone.length > 0,
      onSuccess: (data) => {
        if (data?.data?.data && data.data.data.length > 0) {
          setCustomerData(data.data.data);
        } else {
          setCustomerData([]);
        }
      },
      onError: () => {
        setCustomerData([]);
      },
    }
  );

  useEffect(() => {
    if (!isExistingCustomer) {
      setCustomerData([]);
      setSelectedCustomer(null);
      setVehicles([]);
    }
  }, [isExistingCustomer]);

  useEffect(() => {
    if (debouncedSearchPhone.length === 0) {
      setSelectedCustomer(null);
      setVehicles([]);
      setValue('customer.name', '');
      setValue('customer.phone', '');
    } else {
      refetch();
    }
  }, [debouncedSearchPhone, setValue, refetch]);

  const handleCustomerSelect = (customerId: string) => {
    const customer = customerData.find((cust) => cust._id === customerId);
    if (customer) {
      setSelectedCustomer(customerId);
      setVehicles(customer.vehicles);
      setValue('customer.name', customer.name);
      setValue('customer.phone', customer.phone);
      const data = {
        customer: {
          name: customer.name,
          phone: customer.phone,
        },
        vehicle: selectedVehicle,
      };
      onCustomerVehicleChange(data);
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find((veh) => veh.licensePlate === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setValue('vehicle.model', vehicle.model);
      setValue('vehicle.licensePlate', vehicle.licensePlate);
      const data = {
        customer: {
          name: getValues('customer.name'),
          phone: getValues('customer.phone'),
        },
        vehicle: {
          model: vehicle.model,
          licensePlate: vehicle.licensePlate,
        },
      };
      onCustomerVehicleChange(data);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 1, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {t('priceCatalog.customerInfo')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant={isExistingCustomer ? 'contained' : 'outlined'}
            onClick={() => setIsExistingCustomer(!isExistingCustomer)}
            sx={{ marginBottom: 0 }}
          >
            {isExistingCustomer
              ? t('customer.newCustomer')
              : t('customer.existingCustomer')}
          </Button>
        </Grid>
        {isExistingCustomer ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="filled"
                label={t('customer.searchByPhone')}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                inputProps={{ inputMode: 'text' }}
                fullWidth
                sx={{ marginBottom: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="filled" fullWidth sx={{ marginBottom: 0 }}>
                <InputLabel shrink>{t('customer.selectCustomer')}</InputLabel>
                <Controller
                  name="customer.selected"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={customerData || []}
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.phone}`
                      }
                      onChange={(event, value) => {
                        field.onChange(value?._id || '');
                        handleCustomerSelect(value?._id || '');
                      }}
                      renderInput={(params) => (
                        <TextField {...params} variant="filled" />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Typography variant="body1">{option.name}</Typography>
                          <Typography color="primary" sx={{ ml: 1 }}>
                            - {option.phone}
                          </Typography>
                        </Box>
                      )}
                      value={
                        customerData.find(
                          (customer) => customer._id === field.value
                        ) || null
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            {selectedCustomer && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="filled"
                    label={t('priceCatalog.customerName')}
                    type="text"
                    value={getValues('customer.name')}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="filled"
                    label={t('priceCatalog.customerPhone')}
                    type="text"
                    value={getValues('customer.phone')}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    sx={{ marginBottom: 0 }}
                  />
                </Grid>
              </>
            )}
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                variant="filled"
                label={t('priceCatalog.customerName')}
                type="text"
                {...register('customer.name')}
                inputProps={{ inputMode: 'text' }}
                fullWidth
                sx={{ marginBottom: 0 }}
                onChange={(e) => {
                  setValue('customer.name', e.target.value);
                  const data = {
                    customer: {
                      name: e.target.value,
                      phone: getValues('customer.phone'),
                    },
                    vehicle: selectedVehicle,
                  };
                  onCustomerVehicleChange(data);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                variant="filled"
                label={t('priceCatalog.customerPhone')}
                type="text"
                {...register('customer.phone')}
                inputProps={{ inputMode: 'text' }}
                fullWidth
                sx={{ marginBottom: 0 }}
                onChange={(e) => {
                  setValue('customer.phone', e.target.value);
                  const data = {
                    customer: {
                      name: getValues('customer.name'),
                      phone: e.target.value,
                    },
                    vehicle: selectedVehicle,
                  };
                  onCustomerVehicleChange(data);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                variant="filled"
                label={t('priceCatalog.vehicleModel')}
                type="text"
                {...register('vehicle.model')}
                inputProps={{ inputMode: 'text' }}
                fullWidth
                sx={{ marginBottom: 0 }}
                onChange={(e) => {
                  setValue('vehicle.model', e.target.value);
                  const data = {
                    customer: {
                      name: getValues('customer.name'),
                      phone: getValues('customer.phone'),
                    },
                    vehicle: {
                      model: e.target.value,
                      licensePlate: getValues('vehicle.licensePlate'),
                    },
                  };
                  onCustomerVehicleChange(data);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                variant="filled"
                label={t('priceCatalog.vehicleLicensePlate')}
                type="text"
                {...register('vehicle.licensePlate')}
                inputProps={{ inputMode: 'text' }}
                fullWidth
                sx={{ marginBottom: 2 }}
                onChange={(e) => {
                  setValue('vehicle.licensePlate', e.target.value);
                  const data = {
                    customer: {
                      name: getValues('customer.name'),
                      phone: getValues('customer.phone'),
                    },
                    vehicle: {
                      model: getValues('vehicle.model'),
                      licensePlate: e.target.value,
                    },
                  };
                  onCustomerVehicleChange(data);
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Divider sx={{ my: 0.5 }} />

      {/* Vehicle Info Section */}
      {isExistingCustomer && selectedCustomer && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('priceCatalog.vehicleInfo')}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControl variant="filled" fullWidth sx={{ marginBottom: 0 }}>
                <InputLabel>{t('customer.selectVehicle')}</InputLabel>
                <Controller
                  name="vehicle.selected"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onChange={(event) => {
                        const selectedVehicle = vehicles.find(
                          (vehicle) =>
                            vehicle.licensePlate === event.target.value
                        );
                        field.onChange(event.target.value);
                        handleVehicleSelect(selectedVehicle.licensePlate);
                      }}
                    >
                      {vehicles.map((vehicle) => (
                        <MenuItem
                          key={vehicle.licensePlate}
                          value={vehicle.licensePlate}
                        >
                          {vehicle.model} - {vehicle.licensePlate}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {selectedVehicle && (
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      variant="filled"
                      label={t('priceCatalog.vehicleModel')}
                      type="text"
                      value={selectedVehicle.model}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="filled"
                      label={t('priceCatalog.vehicleLicensePlate')}
                      type="text"
                      value={selectedVehicle.licensePlate}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      sx={{ marginBottom: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default CustomerVehicleInfo;
