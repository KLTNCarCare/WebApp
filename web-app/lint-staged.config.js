// @ts-check

const path = require('path');
const escape = require('shell-quote').quote;

const isWin = process.platform === 'win32';

const concatFilesForPrettier = (/** @type {any[]} */ filenames) =>
  filenames
    .map((filename) => `"${isWin ? filename : escape([filename])}"`)
    .join(' ');

const getEslintFixCmd = ({
  // @ts-ignore
  cwd,
  // @ts-ignore
  files,
  // @ts-ignore
  rules,
  // @ts-ignore
  fix,
  // @ts-ignore
  fixType,
  // @ts-ignore
  cache,
  // @ts-ignore
  maxWarnings,
}) => {
  const cliRules = [...(rules ?? []), 'react-hooks/exhaustive-deps: off']
    .filter((rule) => rule.trim().length > 0)
    .map((r) => `"${r.trim()}"`);

  // For lint-staged it's safer to not apply the fix command if it changes the AST
  // @see https://eslint.org/docs/user-guide/command-line-interface#--fix-type
  const cliFixType = [...(fixType ?? ['layout'])].filter(
    (type) => type.trim().length > 0
  );

  const args = [
    cache ? '--cache' : '',
    fix ? '--fix' : '',
    cliFixType.length > 0 ? `--fix-type ${cliFixType.join(',')}` : '',
    maxWarnings !== undefined ? `--max-warnings=${maxWarnings}` : '',
    cliRules.length > 0 ? `--rule ${cliRules.join('--rule ')}` : '',
    files
      // makes output cleaner by removing absolute paths from filenames
      // @ts-ignore
      .map((f) => `"./${path.relative(cwd, f)}"`)
      .join(' '),
  ].join(' ');
  return `eslint ${args}`;
};

/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
const rules = {
  '**/*.{js,jsx,ts,tsx}': (filenames) => {
    // @ts-ignore
    return getEslintFixCmd({
      cwd: __dirname,
      fix: true,
      cache: true,
      // when autofixing staged-files a good tip is to disable react-hooks/exhaustive-deps, cause
      // a change here can potentially break things without proper visibility.
      rules: ['react-hooks/exhaustive-deps: off'],
      maxWarnings: 25,
      files: filenames,
    });
  },
  '**/*.{json,md,mdx,css,html,yml,yaml,scss}': (filenames) => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`];
  },
};

module.exports = rules;
