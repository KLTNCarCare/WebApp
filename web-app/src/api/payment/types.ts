export interface PayZaloPayFn {
  appointmentId: string;
}
export interface PaymentResponse {
  code: number;
  message: string;
  data: {
    order_url: string;
  };
}
