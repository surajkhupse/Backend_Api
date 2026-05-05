import dotenv from 'dotenv';
import connectDB from './database/connection';
import { buildOpenApiSpec } from './config/openapi';
import { createApp } from './app';

dotenv.config();
void connectDB();

const swaggerDocument = buildOpenApiSpec();
const app = createApp(swaggerDocument);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check:  http://127.0.0.1:${PORT}/__health`);
  console.log(
    `OpenAPI JSON:  http://127.0.0.1:${PORT}/openapi.json  (also: /api/openapi, /api-spec.json, /v1/openapi.json)`
  );
  console.log(
    `Swagger UI:    http://127.0.0.1:${PORT}/api-docs/  (alias: http://127.0.0.1:${PORT}/swagger/)`
  );
  console.log('OpenAPI: modules/** @openapi comments + config/openapi-template.ts');
});
