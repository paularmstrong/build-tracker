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
module.exports = {
  // other config options
  onCompare: result => {
    const failingGroupDeltas = result.groupDeltas.filter(delta => delta.failingBudgets.length > 0);
    const failingArtifactDeltas = result.artifactDeltas.filter(delta => delta.failingBudgets.length > 0);

    if (failingGroupBudgets.length === 0 && failingArtifactDeltas.length === 0) {
      process.stdout.write('✅ All clear!');
      return;
    }

    failingGroupDeltas.map(delta => {
      const { warn, error } = delta.failingBudgets.reduce(
        (memo, budget) => {
          memo[budget.level] = budget;
          return memo;
        },
        { warn: [], error: [] }
      );
      if (error.length) {
        process.stdout.write(`🚫 ${delta.name} failed the following budgets:`);
        error.forEach(
          budget =>
            `* expected ${budget.type} to be less than ${budget.expected} but received${delta.sizes[budget.sizeKey]}`
        );
      }
      if (warn.length) {
        process.stdout.write(`⚠️ ${delta.name} failed the following budgets:`);
      }
      // etc
    });
  }
};
```

## Linking directly to a build comparison

The Build Tracker web application accept links directly to a comparison of one or more builds in the format: `/builds/:revisions+`.

For example, to link to a comparison of two builds:

[/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744](https://build-tracker-demo.herokuapp.com/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744)
