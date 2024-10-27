import { Alert, CircularProgress } from '@mui/material';
import type { OptionsObject, WithSnackbarProps } from 'notistack';
import { useSnackbar } from 'notistack';
import React from 'react';

export enum VariantType {
  default = 'default',
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}

interface SnackProps {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void;
}

const InnerSnackbarUtilsConfigurator: React.FC<SnackProps> = ({
  setUseSnackbarRef,
}) => {
  setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef: WithSnackbarProps;
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
  return (
    <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
  );
};

const defaultSnackMessageLength = 1000;

const trimMessage = (
  msg: string,
  length: number = defaultSnackMessageLength
) => {
  return msg.substring(0, length);
};

const getErrorMessage = (error: any): string => {
  console.log(error.response);
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

const getSuccessMessage = (response: any): string => {
  console.log(response);
  if (response && response.message) {
    return response.message;
  }
  return 'Operation successful';
};

const snackbarUtils = {
  success(response: any, options: OptionsObject = {}) {
    const msg = getSuccessMessage(response);
    this.toast(trimMessage(msg), { ...options, variant: VariantType.success });
  },
  warning(msg: string, options: OptionsObject = {}) {
    this.toast(trimMessage(msg), { ...options, variant: VariantType.warning });
  },
  info(msg: string, options: OptionsObject = {}) {
    this.toast(trimMessage(msg), {
      ...options,
      variant: VariantType.info,
      content: (key) => {
        return (
          <Alert
            key={key}
            severity={VariantType.info}
            variant="filled"
            sx={{ minWidth: 288, backgroundColor: '#21272A' }}
          >
            {msg}
          </Alert>
        );
      },
    });
  },
  error(error: any, options: OptionsObject = {}) {
    const msg = getErrorMessage(error);
    this.toast(trimMessage(msg), { ...options, variant: VariantType.error });
  },
  toast(msg: string, options: OptionsObject = {}) {
    useSnackbarRef.enqueueSnackbar(msg, options);
  },
  loading(msg: string, options: OptionsObject = {}) {
    this.toast(trimMessage(msg), {
      ...options,
      variant: 'info',
      persist: true,
      content: (key) => {
        return (
          <Alert
            key={key}
            severity={VariantType.info}
            icon={<CircularProgress size={24} />}
          >
            {msg}
          </Alert>
        );
      },
    });
  },
};

export default snackbarUtils;
