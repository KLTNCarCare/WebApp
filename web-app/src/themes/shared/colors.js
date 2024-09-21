const tailwindColors = require('tailwindcss/colors');

/**
 * Return tailwind v3 non-deprecated colors
 * @type {Record<string, string | Record<string, string>>}
 */
const tailwindV3Colors = Object.entries(
  Object.getOwnPropertyDescriptors(tailwindColors)
)
  .filter(
    ([, desc]) =>
      Object.prototype.hasOwnProperty.call(desc, 'value') &&
      typeof desc.value !== 'function'
  )
  .reduce((acc, [key]) => {
    if (
      // !['coolGray', 'lightBlue', 'warmGray', 'trueGray', 'blueGray'].includes(
      //   key
      // )
      ['inherit', 'current', 'transparent', 'black', 'white'].includes(key)
    ) {
      acc[key] = tailwindColors[key];
    }
    return acc;
  }, {});

module.exports = { tailwindV3Colors };
