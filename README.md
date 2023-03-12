## Afya Code Challenger

Projeto desenvolvido em NestJS com TypeORM, que é um framework Node.js. O mesmo utiliza TypeORM como ORM para se comunicar com o banco de dados.

## Pré-Requisitos

- Node.js
- NPM
- Git
- Docker

## Instalação

1 - Clone o repositório em sua máquina:

```bash
$ git clone https://github.com/seu-usuario/nome-do-repositorio.git
```
2- Instale as depedências do projeto:

```bash
$ npm install
```

## Configuração

```bash
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USER=afya
DB_PASS=afya123challenger
DB_DATABASE=afya-db
```

## Execute a aplicação

```bash
$ docker-compose up --build
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Projeto

Este projeto também está hospedado na Cloud do Render, para executar os endpoints basta acessar a documentação oficial -  **[Afya Challenger API](https://afya-challenger.onrender.com/api/documentation)**

![Swagger](https://i.ibb.co/9nTYf6N/Captura-de-tela-de-2023-03-12-12-06-50.png)

