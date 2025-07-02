# Estágio de construção
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# 1. Copia arquivos essenciais para o Yarn entender o monorepo e workspaces
# Isso inclui o package.json e yarn.lock da raiz, e o tsconfig.base.json que define paths de workspaces.
COPY package.json yarn.lock ./
COPY tsconfig.base.json ./

# 2. Copia todas as pastas de workspaces que contêm arquivos package.json
# Isso garante que o Yarn possa encontrar e resolver todos os seus workspaces, como @teddy/types.
# Assume que seus aplicativos estão em 'apps/' e suas bibliotecas/tipos em 'packages/'.
COPY apps/ apps/
COPY packages/ packages/
# Se você tiver outras pastas de workspaces (ex: libs/), adicione-as aqui:
# COPY libs/ libs/

# 3. Habilita o Corepack e prepara o Yarn na versão desejada
RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

# 4. Instala as dependências usando yarn workspaces
# Com todos os package.json dos workspaces copiados, o Yarn agora pode resolver corretamente "workspace:*".
RUN yarn install --immutable

COPY .yarn/ .yarn/

# 5. Copia o restante do código-fonte do monorepo
# Esta etapa é feita APÓS a instalação de dependências para otimizar o cache do Docker.
# O .dockerignore deve ser configurado para NÃO excluir as pastas .yarn/ ou .yarn/cache.
COPY . .

# 6. Constrói APENAS o aplicativo web
RUN yarn workspace @teddy/web build

# Estágio Final (Servidor Nginx para o SPA/Frontend)
FROM nginx:1.27-alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx para o seu aplicativo web
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos (HTML, CSS, JS) construídos do estágio 'builder'
COPY --from=builder /usr/src/app/dist/apps/web /usr/share/nginx/html

# Expõe a porta padrão do HTTP
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]