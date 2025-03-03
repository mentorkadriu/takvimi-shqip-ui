module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
      destructuredArrayIgnorePattern: '^_',
      caughtErrors: 'none',
      varsIgnorePattern: '^React$',
      args: 'none',
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    'react/no-unescaped-entities': 'error',
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}; 