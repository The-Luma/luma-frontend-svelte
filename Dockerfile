# Build stage
FROM node:23.9.0-alpine3.20 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

# Production stage
# FROM node:23.9.0-alpine3.20
# USER node
# WORKDIR /app
# COPY --from=builder --chown=node:node /app/build ./build
# COPY --from=builder --chown=node:node /app/node_modules ./node_modules
# COPY package.json ./

ENV PORT=3000
EXPOSE 3000
CMD ["node", "build"]
