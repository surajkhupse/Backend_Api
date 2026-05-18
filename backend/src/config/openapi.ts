import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { getOpenApiTemplate } from './openapi-template';

/**
 * Builds OpenAPI 3 from `openapi-template.ts` + `@openapi` blocks under `modules/**`.
 * Server list / port come from `openapi-settings.ts` (PORT, SWAGGER_BASE_URL).
 * Add or edit those comments when you add handlers — then restart the server (or run `npm run openapi`).
 */
export function buildOpenApiSpec(): object {
  const definition = getOpenApiTemplate() as swaggerJsdoc.OAS3Definition;
  return swaggerJsdoc({
    definition,
    apis: [
      path.join(__dirname, '../modules/**/*.js'),
      path.join(__dirname, '../modules/**/*.ts'),
    ],
  });
}
