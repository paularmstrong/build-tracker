---
id: withMysql
title: MySQL
---

Connecting your Build Tracker application to a MySQL database is easy with the help of `@build-tracker/plugin-with-mysql`

## Installation

```sh
yarn add @build-tracker/plugin-with-mysql@latest
# or
npm install --save @build-tracker/plugin-with-mysql@latest
```

## Configuration

Edit your `build-tracker.config.js` file and compose your output configuration:

```js
const withMysql = require('@build-tracker/plugin-with-mysql');

module.exports = withMysql({
  mysql: {
    user: '', // default: process.env.MYSQLUSER
    host: '', // default: process.env.MYSQLHOST
    database: '', // default: process.env.MYSQLDATABASE
    password: '', // default: process.env.MYSQLPASSWORD
    port: 3306, // default: process.env.MYSQLPORT
  },
});
```

All configuration options that are able to fall back on `process.env` environment variables can be written to your systems `ENV` or to a local `.env` file via [dotenv](https://github.com/motdotla/dotenv#readme).

### `host: string = process.env.MYSQLHOST`

Database host.

### `database: string = process.env.MYSQLPASSWORD`

Database name.

### `user: string = process.env.MYSQLUSER`

Database username with read access.

### `password: string = process.env.MYSQLDATABASE`

Password for the given database username.

### `port: number = process.env.MYSQLPORT = 3306`

Database host port.
