# Build stage - runs medusa build during image build (more memory available)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and config
COPY package.json package-lock.json .npmrc ./

# Install all deps (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source and config
COPY medusa-config.ts tsconfig.json ./
COPY src ./src
COPY instrumentation.ts ./

# Build - creates .medusa/server with admin
RUN npx medusa build

# Production stage - lightweight runtime, no build at startup
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json .npmrc ./

# Install production deps only
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built output and source from builder
COPY --from=builder /app/.medusa ./.medusa
# Medusa requires medusa-config.js at project root (build outputs to .medusa/server/)
COPY --from=builder /app/.medusa/server/medusa-config.js ./medusa-config.js
COPY --from=builder /app/.medusa/server/instrumentation.js ./instrumentation.js
COPY --from=builder /app/src ./src

ENV NODE_ENV=production

EXPOSE 9000

# Only migrate + start - no build at runtime (avoids OOM)
CMD ["sh", "-c", "npx medusa db:migrate && echo 'Starting server on port' $PORT && exec npx medusa start --host 0.0.0.0 --port ${PORT:-9000}"]
