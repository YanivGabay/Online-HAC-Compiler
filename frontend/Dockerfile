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

# Set up environment based on NODE_ENV
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then \
        cp .env.production .env; \
    else \
        cp .env.development .env; \
    fi

# Build for production stage
RUN yarn build

# Development stage
FROM build as development
EXPOSE 5173
ENV HOST=0.0.0.0
CMD ["yarn", "dev", "--host"]

# Production stage
FROM nginx:alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 