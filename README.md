# TypeScript SQL Production Template

This repository provides a production-ready template for building Node.js applications with TypeScript and Sequelize ORM. It follows best practices for scalability, security, error handling, and logging, making it ideal for enterprise-level applications.

## Table of Contents

-   [Features](#features)
-   [Technologies](#technologies)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Environment Variables](#environment-variables)
-   [Scripts](#scripts)
-   [Error Handling](#error-handling)
-   [Logging](#logging)
-   [Rate Limiting](#rate-limiting)
-   [Database Migrations](#database-migrations)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   **TypeScript** for type safety and scalability.
-   **Sequelize ORM** for database management.
-   **Winston logger** integrated with MySQL for storing logs.
-   **Rate limiting** for controlling API request rates.
-   **Dotenv-flow** for environment variable management.
-   **Migrations** using Sequelize for database version control.
-   **Production-ready error handling**.
-   **Log rotation** and **auto-deletion** of logs after 30 days.
-   **Environment-based configuration** (no SQL queries in production terminal).

## Technologies

-   [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Sequelize ORM](https://sequelize.org/) and [Sequelize CLI](https://github.com/sequelize/cli)
-   [MySQL](https://www.mysql.com/)
-   [Winston Logger](https://github.com/winstonjs/winston)
-   [Rate Limiter Flexible](https://www.npmjs.com/package/rate-limiter-flexible)
-   [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) for managing environment variables

## Installation

To get started with this template, clone the repository and install the dependencies:

```bash
git clone https://github.com/shanisharrma/ts-sql-production-template.git
cd ts-sql-production-template
npm install
```

## USAGE

1. Set up environment variables as given inside the `.env.example` file by creating a `.env.development` file for development and `.env.production` file for production in the root directory. Check Environment Variables for more details.
2. Run the application in development mode:

```bash
npm run dev
```

3. Run the application in production mode:

```bash
npm run start
```

4. For creating new models and migrations can use [sequelize-cli commands](https://github.com/sequelize/cli) (after creating models and migration must convert them to typescript files)

5. If you face any problem while connecting to sequelize with this project please consider this article [click here.](https://thriveread.com/sequelize-migrations-with-typescript/)

## Project Structure

```bash
├── .husky
├── docker
    ├── development/            # Docker Configuration for development
    └── production/             # Docker Configuration for development
├── logs                        # Winston log files, separate files for each environment
├── nginx
├── public                      # Stores all the static files
├── scripts                     # Additional scripting files
├── src/
    ├── controllers/            # All API controllers
    ├── database/               # Sequelize models, migrations, and configurations
        ├── models/             # All models files
        ├── migrations/         # All migrations files
        └── seeders/            # All seeder files
    ├── middlewares/            # Custom middleware (error handling, rate limiting)
        └── error-handlers/     # Global Error Handlers
    ├── repositories            # Database Model connection
    ├── routes                  # All API routes (v1, v2, etc.)
    ├── schemas/                # All the request body validation schema
    ├── services/               # Business logic services
    ├── types/                  # Stores all the types defined in typescript
    ├── utils/                  # Utility functions and helpers
        ├── commons/            # Common files for every files
        ├── constants/          # Enums and Application's constant string variables
        ├── errors/             # Error Object
        └── helpers/            # Helper functions
    ├── config/                 # Configuration files
    └── view/                   # View files for template engines
└──tests
```

## Environment Variables

```bash
# General Configuration Variables
ENV=<node_environment>
PORT=<port>
SERVER_URL=<Server_URL>

# Database Configuration Variables
DB_HOST=<database_host>
DB_USER=<database_user>
DB_PASSWORD=<database_password>
DB_NAME=<database_name>

# Rate Limiting Variables
RATE_LIMIT_MAX=<maximum_requests>
RATE_LIMIT_WINDOW=<time_window_in_seconds>
RATE_LIMIT_BLOCK_WINDOW=<block_time_window_in_seconds>
```

## Scripts

1. `npm run dev`: Run the development server.

2. `npm run start`: Run the production server.

3. `npm run lint`: Lint the TypeScript code.

4. `npm run dist`: Build the TypeScript code into JavaScript.

5. `npm run db:migrate:dev`: Run this to migrate all the required db migrations for development.

6. `npm run db:migrate:prod`: Run this to migrate all the required db migrations for production.

## Error Handling

This template uses a centralized error handling system to catch and process all errors. Error messages are stored in a centralized location for easy management and translation.

## Logging

The application uses Winston for logging. All logs are stored in the MySQL database and rotated automatically. Logs older than 30 days are automatically deleted.

You can control the log level via environment variables (but we are statically controlling in `logger.ts` file):

```bash
LOG_LEVEL=info
```

## Rate Limiting

To prevent API abuse, `rate-limiter-flexible` is implemented to control the number of requests a user can make in a given time frame. Configure the rate limit via environment variables:

```bash
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60 # 60 seconds
RATE_LIMIT_BLOCK_WINDOW=600 # 600 seconds
```

## Database Migrations

Sequelize migrations are used for database versioning. Run the following command to execute migrations:

```bash
# basic migration command for sequelize ORM
npx sequelize-cli db:migrate

# the above command will run if we are using dotenv lib but here we are using dotenv-flow and cross-env lib
# for dynamically change of environments
# so use `npx cross-env NODE_ENV=development` before every sequelize command to run in development environment
# and for production use NODE_ENV as production instead of development
# below command is for development environment
npx cross-env NODE_ENV=development sequelize-cli db:migrate

# we have described scripts in `package.json` file so use those command at the time of initialization.
```

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You can adapt this template based on any additional project-specific details. Let me know if you'd like to adjust anything!
