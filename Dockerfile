# Dockerfile para o monorepo Teddy (localizado na raiz do projeto)

# --- Estágio de Build Principal (para todas as aplicações Node.js no monorepo) ---
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copia arquivos essenciais para o Yarn entender o monorepo e workspaces.
COPY package.json yarn.lock ./
COPY tsconfig.base.json ./

# Copia a pasta .yarn/ para ter plugins, cache e etc (pode conter plugins necessários)
COPY .yarn/ .yarn/

RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

# Copia o código-fonte completo do monorepo
COPY . .

# Instala dependências usando node_modules linker (padrão)
RUN yarn install --immutable

# Build das aplicações
RUN yarn workspace @teddy/web build
RUN yarn workspace @teddy/api build

# --- Estágio Final para o Frontend (Servidor Nginx) ---
FROM nginx:1.27-alpine AS production-web

RUN rm /etc/nginx/conf.d/default.conf
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# --- Estágio Final para a API (Node.js) ---
FROM node:22-alpine AS production-api

WORKDIR /usr/src/app

# Copia package.json, yarn.lock e pasta .yarn/ para o container (plugins podem ser usados)
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/.yarn/ ./.yarn/

# Copia pastas de workspaces para o container
COPY --from=builder /usr/src/app/apps/ ./apps/
COPY --from=builder /usr/src/app/packages/ ./packages/

RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

# Instala só as dependências de produção da API, usando node_modules
RUN yarn workspaces focus --production @teddy/api

# Copia o build da API
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist

EXPOSE 4000

# Roda o app normalmente, sem carregar PnP
CMD ["node", "apps/api/dist/main.js"]
