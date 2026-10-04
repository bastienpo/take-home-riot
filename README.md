# Riot take-home assignment

## Description

This project implements the Riot take-home assignment.

The project uses:

- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Zod](https://zod.dev/) (Schema validation)
- [Scalar](https://scalar.com/) (API documentation)

## How to run the project

To install dependencies:

```sh
bun install
```

To run:

```sh
export HMAC_SECRET="$(openssl rand -hex 32)"
bun run dev
```

`Scalar` is available at http://localhost:3000/scalar for quick testing. The OpenAPI specification is available at http://localhost:3000/openapi.json.

The `HMAC_SECRET` and `PORT` environment variables can be set in a `.env` file.

### Run with Docker

From the project root, build the Docker image:

```sh
docker build -t take-home-riot .
```

Run the server with your HMAC secret:

```sh
docker run --rm -p 3000:3000 -e PORT=3000 -e HMAC_SECRET take-home-riot
```

The application defaults to port 3000 when `PORT` is unset.

## Structure of the project

```
take-home-riot/
├── src/
│   ├── app.ts
│   ├── env.ts
│   ├── index.ts
│   └── features/
│       ├── encryption/
│       │   ├── base64-encryption.service.ts
│       │   ├── decrypt-fields.test.ts
│       │   ├── decrypt-fields.ts
│       │   ├── dto.ts
│       │   ├── encrypt-fields.ts
│       │   ├── encrypt-fields.test.ts
│       │   ├── encryption.service.ts
│       │   └── route.ts
│       └── signing/
│           ├── canonical-json.ts
│           ├── dto.ts
│           ├── hmac-signing.service.ts
│           ├── route.ts
│           ├── sign.test.ts
│           ├── signing.service.ts
│           └── verify.test.ts
└── tests/
    ├── integration/
    │   ├── encryption.test.ts
    │   └── signing.test.ts
    └── utils/
        └── http.ts
```

## Architecture

There are two self-contained modules. Each declares its own routes, DTOs, service interface, and implementation.

### Encryption and decryption

This module provides the two POST routes `/encrypt` and `/decrypt`. It exposes an `EncryptionService` interface with a Base64 encoding implementation, `base64EncryptionService`. The interface allows the implementation to be replaced.

### Signing

This module provides the two POST routes `/sign` and `/verify`. It follows the same approach as the encryption module, exposing a `SigningService` interface with an HMAC-SHA-256 implementation created by `createHmacSigningService`.

## Design choices

### OpenAPI as the API specification

The project uses `@hono/zod-openapi` for the following reasons:

1. It provides runtime validation from a single source of truth.
2. It generates the API specification (`openapi.json`) and supports quick testing through Scalar.

The project also uses T3 Env to validate environment variables, including the HMAC secret. The server validates both incoming requests and its configuration at runtime.

### Testing

The project has two types of tests:

1. Unit tests validate the behavior required by the assignment. In a production project, these tests would cover the core business logic. They are located alongside the code they test.
2. Integration tests check the complete API flow, including request validation, response bodies, and status codes.

### Code quality

The project uses the default rules of [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html).

To run the linter and formatter, use:

```sh
bun run lint
bun run format
```

The project also uses [fallow](https://github.com/fallow-rs/fallow) to check code complexity and detect dead and duplicate code.

To run Fallow:

```sh
bun run fallow
```

The project targets a file health score of at least 90 out of 100.
