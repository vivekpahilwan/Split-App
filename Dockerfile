FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any existing lock file and install dependencies
RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Create a dummy .env.local for build time
RUN echo "NEXT_PUBLIC_SUPABASE_URL=https://placeholder-for-build.supabase.co" > .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-for-build" >> .env.local

# Build the application
RUN npm run build

# Remove the dummy .env.local
RUN rm -f .env.local

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
