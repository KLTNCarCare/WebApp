module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: [
    `**/${'node'}_modules`,
    '.cache',
    '**/.cache',
    '**/build',
    '**/dist',
    '**/.storybook',
    '**/storybook-static',
    'service-worker.ts',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  extends: ['react-app', 'plugin:regexp/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        jsxSingleQuote: false,
        semi: true,
        printWidth: 80,
        tabWidth: 2,
        bracketSpacing: true,
        trailingComma: 'es5',
        bracketSameLine: false,
        useTabs: false,
        endOfLine: 'auto',
        overrides: [],
      },
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
  overrides: [
    {
      // For performance enable react-testing-library only on test files
      files: ['**/?(*.)+(test).{js,jsx,ts,tsx}'],
      extends: ['plugin:testing-library/react'],
    },
    {
      files: ['**/test-utils.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/export': 'off',
      },
    },
    {
      files: ['*.{jsx,tsx}'],
      extends: [
        // @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
        'plugin:tailwindcss/recommended',
      ],
      rules: {
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/classnames-order': [
          1,
          {
            callees: ['classnames', 'clsx', 'ctl'],
            config: '',
            removeDuplicates: true,
            tags: [],
          },
        ],
      },
    },
    {
      // To ensure best performance enable only on e2e test files
      files: ['*.{js,jsx,jsx,tsx}'],
      extends: ['plugin:regexp/recommended'],
      rules: {
        'regexp/prefer-result-array-groups': 'off',
      },
    },
    {
      files: ['src/pages/\\_*.{ts, tsx}'],
      rules: {
        'react/display-name': 'off',
      },
    },
  ],
};
