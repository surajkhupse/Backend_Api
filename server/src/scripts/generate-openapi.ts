import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { buildOpenApiSpec } from '../config/openapi';

dotenv.config();

const out = path.join(__dirname, '..', '..', 'openapi.generated.json');
fs.writeFileSync(out, JSON.stringify(buildOpenApiSpec(), null, 2));
console.log('Wrote', out);
