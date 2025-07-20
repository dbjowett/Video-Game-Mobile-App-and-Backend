## Description

Made with Nest.js

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod

# copy example env file
$ cp .example.env .env
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Nest.js Errors Reference

| Use Case                                 | Exception Class                                        | HTTP Status                 |
| ---------------------------------------- | ------------------------------------------------------ | --------------------------- |
| Missing user or item                     | `NotFoundException`                                    | `404 Not Found`             |
| Invalid input (e.g. body, params)        | `BadRequestException`                                  | `400 Bad Request`           |
| User not logged in                       | `UnauthorizedException`                                | `401 Unauthorized`          |
| User lacks permission                    | `ForbiddenException`                                   | `403 Forbidden`             |
| Duplicate resource (e.g. already exists) | `ConflictException`                                    | `409 Conflict`              |
| External service / unexpected failure    | `InternalServerErrorException`                         | `500 Internal Server Error` |
| Request too large or rate-limited        | `PayloadTooLargeException`, `TooManyRequestsException` | `413`, `429`                |
