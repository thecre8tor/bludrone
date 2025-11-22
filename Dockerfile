# Multi-stage Dockerfile

# Stage 1: Build
FROM node:18-alpine AS builder

# Install yarn globally
RUN corepack enable && corepack prepare yarn@stable --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --immutable

# Copy source code
COPY . .

# Build the application
RUN yarn build


# Stage 2: Production
FROM node:18-alpine AS production

# Install yarn globally
RUN corepack enable && corepack prepare yarn@stable --activate

# Set working directory
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install --immutable && yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/init_scripts ./init_scripts

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start the application
CMD ["node", "dist/main.js"]
