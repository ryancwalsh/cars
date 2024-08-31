/* eslint-disable canonical/sort-keys */
// https://eslint.org/docs/latest/use/configure/configuration-files-new
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  extends: ['next/core-web-vitals', 'canonical/auto'],
  rules: {
    'canonical/filename-match-exported': 'off', // TODO: Disable it just for Next.js page.tsx and route.ts files.
    'func-style': 'off',
    'react/function-component-definition': 'off',
    // https://eslint.org/docs/latest/rules/max-len
    'max-len': [
      'warn',
      {
        code: 180,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // https://eslint.org/docs/rules/max-lines
    'max-lines': [
      'error',
      { max: 200, skipBlankLines: true, skipComments: true },
    ],

    // https://eslint.org/docs/rules/max-lines-per-function
    'max-lines-per-function': [
      'error',
      { max: 30, skipBlankLines: true, skipComments: true },
    ],

    // https://eslint.org/docs/latest/rules/no-console
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // 'no-console': ['warn'],

    'react/forbid-component-props': 'off',

    'prettier/prettier': 'off', // disables Prettier within Eslint since the more stable way of using Prettier is via its own config. https://github.com/prettier/eslint-plugin-prettier#options says "While it is possible to pass options to Prettier via your ESLint configuration file, it is not recommended because editor extensions such as prettier-atom and prettier-vscode will read .prettierrc, but won't read settings from ESLint, which can lead to an inconsistent experience."

    /* Use https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping (from canonical) instead of 'import/order' 
    and note that eslint-config-canonical had overridden the defaults as mentioned in 
    https://github.com/lydell/eslint-plugin-simple-import-sort/issues/150#issuecomment-1806919274: */
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          // Files ending with .css or .scss. https://github.com/lydell/eslint-plugin-simple-import-sort/issues/150#issuecomment-1807188122
          ['\\.s?css$'],
        ],
      },
    ],
  },
};
