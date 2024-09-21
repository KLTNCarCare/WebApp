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

// sets a default length for all Snack messages
const defaultSnackMessageLength = 1000;

const trimMessage = (
  msg: string,
  length: number = defaultSnackMessageLength
) => {
  return msg.substring(0, length);
};

const snackbarUtils = {
  success(msg: string, options: OptionsObject = {}) {
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
  error(msg: string, options: OptionsObject = {}) {
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
