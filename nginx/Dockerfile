# --- Stage 1: Build the React Client ---
FROM node:22-alpine AS client-builder
WORKDIR /app
RUN npm i -g pnpm

COPY . .
RUN pnpm install --frozen-lockfile --force
RUN pnpm --filter client run build

# --- Stage 2: Create the final Nginx image ---
FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=client-builder /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
