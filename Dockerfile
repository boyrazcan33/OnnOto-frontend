# Use Node 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY . .

# Set environment variables for build
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 onnoto

# Copy built application
COPY --from=builder --chown=onnoto:nodejs /app/dist ./dist
COPY --from=builder --chown=onnoto:nodejs /app/server.js ./
COPY --from=builder --chown=onnoto:nodejs /app/package.json ./

# Copy only production node_modules
COPY --from=deps --chown=onnoto:nodejs /app/node_modules ./node_modules

# Change ownership to non-root user
USER onnoto

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "server.js"]