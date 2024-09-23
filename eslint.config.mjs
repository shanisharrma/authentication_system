import eslint from '@eslint/js'; // Import ESLint core library
import tseslint from 'typescript-eslint'; // Import TypeScript ESLint configurations
import eslintConfigPrettier from 'eslint-config-prettier'; // Import Prettier configuration to disable conflicting rules

export default tseslint.config({
    languageOptions: {
        parserOptions: {
            project: true, // Enable TypeScript project support
            tsconfigRootDir: import.meta.dirname, // Set the root directory for the tsconfig
        },
    },
    files: ['**/*.ts'], // Target all TypeScript files
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier], // Extend recommended ESLint and TypeScript rules
    rules: {
        'no-console': 'error' /* while pushing to GitHub, there shouldn't be any console log statements */, // Disallow console logs
        quotes: ['error', 'single', { allowTemplateLiterals: true }], // Enforce single quotes for strings, allowing template literals
    },
});
