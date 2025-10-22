const stylistic = require('@stylistic/eslint-plugin')
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  { ignores: ['out/', 'dist/', 'node_modules/'] },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2021,
        sourceType: 'module'
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/comma-spacing': ['error', {
        'before': false,
        'after': true
      }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/key-spacing': ['error', {
        'beforeColon': false,
        'afterColon': true
      }],
      '@stylistic/keyword-spacing': ['error', {
        'before': true,
        'after': true
      }],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/switch-colon-spacing': 'error',
      '@stylistic/type-named-tuple-spacing': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error', { 'argsIgnorePattern': '^_' }
      ],
      '@stylistic/no-trailing-spaces': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error'
    }
  }
];

// Add Mocha test globals for test files
module.exports.push({
  files: ['src/test/**/*.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    globals: {
      describe: 'readonly',
      it: 'readonly',
      before: 'readonly',
      after: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly'
    }
  }
});
