# Node Express Rest API

This is a simple boilerplate for a REST API using Node and Express.

## Technologies

- express : Web server framework.
- dotenv : Loads environment variables from a .env file.
- passport : Authentication middleware.
- jsonwebtoken : JWT implementation.
- winston : Node.js logger.
- zod : Schema validation.
- prisma : ORM.
- helmet : Security middleware.
- cors : CORS middleware.
- passport: Authentication middleware.
- cross-env : Cross-platform environment variables.
- resend: Email service.
- bcrypt: Password hashing.

## Getting Started

1. Clone the repository
2. For install dependencies, run:

```bash
yarn install
```

3. For run the project, run:

```bash
yarn dev
```

## Run Docker

```bash
yarn docker:dev
```

Run prisma migrations:

```bash
yarn prisma:migrate
```

## TODO

- [ ] Add React Email for templates (react-email)
- [ ] Add cronjobs for delete expired tokens (node-cron)
- [ ] Add documentation
- [ ] Add CI/CD
