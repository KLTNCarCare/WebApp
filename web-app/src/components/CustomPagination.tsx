import React from 'react';
import { Pagination } from '@mui/material';

interface CustomPaginationProps {
  paginationModel: { pageSize: number; page: number };
  onPageChange: (page: number) => void;
  totalPage: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  paginationModel,
  onPageChange,
  totalPage,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <Pagination
      count={totalPage}
      page={paginationModel.page + 1}
      onChange={handleChange}
    />
  );
};

export default CustomPagination;
