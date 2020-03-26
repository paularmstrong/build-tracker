---
id: withPostgres
title: Postgres
---

Connecting your Build Tracker application to a PostgreSQL database is easy with the help of `@build-tracker/plugin-with-postgres`

## Installation

```sh
yarn add @build-tracker/plugin-with-postgres@latest
# or
npm install --save @build-tracker/plugin-with-postgres@latest
```

## Configuration

Edit your `build-tracker.config.js` file and compose your output configuration:

```js
const withPostgres = require('@build-tracker/plugin-with-postgres').default;

module.exports = withPostgres({
  pg: {
    connectionString: '', // default: process.env.DATABASE_URL
    user: '', // default: process.env.PGUSER
    host: '', // default: process.env.PGHOST
    database: '', // default: process.env.PGDATABASE
    password: '', // default: process.env.PGPASSWORD
    port: 5432, // default: process.env.PGPORT
    ssl: true,
  },
});
```

All configuration options that are able to fall back on `process.env` environment variables can be written to your systems `ENV` or to a local `.env` file via [dotenv](https://github.com/motdotla/dotenv#readme).

### `connectionString: string = process.env.DATABASE_URL`

Optional. Use a single connection string to bypass the individual configs for `host`, `database`, `user`, `password`, and `port`.

### `host: string = process.env.PGHOST`

Database host.

### `database: string = process.env.PGPASSWORD`

Database name.

### `user: string = process.env.PGUSER`

Database username with read access.

### `password: string = process.env.PGDATABASE`

Password for the given database username.

### `port: number = process.env.PGPORT = 5432`

Database host port.

### `ssl: boolean = false`

Set to true to connect to your host using SSL (if supported).
