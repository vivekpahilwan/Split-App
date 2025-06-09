FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any existing lock file and install dependencies
RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
