# @build-tracker/plugin-with-postgres

A server-configuration plugin for Build Tracker to enable reading build data from a Postgres database.

Wrap your server's `build-tracker.config.js` configuration with `withPostgres` and include the `pg` options object:

```js
const withPostgres = require('@build-tracker/plugin-with-postgres');

module.exports = withPostgres({
  pg: {
    connectionString: '', // default: process.env.DATABASE_URL
    user: '', // default: process.env.PGUSER
    host: '', // default: process.env.PGHOST
    database: '', // default: process.env.PGPASSWORD
    password: '', // default: process.env.PGDATABASE
    port: 5432, // default: process.env.PGPORT
    ssl: true
  }
});
```

## Configuration

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
