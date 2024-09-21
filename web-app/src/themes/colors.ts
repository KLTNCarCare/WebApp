// The main accent color of the product, used for interactive elements such as button, tag, tooltip, etc
// ---------------
export const primary = {
  '10': '#086dd9',
  '20': '#FFE3D3',
  '30': '#FFD5BC',
  '40': '#FF7F32',
  '50': '#FE5F00',
  '60': '#EA5800',
  '70': '#B24300',
  '80': '#983900',
  '90': '#7F3000',
} as const;

export const secondary = {
  '10': '#F1F8FF',
  '20': '#D1E8FF',
  '30': '#B1D8FF',
  '40': '#125598',
  '50': '#0E4174',
  '60': '#0A3263',
  '70': '#072553',
  '80': '#041A43',
  '90': '#021237',
} as const;

// Main text color, can be used in other elements such as border, disabled item, scrim, etc...
// ---------------
export const neutral = {
  '00': '#FFFFFF',
  '10': '#F2F4F8',
  '15': '#E6E9EC',
  '20': '#DDE1E6',
  '30': '#C1C7CD',
  '40': '#A2A9B0',
  '50': '#697077',
  '60': '#4D5358',
  '70': '#343A3F',
  '80': '#21272A',
  '90': '#121619',
} as const;

// Functional Color - This palette is fixed, used in the features that can express emotions.
// ---------------
export const blue = {
  '10': '#E6F7FF',
  '20': '#BAE7FF',
  '30': '#91D5FF',
  '40': '#1890FF',
  '50': '#096DD9',
  '60': '#0050B3',
  '70': '#003A8C',
} as const;

export const green = {
  '10': '#F0FFF4',
  '20': '#C6F6D5',
  '30': '#9AE6B4',
  '40': '#38A169',
  '50': '#2F855A',
  '60': '#276749',
  '70': '#22543D',
} as const;

export const yellow = {
  '10': '#FFF7E6',
  '20': '#FFE7BA',
  '30': '#FFD591',
  '40': '#FA8C16',
  '50': '#D46B08',
  '60': '#AD4E00',
  '70': '#873800',
} as const;

export const red = {
  '10': '#FFF1F0',
  '20': '#FFCCC7',
  '30': '#FFA39E',
  '40': '#F5222D',
  '50': '#CF1322',
  '60': '#A8071A',
  '70': '#820014',
} as const;

// Flood brand colors
// ---------------
export const brand = {
  primary: primary[40],
  secondary: secondary[40],
};
