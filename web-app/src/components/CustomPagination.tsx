import React from 'react';
import { Pagination } from '@mui/material';

interface CustomPaginationProps {
  paginationModel: { pageSize: number; page: number };
  onPageChange: (page: number) => void;
  totalPage: number; // Nhận prop totalPage
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  paginationModel,
  onPageChange,
  totalPage, // Sử dụng prop totalPage
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <Pagination
      count={totalPage} // Sử dụng totalPage để tính tổng số trang
      page={paginationModel.page + 1} // Sử dụng page 1-based
      onChange={handleChange}
    />
  );
};

export default CustomPagination;
