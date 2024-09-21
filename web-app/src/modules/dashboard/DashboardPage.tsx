import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import AdminLayout from 'src/components/layouts/AdminLayout';
import { Typography } from '@mui/material';

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('YOUR_API_URL_HERE');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Fetched data:', result); // Log dữ liệu
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !data) {
      fetchData();
    }
  }, [isAuthenticated, data]); // Chỉ fetch nếu dữ liệu chưa có

  return (
    <AdminLayout
      title="Bản đồ ngập"
      isCollapse={false}
      setIsCollapse={() => {}}
    >
      {isLoading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : data ? (
        <div>
          <Typography>{JSON.stringify(data, null, 2)}</Typography>
        </div>
      ) : (
        <Typography>Không có dữ liệu để hiển thị.</Typography>
      )}
    </AdminLayout>
  );
}
