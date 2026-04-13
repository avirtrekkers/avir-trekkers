# Use official Node.js base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Install pm2 globally
RUN npm install -g pm2

# Copy source files
COPY . .
# RUN npx prisma generate

# Build the TypeScript code
# RUN npm run build

# Expose the app port
EXPOSE 4000

# Use pm2 to run your app and keep it alive
CMD ["pm2-runtime", "app.js"]
