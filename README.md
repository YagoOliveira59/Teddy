# Teddy

---

## Rodando a Aplicação
Para facilitar o desenvolvimento e garantir um ambiente consistente, aplicação foi configurada para rodar em modo desenvolvimento e utilizando Docker. Isso permite isolar as dependências e replicar o ambiente de produção localmente.

### Requisitos
Node.js e npm (ou Yarn): Para rodar o front-end (React) e o back-end (NestJS) em modo dev.
Postgres

Docker Desktop: Inclui o Docker Engine e Docker Compose, essenciais para gerenciar contêineres e serviços.

### Modo desenvolvimento

Clone o repositorio

Na raiz do projeto execute

```
yarn install
```

Ajuste o .env da api para se conectar corretamente a sua instancia Postgres

Para rodar o frontend
```
yarn run dev:web
```
O app pode ser acessada em http://localhost:4000/api#/



Para rodar o backend
```
yarn run dev:api
```

A api pode ser acessada em http://localhost:4000/api#/

### Docker

Clone o repositorio

Na raiz do projeto execute
```
yarn install
```

```
docker compose up -d --build
```


### Teste

Na raiz do projeto execute

```
npx jest --config apps/api/jest.config.ts
```


## Estimativa para o Desenvolvimento do Painel Administrativo

Para o desenvolvimento do painel administrativo, que inclui **gestão de clientes (CRUD - Criar, Ler, Atualizar, Excluir)**, uma tela de **visualização de clientes selecionados**, e a tela inicial para inserção do nome do usuário, apresento as seguintes estimativas:

### 1. Quanto tempo levaria?

Considerando as funcionalidades básicas e um fluxo de trabalho eficiente, estimamos um prazo de **1 a 2 semanas**.

Isso inclui:

* **Planejamento e Design (2-4 dias):** Definição de wireframes, protótipos de baixa fidelidade e arquitetura básica.
* **Desenvolvimento Front-end (2-3 dias):** Implementação das interfaces de usuário para as telas de login/nome, lista de clientes, formulário de cadastro/edição e visualização de selecionados.
* **Desenvolvimento Back-end (3-5 dias):** Criação das APIs para gerenciar o CRUD de clientes e a lógica de persistência de dados.
* **Testes e Ajustes (1-2 dias):** Realização de testes de funcionalidade, usabilidade e correção de bugs.

### 2. Quantos desenvolvedores?

Para otimizar o tempo e garantir a qualidade, o ideal seria uma equipe de **2 desenvolvedores**:

* **1 Desenvolvedor Front-end:** Focado na experiência do usuário e na construção das interfaces.
* **1 Desenvolvedor Back-end:** Responsável pela lógica do servidor, banco de dados e APIs.

### 3. Qual a senioridade dos desenvolvedores?

Para um projeto com esse escopo e buscando eficiência, a senioridade dos desenvolvedores é crucial:

* **Desenvolvedor Front-end: Júnior a Pleno**
    * **Júnior:** Com supervisão e requisitos bem definidos, pode contribuir significativamente na implementação das interfaces.
    * **Pleno:** Adequado para maior autonomia na escolha de *frameworks*, otimização de performance e garantia de uma boa experiência do usuário.
* **Desenvolvedor Back-end: Júnior a Pleno**
    * **Júnior:** Pode trabalhar na criação de APIs e lógica de persistência de dados sob orientação, especialmente se a arquitetura já estiver definida.
    * **Pleno:** Capaz de lidar com a complexidade de persistência de dados, segurança básica e integração de APIs, garantindo a integridade dos dados e criando APIs robustas.

Essa configuração visa um desenvolvimento ágil e eficaz, minimizando retrabalhos e garantindo a entrega de um painel administrativo funcional e de qualidade.


---
## Arquitetura do Sistema na AWS com Tecnologias Específicas

Com as tecnologias **NestJS + TypeORM (API)**, **PostgreSQL (Banco de Dados)** e **Vite + React (Front-end)** em mente, a arquitetura na AWS pode ser refinada para otimizar o desempenho e a gestão.

---

### Componentes Principais e Serviços AWS Sugeridos

Vamos detalhar os componentes e as tecnologias AWS que se encaixam melhor para cada parte do seu sistema, considerando as tecnologias que você já definiu:

#### **1. Front-end (Vite + React)**

* **Tecnologias:** Vite, React, HTML, CSS, JavaScript/TypeScript.
* **Serviço AWS:** **Amazon S3** e **Amazon CloudFront**.
    * **S3 (Simple Storage Service):** É o local ideal para hospedar os arquivos estáticos do seu *front-end* (`.html`, `.css`, `.js`, imagens, etc.) gerados pelo Vite. É um serviço de armazenamento de objetos altamente durável, escalável e de baixo custo.
    * **CloudFront:** Como uma Rede de Entrega de Conteúdo (CDN), o CloudFront distribuirá o seu *front-end* globalmente através de pontos de presença (*edge locations*), armazenando-o em *cache*. Isso garante que seus usuários acessem o site com baixa latência e alta velocidade.

#### **2. Back-end (NestJS + TypeORM)**

* **Tecnologias:** NestJS (Node.js), TypeORM (ORM para TypeScript), TypeScript.
* **Serviço AWS:** **AWS Fargate (com Amazon ECS)** ou **AWS EC2**.
    * **AWS Fargate com Amazon ECS (Elastic Container Service):** Esta é a opção mais recomendada por ser *serverless* em termos de gerenciamento de servidor. Você empacota sua aplicação NestJS em um contêiner Docker, e o Fargate se encarrega de provisionar e escalar a capacidade de computação. Isso simplifica o gerenciamento da infraestrutura, permitindo que você foque no código.
    * **AWS EC2 (Elastic Compute Cloud):** Se você preferir ter mais controle sobre o ambiente do servidor ou tiver requisitos específicos que exigem uma máquina virtual dedicada, pode usar instâncias EC2. Nesse caso, você precisaria gerenciar o sistema operacional, as dependências do Node.js e o deploy da aplicação NestJS.

    * **Load Balancer (ELB/ALB):** Se optar por Fargate ou EC2 com mais de uma instância para alta disponibilidade e escalabilidade, um **Application Load Balancer (ALB)** é essencial para distribuir o tráfego entre suas instâncias da aplicação NestJS.

#### **3. Banco de Dados (PostgreSQL com TypeORM)**

* **Tecnologias:** PostgreSQL, TypeORM (como ORM).
* **Serviço AWS:** **Amazon RDS for PostgreSQL**.
    * **Amazon RDS (Relational Database Service) for PostgreSQL:** O RDS é um serviço de banco de dados relacional gerenciado pela AWS. Ele simplifica a administração de bancos de dados PostgreSQL, cuidando de tarefas como *patches*, *backups*, recuperação de falhas e escalabilidade. Isso permite que sua aplicação NestJS, usando TypeORM, se conecte a um banco de dados PostgreSQL robusto sem a complexidade de gerenciamento de infraestrutura.

#### **4. Gerenciamento de Identidade e Acesso (Autenticação/Autorização)**

* **Serviço AWS:** **Amazon Cognito**.
    * **Cognito:** Para gerenciar a tela inicial de inserção de nome, caso você precise de um sistema de usuários mais robusto (com registro, login, etc.), o Cognito é ideal. Ele oferece *user pools* para gerenciar diretórios de usuários e pode ser integrado facilmente com sua API NestJS para controle de acesso.

#### **5. Monitoramento e Logs**

* **Serviço AWS:** **Amazon CloudWatch** e **AWS X-Ray (Opcional)**.
    * **CloudWatch:** Coletará e monitorará logs, métricas e eventos de todos os serviços AWS utilizados (S3, CloudFront, Fargate/EC2, RDS, Cognito). Essencial para depuração, monitoramento de performance e alarmes.
    * **AWS X-Ray:** Para um rastreamento mais aprofundado das requisições através de seus microserviços (da API ao banco de dados), o X-Ray pode ajudar a identificar gargalos de performance e depurar problemas em tempo real.

---

### Fluxo de Funcionamento da Arquitetura

1.  **Usuário Acessa o Sistema:** O usuário digita a URL do sistema no navegador.
2.  **CloudFront e S3:** O **CloudFront** entrega o *front-end* estático (React bundle) do **S3** para o navegador do usuário.
3.  **Inserção de Nome (Tela Inicial) / Interação:** O *front-end* React coleta o nome do usuário e interage com o sistema. Para operações CRUD de clientes, o React faz requisições HTTP para o **Application Load Balancer (ALB)**.
4.  **ALB para Fargate/EC2:** O **ALB** distribui as requisições para as instâncias da sua aplicação NestJS rodando em **AWS Fargate** (ou **EC2**).
5.  **NestJS para Banco de Dados:** A aplicação NestJS (usando TypeORM) se conecta ao **Amazon RDS for PostgreSQL** para realizar as operações de persistência, consulta, atualização e exclusão de dados dos clientes.
6.  **Resposta:** O RDS retorna os dados para o NestJS, que processa e envia a resposta de volta para o ALB, e então para o *front-end* React.
7.  **Visualização:** O *front-end* React atualiza a interface do usuário, exibindo a lista de clientes ou a tela de visualização de clientes selecionados.
8.  **Monitoramento:** O **CloudWatch** (e opcionalmente o X-Ray) coleta logs e métricas de todos os serviços para garantir o bom funcionamento e a observabilidade do sistema.

---
````
### Diagrama Simplificado da Arquitetura

+---------------------+           +---------------------+
|   Usuário (Browser)     | --------> |   Amazon CloudFront     |
+---------------------+           +-----------+---------+
                                    |
                                    | (HTTPS)
                                    v
                            +---------+---------+
                            |     Amazon S3       |  (Front-end: Vite/React estático)
                            +---------+---------+
                                    |
                                    | (Requisições API HTTPS)
                                    v
                            +---------+---------+
                            | Application Load    | (Distribui o tráfego)
                            | Balancer (ALB)      |
                            +---------+---------+
                                    |
                                    | (Tráfego interno)
                                    v
                            +---------+---------+
                            | AWS Fargate / EC2   | (Back-end: NestJS + TypeORM)
                            | (Contêiner Docker)  |
                            +---------+---------+
                                    |
                                    | (SQL/DB Conexão)
                                    v
                            +---------+---------+
                            | Amazon RDS for      | (Banco de Dados: PostgreSQL)
                            | PostgreSQL          |
                            +---------+---------+

+-------------------------------------------------------------+
|                     Amazon CloudWatch                     |
| (Monitoramento, Logs, Métricas de todos os serviços)        |
+-------------------------------------------------------------+
|                     Amazon Cognito                        |
| (Gerenciamento de Identidade e Autenticação - Opcional)     |
+-------------------------------------------------------------+