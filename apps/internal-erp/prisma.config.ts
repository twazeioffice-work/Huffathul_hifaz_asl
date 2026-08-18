import { defineConfig, env } from '@prisma/config';
import path from 'path';

export default defineConfig({
  schema: path.resolve(process.cwd(), "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/suffah_erp',
  },
});
