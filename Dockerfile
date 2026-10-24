# Multi-stage production build for CompetitorX
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Production server stage
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy backend source
COPY backend/src ./src

# Copy compiled frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

WORKDIR /app
EXPOSE 5001

CMD ["node", "backend/src/server.js"]
