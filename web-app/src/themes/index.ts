import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import * as colors from './colors';
import { breakpoint } from './shared/breakpoint';
import { typography } from './shared/typography';
import { viVN } from '@mui/material/locale';

export const muiTheme = createTheme(
  {
    palette: {
      mode: 'light' as PaletteMode,
      action: {
        activatedOpacity: 0.12,
        active: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        focus: 'rgba(0, 0, 0, 0.12)',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
      },
      background: {
        default: colors.neutral['00'],
        paper: colors.neutral['00'],
      },
      divider: colors.neutral[15],
      primary: {
        contrastText: colors.neutral['00'],
        dark: colors.blue[70],
        light: colors.blue[10],
        main: colors.blue[50],
      },
      secondary: {
        contrastText: colors.neutral['00'],
        dark: colors.secondary[60],
        light: colors.secondary[10],
        main: colors.secondary[50],
      },
      grey: {
        50: colors.neutral[10],
        100: colors.neutral[15],
        200: colors.neutral[20],
        300: colors.neutral[30],
        400: colors.neutral[40],
        500: colors.neutral[50],
        600: colors.neutral[60],
        700: colors.neutral[70],
        800: colors.neutral[80],
        900: colors.neutral[90],
        A100: colors.neutral[15],
        A200: colors.neutral[20],
        A400: colors.neutral[40],
        A700: colors.neutral[70],
      },
      info: {
        contrastText: colors.neutral['00'],
        dark: colors.blue[60],
        light: colors.blue[10],
        main: colors.blue[50],
      },
      success: {
        contrastText: colors.neutral['00'],
        dark: colors.green[60],
        light: colors.green[10],
        main: colors.green[50],
      },
      warning: {
        contrastText: colors.neutral['00'],
        dark: colors.yellow[60],
        light: colors.yellow[10],
        main: colors.yellow[50],
      },
      error: {
        contrastText: colors.neutral['00'],
        dark: colors.red[60],
        light: colors.red[10],
        main: colors.red[50],
      },
      text: {
        disabled: 'rgba(0, 0, 0, 0.38)',
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
    },
    typography: {
      fontFamily: typography.font.gilroy,

      htmlFontSize: parseInt(typography.size[4]),
      fontSize: parseInt(typography.size[3]),
      fontWeightLight: typography.weight.light,
      fontWeightRegular: typography.weight.regular,
      fontWeightMedium: typography.weight.medium,
      fontWeightBold: typography.weight.bold,

      h1: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[8],
        lineHeight: typography.lineHeight[4],
        letterSpacing: '0px',
      },
      h2: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[7],
        lineHeight: typography.lineHeight[3],
        letterSpacing: '0px',
      },
      h3: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[6],
        lineHeight: typography.lineHeight[3],
        letterSpacing: '0px',
      },
      h4: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[5],
        lineHeight: typography.lineHeight[2],
        letterSpacing: '0px',
      },
      h5: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[4],
        lineHeight: typography.lineHeight[2],
        letterSpacing: '0px',
      },
      h6: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[3],
        lineHeight: typography.lineHeight[1],
        letterSpacing: '0px',
      },
      subtitle1: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[2],
        lineHeight: typography.size[4],
        letterSpacing: '0px',
        textTransform: 'uppercase',
      },
      subtitle2: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[1],
        lineHeight: typography.size[4],
        letterSpacing: '0px',
        textTransform: 'uppercase',
      },
      body1: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.medium,
        fontSize: typography.size[4],
        lineHeight: typography.lineHeight[2],
        letterSpacing: '0px',
      },
      body2: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.medium,
        fontSize: typography.size[3],
        lineHeight: typography.lineHeight[1],
        letterSpacing: '0px',
      },
      button: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.bold,
        fontSize: typography.size[3],
        lineHeight: typography.lineHeight[1],
        letterSpacing: '0px',
        textTransform: 'initial',
      },
      caption: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.semibold,
        fontSize: typography.size[2],
        lineHeight: typography.size[4],
        letterSpacing: '0px',
      },
      overline: {
        fontFamily: typography.font.gilroy,
        fontWeight: typography.weight.semibold,
        fontSize: typography.size[2],
        lineHeight: typography.size[4],
        letterSpacing: '0px',
        textTransform: 'uppercase',
      },
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: breakpoint.sm,
        md: breakpoint.md,
        lg: breakpoint.lg,
        xl: breakpoint.xl,
      },
    },
    zIndex: {
      appBar: 1100,
      drawer: 1200,
      mobileStepper: 1000,
      modal: 1300,
      snackbar: 1400,
      speedDial: 1050,
      fab: 1050,
      tooltip: 1500,
    },
    components: {
      MuiTextField: {
        variants: [
          {
            props: { variant: 'filled' },
            style: {
              '.MuiInputBase-root': {
                backgroundColor: colors.neutral[10],
                borderRadius: 4,
                border: 'none',
              },
              '.MuiInputBase-root::before': {
                borderBottom: 'none',
              },
              '.MuiInputBase-root::after': {
                borderBottom: 'none',
              },
              '.MuiInputBase-root:hover:not(.Mui-disabled):before': {
                borderBottom: 'none',
              },
            },
          },
        ],
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          size: 'medium',
          variant: 'contained',
          color: 'primary',
        },
        styleOverrides: {
          root: {
            textTransform: 'initial',
          },
        },
        variants: [
          {
            props: { size: 'medium' },
            style: {
              height: 48,
              minWidth: 128,
              padding: `14px 16px`,
            },
          },
          {
            props: { size: 'small' },
            style: {
              height: 36,
              minWidth: 128,
              padding: `8px 16px`,
              fontSize: typography.size[3],
              lineHeight: typography.size[4],
            },
          },
        ],
      },
      MuiDialog: {
        styleOverrides: {
          paper: {},
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            maxWidth: 200,
            fontSize: '14px',
            lineHeight: '22px',
            fontWeight: 500,
            padding: '10px 12px',
          },
        },
      },
    },
  },
  viVN
);
