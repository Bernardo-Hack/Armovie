# Armovie

Bem-vindo ao projeto **Armovie**. Este guia explica passo a passo como configurar o ambiente e rodar os containers da aplicação localmente através do Docker Compose.

O projeto é dividido em uma arquitetura de microsserviços (backend) e um front-end (Expo Web/React Native), todos empacotados via Docker.

## 📋 Pré-requisitos

Certifique-se de ter os seguintes programas instalados na sua máquina:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## ⚙️ Configuração Inicial

Antes de subir os containers, você precisa configurar as variáveis de ambiente necessárias para o banco de dados, chaves de segurança e credenciais de e-mail.

1. Na raiz do projeto, copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` gerado e preencha os valores:
   - `POSTGRES_PASSWORD`: Defina uma senha segura para o banco de dados PostgreSQL.
   - `JWT_SECRET`: Insira uma chave secreta para a geração e validação dos tokens de login.
     - *Dica:* Você pode gerar uma chave segura no terminal executando: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `EMAIL_PROVIDER`, `EMAIL_ADDRESS` e `EMAIL_PASSWORD`: Defina as credenciais do seu e-mail para que o microsserviço de usuários (`ms-user`) consiga enviar os e-mails de recuperação de senha e criação de conta. Se usar Gmail, será necessário criar um *App Password*.

## 🚀 Rodando a Aplicação

Com o `.env` configurado, você pode inicializar toda a infraestrutura através do Docker Compose.

Na raiz do projeto, execute o seguinte comando para construir as imagens e rodar os containers em segundo plano:
```bash
docker compose up -d --build
```

> **Aviso:** Na primeira vez que você rodar esse comando, o Docker fará o download e a compilação de todas as imagens. Isso pode demorar alguns minutos.

### Arquitetura de Containers

O comando acima irá subir os seguintes containers e expor as respectivas portas na sua máquina local:

| Serviço | Container | Porta Local | Descrição |
|---------|-----------|-------------|-----------|
| **Frontend** | `armovie-frontend` | `http://localhost:8081` | Interface da aplicação web |
| **Gateway** | `armovie-gateway` | `http://localhost:3000` | API Gateway que unifica as rotas do backend |
| **MS-User** | `armovie-ms-user` | `http://localhost:5001` | Microsserviço de usuários e autenticação |
| **MS-Item** | `armovie-ms-item` | `http://localhost:5002` | Microsserviço de itens, máquinas e manutenções |
| **MS-Client** | `armovie-ms-client` | `http://localhost:5003` | Microsserviço de clientes, contratos e planos |
| **PostgreSQL** | `armovie-postgres` | `localhost:5432` | Banco de dados (com múltiplos DBs isolados) |

## 🛑 Parando os Containers

Para parar a execução da aplicação sem perder os dados do banco, utilize:
```bash
docker compose down
```

Para parar os containers e **apagar completamente** o banco de dados e os volumes salvos, adicione a flag `-v`:
```bash
docker compose down -v
```

## 🛠️ Manutenção (Prisma DB Push / Migrations)
*(Nota: Se o seu banco for zerado ou for a primeira vez rodando, lembre-se de empurrar o schema do Prisma para o banco de dados acessando a pasta de cada microsserviço de backend e rodando `npx prisma db push`, caso os entrypoints dos Dockerfiles não façam isso automaticamente).*
