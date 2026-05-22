import { defineConfig } from 'orval'

export default defineConfig({
  eventApi: {
    input: '../backend/openapi.generated.json',
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/models',
      client: 'axios',
      clean: true,
      override: {
        mutator: {
          path: './src/services/api/orvalMutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
