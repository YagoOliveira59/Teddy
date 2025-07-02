# Estágio 1: Builder
# ATUALIZADO: Usando a versão mais recente do Node.js
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn nx build web --prod


# Estágio 2: Production
# ATUALIZADO: Usando a versão mais recente e estável do Nginx
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist/apps/web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]