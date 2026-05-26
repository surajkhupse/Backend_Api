import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import cspell from '@cspell/eslint-plugin'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src/api/generated']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      '@cspell': cspell,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@cspell/spellchecker': ['warn', {
        cspell: {
          words: [
            'reduxjs',
            'hookform',
            'tailwindcss',
            'tseslint',
            'orval',
            'vitejs',
            'axios',
            'signin',
            'signup',
            'autofocus',
            'novalidate',
            'middleware',
            'mui',
            'zustand',
            'prev',
            'unmount',
          ],
        },
      }],
    },
  },
])
