# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# The EXPO_PUBLIC_GATEWAY_URL needs to be available at build time for Expo
ARG EXPO_PUBLIC_GATEWAY_URL=http://localhost:3000
ENV EXPO_PUBLIC_GATEWAY_URL=$EXPO_PUBLIC_GATEWAY_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Export the web app
RUN npx expo export -p web

# ─── Runtime stage (Nginx) ────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy the exported files to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (we will map it to 8081 in docker-compose)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
