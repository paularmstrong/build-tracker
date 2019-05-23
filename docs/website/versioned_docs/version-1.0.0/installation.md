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

Create a configuration file, `build-tracker.config.js`

```js
module.exports = {
  // TODO
};
```

### Run the server

```sh
yarn bt-server
```

### Upload your builds

Along with your application code, install the Build Tracker CLI:

```sh
yarn add @build-tracker/cli@latest
```

Create a configuration file, `build-tracker.config.js`

```js
module.exports = {
  applicationUrl: 'https://your-build-tracker-app',
  artifacts: ['dist/**/*.js']
  // TODO
};
```

```sh
yarn build # build your application
yarn bt-cli upload-build
```
