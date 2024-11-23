import React, { useState, useEffect } from 'react';
import { Dialog, LinearProgress, Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
  viVN,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import EditIcon from '@mui/icons-material/Edit';
import { CategoryManagement } from 'src/api/category/useGetCategory';
import CategoryDetailModal from './CategoryModalDetail';
import DeleteCategory from './DeleteCategory';
import EditCategoryModal from './EditCategoryModal';
import { useGetServiceByCategory } from 'src/api/category/useGetServiceByCategory';

interface CategoryDataTableProps {
  dataCategory: any[];
  isLoadingCategory: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createCategoryColumns = (
  t: (key: string) => string,
  handleEditClick: (categoryData: any) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('category.index'),
    maxWidth: 50,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const index =
        paginationModel.page * paginationModel.pageSize +
        params.api.getAllRowIds().indexOf(params.id);
      return index + 1;
    },
  },
  {
    field: 'categoryId',
    headerName: t('category.categoryId'),
    maxWidth: 300,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.categoryId || '',
  },
  {
    field: 'categoryName',
    headerName: t('category.categoryName'),
    minWidth: 250,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.categoryName || '',
  },
  {
    field: 'action',
    headerName: '',
    minWidth: 150,
    align: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          paddingRight: '15px',
        }}
      >
        <EditIcon
          sx={{ cursor: 'pointer', color: '#a1a0a0' }}
          onClick={() => handleEditClick(params.row)}
        />
        <DeleteCategory _id={params.row._id} refetch={refetch} />
      </div>
    ),
  },
];

const CategoryDataTable: React.FC<CategoryDataTableProps> = ({
  dataCategory,
  isLoadingCategory,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryManagement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<any>(null);

  const {
    data: serviceByCategorytData,
    isLoading: isLoadingCategoryLine,
    refetch: refetchCategoryLine,
  } = useGetServiceByCategory(selectedCategory?._id || '', {
    enabled: !!selectedCategory?._id,
  });

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCategory(params.row as CategoryManagement);
  };

  const handleEditClick = (categoryData: any) => {
    setEditCategoryData(categoryData);
    setIsEditCategoryOpen(true);
    refetch();
  };

  useEffect(() => {
    if (selectedCategory && selectedCategory._id) {
      if (paginationModel.page !== previousPage) {
        setPreviousPage(paginationModel.page);
      }
    }
  }, [selectedCategory, paginationModel.page]);

  // useEffect(() => {}, [selectedCategory, paginationModel]);

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataCategory}
            columns={createCategoryColumns(
              t,
              handleEditClick,
              paginationModel,
              refetch
            )}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) =>
              row._id || row.id || Math.random().toString(36).substr(2, 9)
            }
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              if (!selectedCategory || !selectedCategory._id) {
                setPaginationModel((prev) => ({ ...prev, ...model }));
              } else {
                setPaginationModel((prev) => ({ ...prev, page: currentPage }));
              }
            }}
            pageSizeOptions={[TEN_ITEMS_PAGE]}
            slots={{
              loadingOverlay: LinearProgress,
              noRowsOverlay: () => (
                <EmptyScreen titleEmpty={t('dashboard.noDataAvailable')} />
              ),
              pagination: () => (
                <CustomPagination
                  paginationModel={paginationModel}
                  onPageChange={(page) =>
                    setPaginationModel((prev) => ({ ...prev, page: page - 1 }))
                  }
                  totalPage={totalPage}
                />
              ),
            }}
            loading={isLoadingCategory}
            onRowClick={handleRowClick}
          />
        </div>
      </Paper>

      {selectedCategory && (
        <CategoryDetailModal
          open={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          categoryData={selectedCategory}
          refetch={refetchCategoryLine}
          dataCategory={null}
          isLoadingCategory={isLoadingCategory}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          serviceByCategorytData={serviceByCategorytData}
          isLoadingServiceByCategory={isLoadingCategoryLine}
        />
      )}

      <Dialog
        open={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {isEditCategoryOpen && editCategoryData && (
          <EditCategoryModal
            categoryData={editCategoryData}
            refetch={refetch}
            setIsEditCategory={setIsEditCategoryOpen}
          />
        )}
      </Dialog>
    </>
  );
};

export default CategoryDataTable;
