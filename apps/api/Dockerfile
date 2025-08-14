FROM node:22-alpine
WORKDIR /app

RUN npm i -g pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/

# Install all workspace dependencies
RUN pnpm install

# Copy the API's source code into the image
COPY ./apps/api /app/apps/api

# Run the dev command for the 'api' package
CMD ["pnpm", "--filter", "api", "run", "dev"]
