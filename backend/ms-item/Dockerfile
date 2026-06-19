# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY configs/ ./configs/

WORKDIR /app/backend/ms-item
COPY backend/ms-item/package.json backend/ms-item/package-lock.json ./
RUN npm ci

COPY backend/ms-item/tsconfig.json backend/ms-item/prisma.config.ts ./
COPY backend/ms-item/prisma/ ./prisma/
COPY backend/ms-item/src/ ./src/

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app/backend/ms-item
ENV NODE_ENV=production

COPY backend/ms-item/package.json backend/ms-item/package-lock.json ./
RUN npm ci

COPY --from=builder /app/backend/ms-item/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/ms-item/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/backend/ms-item/dist ./dist
COPY --from=builder /app/backend/ms-item/prisma ./prisma
COPY --from=builder /app/backend/ms-item/prisma.config.ts ./

EXPOSE 5002

CMD npx prisma db push && node dist/src/app.js
