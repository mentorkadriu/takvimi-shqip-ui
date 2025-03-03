module.exports = {
  // Run TypeScript type checking
  '**/*.ts?(x)': () => 'npm run type-check',
  
  // Run ESLint on all TypeScript/JavaScript files
  '**/*.(ts|tsx|js)': (filenames) => [
    `next lint --fix --file ${filenames.join(' --file ')}`,
    'npm run type-check'
  ],
} 