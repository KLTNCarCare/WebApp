// @ts-check
// Keep this file as '.js' as it's included in tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

/**
 * @type {Record<"sans" | "serif" | "mono", string[]> & {gilroy: string[]}}
 */
const browserFonts = {
  sans: [...fontFamily.sans],
  serif: [...fontFamily.serif],
  mono: [...fontFamily.mono],
  gilroy: ['SVN Gilroy', ...fontFamily.sans],
};

module.exports = {
  browserFonts,
};
