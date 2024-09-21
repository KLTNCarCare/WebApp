import { AxiosError } from 'axios';

export type ApiError<T = string> = {
  code: T;
  http_code: number;
  title: string;
  description: string;
  internal: string;
};

export type DefaultQueryError = AxiosError<ApiError>;
