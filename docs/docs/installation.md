---
id: installation
title: Installation
sidebar_label: Getting Started
---

## Quick Start

### Set up your server

Install the Build Tracker server:

```sh
yarn add @build-tracker/server
```

Create a configuration file, `build-tracker.config.js`

```js
module.exports = {
  // TODO
};
```

### Run the server

```sh
yarn build-tracker
```

### Upload your builds

Along with your application code, install the Build Tracker CLI:

```sh
yarn add @build-tracker/cli
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
yarn build-tracker upload-build
```
