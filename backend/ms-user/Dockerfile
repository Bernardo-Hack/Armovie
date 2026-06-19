# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY configs/ ./configs/

WORKDIR /app/backend/ms-user
COPY backend/ms-user/package.json backend/ms-user/package-lock.json ./
RUN npm ci

COPY backend/ms-user/tsconfig.json backend/ms-user/prisma.config.ts ./
COPY backend/ms-user/prisma/ ./prisma/
COPY backend/ms-user/src/ ./src/

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app/backend/ms-user
ENV NODE_ENV=production

COPY backend/ms-user/package.json backend/ms-user/package-lock.json ./
RUN npm ci

COPY --from=builder /app/backend/ms-user/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/ms-user/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/backend/ms-user/dist ./dist
COPY --from=builder /app/backend/ms-user/prisma ./prisma
COPY --from=builder /app/backend/ms-user/prisma.config.ts ./

EXPOSE 5001

CMD npx prisma db push && node dist/src/app.js
