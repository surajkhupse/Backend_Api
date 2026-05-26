import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { getOpenApiTemplate } from './openapi-template';

function toForwardSlash(p: string): string {
  return p.split(path.sep).join('/');
}

function resolveModulesGlob(ext: string): string {
  const base = __dirname && path.isAbsolute(__dirname)
    ? path.join(__dirname, '..', 'modules')
    : path.join(process.cwd(), 'src', 'modules');
  return toForwardSlash(base) + `/**/*.${ext}`;
}

export function buildOpenApiSpec(): object {
  const definition = getOpenApiTemplate() as swaggerJsdoc.OAS3Definition;
  return swaggerJsdoc({
    definition,
    apis: [resolveModulesGlob('js'), resolveModulesGlob('ts')],
  });
}
