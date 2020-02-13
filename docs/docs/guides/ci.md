---
id: ci
title: Continuous Integration
---

The [Build Tracker CLI](../ci) is a handy tool to make uploading new builds from your CI environment simple.

# Uploading a new build

Using the CLI from `@build-tracker/cli`, once you've set up your [configuration file](../cli#configuration) you can upload a new build with a single command:

```shell
yarn bt-cli upload-build
```

## Reporting budget results

The response from the Build Tracker API is sent back to the [`onCompare`](../cli#oncompare-data-apiresponse-promise-void) callback function in your configuration and has many useful pieces of information.

There are two items that are particularly useful here: `groupDeltas` and `artifactDeltas`. We can use these and filter on those with failing budgets to format a nice message.

```js
const Comparator = require('@build-tracker/comparator').default;

const applicationUrl = 'https://my-application-url.local';

module.exports = {
  applicationUrl,
  // ... other config options
  onCompare: async data => {
    // Post the constructed markdown as a comment
    return GithubApi.postComment(data.markdown);
  }
};
```

## Linking directly to a build comparison

The Build Tracker web application accept links directly to a comparison of one or more builds in the format: `/builds/:revisions+`.

For example, to link to a comparison of two builds:

[/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744](https://build-tracker-demo.herokuapp.com/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744)
