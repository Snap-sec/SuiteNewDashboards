FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# install vite
RUN npm install -g vite

# Install dependencies
RUN npm install --force

# Copy app source
COPY . .

# ✅ Set Node.js memory limit to prevent OOM during build
ENV NODE_OPTIONS="--max-old-space-size=3072"

# Build the app
RUN vite build

# Nginx stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY samples/install.sh /home/imran/samples/install.sh

# ✅ Copy your downloadable sample files
COPY samples /app/samples

# Create a script that will run when container starts
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env-config.sh && \
    echo 'echo "window._env_ = {" > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env-config.sh && \
    echo 'echo "  BASE_URL: \"$BASE_URL\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env-config.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env-config.sh && \
    chmod +x /docker-entrypoint.d/40-env-config.sh

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]