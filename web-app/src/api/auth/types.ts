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
