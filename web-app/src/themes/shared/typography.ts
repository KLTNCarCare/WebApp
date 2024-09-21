// Typography
// ---------------
const font = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
  serif: 'ui-serif, Georgia, Cambria, Times New Roman, Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  gilroy:
    'SVN Gilroy, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
} as const;

const size = {
  '1': '10px',
  '2': '12px',
  '3': '14px',
  '4': '16px',
  '5': '18px',
  '6': '20px',
  '7': '24px',
  '8': '32px',
} as const;

const lineHeight = {
  '1': '20px',
  '2': '24px',
  '3': '32px',
  '4': '40px',
} as const;

const weight = {
  thin: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 900,
} as const;

export const typography = {
  font,
  lineHeight,
  weight,
  size,
} as const;
