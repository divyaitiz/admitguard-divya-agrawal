FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node src/migrations/migrate.js && node src/server.js"]
