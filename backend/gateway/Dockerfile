# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY configs/ ./configs/

WORKDIR /app/backend/gateway
COPY backend/gateway/package.json backend/gateway/package-lock.json ./
RUN npm ci

COPY backend/gateway/tsconfig.json ./
COPY backend/gateway/src/ ./src/

RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app/backend/gateway
ENV NODE_ENV=production

COPY backend/gateway/package.json backend/gateway/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/backend/gateway/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
