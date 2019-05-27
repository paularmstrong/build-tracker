---
id: version-1.0.0-installation
title: Installation
sidebar_label: Getting Started
original_id: installation
---

## Quick Start

### Set up your server

Install the Build Tracker server:

```sh
yarn add @build-tracker/server@latest
```

Create a configuration file, `build-tracker.config.js`.

At a minimum, use one of the [available database plugins](plugins/plugins) and add the `url` where your application will be accessible.

For this quick start, we'll use Postgres. We'll assume your database is already up and running.

```js
const withPostgres = require('@build-tracker/withPostgres').default;
module.exports = withPostgres({
  url: 'https://your-build-tracker-app',
  pg: {
    user: 'myuser',
    password: 'mypassword',
    host: '127.0.0.1',
    database: 'buildtracker'
  }
});
```

### Run the server

```sh
yarn bt-server
```

When the server is run, the Postgres database plugin will automatically create any tables and structures needed.

Your application will now be accessible at the provided `url`.

### Upload your builds

Along with your application code, install the Build Tracker CLI in the same repository as the application code you want to track:

```sh
yarn add @build-tracker/cli@latest
```

Create a configuration file, `build-tracker.config.js`

You will need, at a minimum, the `applicationUrl` string, and `artifacts` search locations set. For the full set of CLI options, refer to the [cli docs](cli).

```js
module.exports = {
  applicationUrl: 'https://your-build-tracker-app', // The same as your server config `url`
  artifacts: ['dist/**/*.js'] // an Array of glob-style file paths
};
```

```sh
git commit # ensure you don't have a dirty work tree
yarn build # build your application
yarn bt-cli upload-build
```

Your build stats will be uploaded to Build Tracker now. Be sure to upload more than one build to start getting the benefits out of the delta-based comparisons that Build Tracker provides!
