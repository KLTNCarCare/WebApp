export interface User {
  _id: string;
  username: string;
  password: string;
  account_status: string;
  createAt: Date;
  updateAt: Date;
  roles: string[];
}

export type JwtTokenPayload = {
  typ: string;
  cid: string;
  status: string;
  eoc: string;
  noc: string;
  cty: string;
  imei: string;
  type: string;
  exp: number;
  iat: number;
  iss: string;
};

export interface ActivateArgs {
  activation_code: string;
  mobile: string;
}

export interface OtpFormValues {
  username: string;
  otp: string;
}

export interface ChangePasswordParams {
  phoneNumber: string;
  oldPass: string;
  newPass: string;
  otp: string;
}

export interface ChangePasswordResponse {
  message: string;
  statusCode: number;
}

export interface SendOtpParams {
  recaptchaToken: string;
  phoneNumber: string;
}

export interface SendOtpResponse {
  message: string;
  statusCode: number;
}
