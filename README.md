# qa-junior-playwright-api

## Pré requisitos

1.  **Node.js e npm (ou yarn)**: valide se já está instalado

        ```bash
        node -v
        npm -v
        ```

## Setup

### 1. Clone o repositório

```bash
git clone https://github.com/kalineduttra/qa-junior-playwright-api.git
cd qa-junior-playwright-api
```

### 2. Instala as dependencias

```bash 
npm install
```

### 3. Configure os valores das variáveis de ambiente
```bash 
# copia o arquivo de exemplo e salva essa cópia com o nome de env
cp .env.example .env
```

Para pegar o token visite a url: "https://gorest.co.in/my-account/access-tokens" e após autenticação insira seu token de acesso


### 4. Execute os testes

```bash 
npm test
```
