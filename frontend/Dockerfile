# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install corepack for yarn
RUN corepack enable

# Copy all files
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build the app
RUN yarn build

# Serve stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 