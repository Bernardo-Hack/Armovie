# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY configs/ ./configs/

WORKDIR /app/backend/ms-client
COPY backend/ms-client/package.json backend/ms-client/package-lock.json ./
RUN npm ci

COPY backend/ms-client/tsconfig.json backend/ms-client/prisma.config.ts ./
COPY backend/ms-client/prisma/ ./prisma/
COPY backend/ms-client/src/ ./src/

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app/backend/ms-client
ENV NODE_ENV=production

COPY backend/ms-client/package.json backend/ms-client/package-lock.json ./
RUN npm ci

COPY --from=builder /app/backend/ms-client/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/ms-client/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/backend/ms-client/dist ./dist
COPY --from=builder /app/backend/ms-client/prisma ./prisma
COPY --from=builder /app/backend/ms-client/prisma.config.ts ./

EXPOSE 5003

CMD npx prisma db push && node dist/src/app.js
