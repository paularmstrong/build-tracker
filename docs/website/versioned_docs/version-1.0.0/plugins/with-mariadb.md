---
id: version-1.0.0-withMariadb
title: MariaDB
original_id: withMariadb
---

Connecting your Build Tracker application to a Maria database is easy with the help of `@build-tracker/plugin-with-mariadb`

## Installation

```sh
yarn add @build-tracker/plugin-with-mariadb@latest
# or
npm install --save @build-tracker/plugin-with-mariadb@latest
```

## Configuration

Edit your `build-tracker.config.js` file and compose your output configuration:

```js
const withMariadb = require('@build-tracker/plugin-with-mariadb');

module.exports = withMariadb({
  pg: {
    user: '', // default: process.env.MARIAUSER
    host: '', // default: process.env.MARIAHOST
    database: '', // default: process.env.MARIADATABASE
    password: '', // default: process.env.MARIAPASSWORD
    port: 3306 // default: process.env.MARIAPORT
  }
});
```

All configuration options that are able to fall back on `process.env` environment variables can be written to your systems `ENV` or to a local `.env` file via [dotenv](https://github.com/motdotla/dotenv#readme).

### `host: string = process.env.MARIAHOST`

Database host.

### `database: string = process.env.MARIAPASSWORD`

Database name.

### `user: string = process.env.MARIAUSER`

Database username with read access.

### `password: string = process.env.MARIADATABASE`

Password for the given database username.

### `port: number = process.env.MARIAPORT = 3306`

Database host port.
