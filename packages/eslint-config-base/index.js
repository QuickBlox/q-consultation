module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    'coverage',
  ],
  plugins: [
    'prettier',
  ],
  rules: {},
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
      ],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
      ],
      plugins: [
        '@typescript-eslint',
      ],
    },
  ],
};
