FROM node:22-alpine
WORKDIR /app

RUN npm i -g pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/

# Install all workspace dependencies
RUN pnpm install

# Copy the client's source code into the image
COPY ./apps/client /app/apps/client

# Run the dev command for the 'client' package
CMD ["pnpm", "--filter", "client", "run", "dev"]
