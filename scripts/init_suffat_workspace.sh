#!/bin/bash
# Location: scripts/init_suffat_workspace.sh
set -e

echo "=== INITIALIZING SUFFAT-UL HUFFAZ DIGITAL MONOREPO ==="

# 1. Create Monorepo Folder Topology
mkdir -p apps/internal-erp/src/app
mkdir -p apps/public-website/src/app
mkdir -p apps/ai-swarm-mcp/src
mkdir -p packages/database/src
mkdir -p scripts
mkdir -p docs

# 2. Write Root package.json
cat << 'EOF' > package.json
{
  "name": "suffat-digital-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^1.13.0",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0"
  }
}
EOF

# 3. Write pnpm-workspace.yaml
cat << 'EOF' > pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 4. Write Turborepo pipeline configuration (turbo.json)
cat << 'EOF' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

# 5. Write Base TypeScript Config
cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "exclude": ["node_modules"]
}
EOF

# 6. Initialize Applications package.json files
cat << 'EOF' > apps/internal-erp/package.json
{
  "name": "internal-erp",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

cat << 'EOF' > apps/public-website/package.json
{
  "name": "public-website",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

cat << 'EOF' > apps/ai-swarm-mcp/package.json
{
  "name": "ai-swarm-mcp",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "fastapi": "^0.110.0",
    "uvicorn": "^0.28.0"
  }
}
EOF

cat << 'EOF' > packages/database/package.json
{
  "name": "database",
  "version": "1.0.0",
  "private": true,
  "main": "./src/client.ts",
  "types": "./src/client.ts"
}
EOF

# 7. Write a placeholder Database Client
cat << 'EOF' > packages/database/src/client.ts
import { Pool } from 'pg';

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
EOF

echo "=== WORKSPACE SCAFFOLDED SUCCESSFULLY ==="
chmod +x scripts/init_suffat_workspace.sh
