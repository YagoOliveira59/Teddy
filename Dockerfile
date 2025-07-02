# Dockerfile para o monorepo Teddy (localizado na raiz do projeto)

# --- Estágio de Build Principal (para todas as aplicações Node.js no monorepo) ---
# Usa uma imagem Node.js leve para o ambiente de construção.
FROM node:22-alpine AS builder

# Define o diretório de trabalho dentro do container.
WORKDIR /usr/src/app

# 1. Copia arquivos essenciais para o Yarn entender o monorepo e workspaces.
#    Isso otimiza o cache do Docker: esta camada só é reconstruída se estes arquivos mudarem.
#    `package.json` e `yarn.lock` são cruciais para a instalação de dependências.
#    `tsconfig.base.json` é importante para a resolução de paths de workspaces.
COPY package.json yarn.lock ./
COPY tsconfig.base.json ./

# 2. Copia a pasta `.yarn/` (se usada pelo Yarn Berry para cache, binários ou plugins)
#    Esta etapa deve vir ANTES de `yarn install` para garantir que o Yarn
#    tenha seu executável e configurações disponíveis desde o início.
COPY .yarn/ .yarn/

# 3. Habilita o Corepack (gerenciador de versões de pacotes) e prepara o Yarn na versão desejada.
#    Isso garante que a versão correta do Yarn seja usada para a instalação.
RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

# 4. Copia TODO o restante do código-fonte do monorepo.
#    Esta é uma etapa crucial para monorepos: garante que todos os `package.json`
#    dos workspaces e o código estejam presentes ANTES da instalação de dependências.
#    Qualquer alteração no código-fonte invalida esta camada e as subsequentes.
#    Certifique-se de que seu `.dockerignore` esteja configurado para NÃO excluir as pastas `.yarn/` ou `.yarn/cache`.
COPY . .

# 5. Instala as dependências usando yarn workspaces.
#    Com todos os `package.json` dos workspaces e o código copiados, o Yarn agora pode
#    resolver corretamente "workspace:*" e criar o estado necessário.
#    `--immutable` garante que o lockfile não seja modificado, ideal para CI/CD.
RUN yarn install --immutable

# 6. Constrói as aplicações web e API.
#    Ambos os builds são executados neste estágio, aproveitando as dependências já instaladas.
RUN yarn workspace @teddy/web build
RUN yarn workspace @teddy/api build

# --- Estágio Final para o Frontend (Servidor Nginx para o SPA/Frontend) ---
# Usa uma imagem Nginx leve para servir os arquivos estáticos da aplicação web.
FROM nginx:1.27-alpine AS production-web

# Remove a configuração padrão do Nginx para evitar conflitos.
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx para o seu aplicativo web.
# Certifique-se de que `apps/web/nginx.conf` existe e está configurado corretamente.
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos (HTML, CSS, JS) construídos do estágio 'builder'.
# O caminho AGORA é `/usr/src/app/apps/web/dist` porque o build ocorre dentro do diretório do workspace.
COPY --from=builder /usr/src/app/apps/web/dist /usr/share/nginx/html

# Expõe a porta padrão do HTTP (80) para acesso externo.
EXPOSE 80

# Comando para iniciar o servidor Nginx em primeiro plano.
CMD ["nginx", "-g", "daemon off;"]

# --- Estágio Final para a API (Servidor Node.js) ---
# Usa uma imagem Node.js leve para o ambiente de execução da API.
FROM node:22-alpine AS production-api

# Define o diretório de trabalho para a API.
# Reverte o WORKDIR para a raiz do monorepo para que o Yarn possa encontrar o projeto.
WORKDIR /usr/src/app

# Copia os arquivos essenciais do monorepo para este estágio.
# Isso inclui package.json e yarn.lock da raiz, e a pasta .yarn/
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/.yarn/ ./.yarn/

# Copia as pastas de workspaces para que o Yarn possa reconhecer a topologia do monorepo.
# Isso é crucial para `yarn workspaces focus` funcionar corretamente.
COPY --from=builder /usr/src/app/apps/ ./apps/
COPY --from=builder /usr/src/app/packages/ ./packages/
# Adicione outras pastas de workspaces se houver (ex: libs/)

# Habilita o Corepack e prepara o Yarn na versão desejada novamente.
# Necessário porque é um novo estágio e um novo contexto de Yarn.
RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

# Instala apenas as dependências de produção para o workspace da API.
# O Yarn é executado na raiz do monorepo e foca no workspace `@teddy/api`.
RUN yarn workspaces focus --production @teddy/api

# Copia os artefatos de build da API do estágio 'builder'.
# O caminho de origem é `/usr/src/app/apps/api/dist` (no builder).
# O destino é `./apps/api/dist` (relativo ao WORKDIR atual, que é /usr/src/app).
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist

# Expõe a porta que a aplicação API irá escutar (ex: 4000).
# Certifique-se de que esta porta corresponde à porta que sua API realmente escuta.
EXPOSE 4000

# Comando para iniciar a aplicação API.
# O `main.js` agora está em `./apps/api/dist/main.js` relativo ao WORKDIR atual da API.
# Usamos --require ./.pnp.cjs para que o Node.js possa resolver os módulos com o Yarn PnP.
CMD ["node", "--require", "./.pnp.cjs", "apps/api/dist/main.js"]