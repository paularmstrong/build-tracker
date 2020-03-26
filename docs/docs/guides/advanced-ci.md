---
id: advanced-ci
title: Continuous Integration
---

## Uploading a new build

Using the API integration from `@build-tracker/cli`, once you've set up your [configuration file](/docs/packages/api-client#configuration) you can upload a new build with a single command:

```shell
yarn bt-cli upload-build
```

### Reporting budget results

The response from the Build Tracker API is sent back to the [`onCompare`](/docs/packages/api-client#oncompare-data-apiresponse-promise-void) callback function in your configuration and has many useful pieces of information.

There are two items that are particularly useful here: `groupDeltas` and `artifactDeltas`. We can use these and filter on those with failing budgets to format a nice message.

```js
const Comparator = require('@build-tracker/comparator').default;

const applicationUrl = 'https://my-application-url.local';

const last = (xs) => xs[xs.length - 1];

module.exports = {
  applicationUrl,
  // ... other config options
  onCompare: async (data) => {
    const { comparatorData, summary } = data;
    // Reconstruct a comparator from the serialized data
    const comparator = Comparator.deserialize(comparatorData);

    const build = last(comparator.builds);

    const table = comparator.toMarkdown({ artifactFilter });
    const revisions = `${build.getMetaValue('parentRevision')}/${build.getMetaValue('revision')}`;
    const output = `${summary.join('\n')}

${table}

See the full comparison at [${applicationUrl}/builds/${revisions}](${applicationUrl}/builds/${revisions})`;

    // Post the constructed markdown as a comment
    return await GithubApi.postComment(output);
  },
};

// Filter out any rows from the markdown table that are not failing or did not have a hash change
const artifactFilter = (row) => {
  return row.some((cell) => {
    if (cell.type === 'delta') {
      return cell.failingBudgets.length > 0 || cell.hashChanged;
    }
    return false;
  });
};
```

### Linking directly to a build comparison

The Build Tracker web application accept links directly to a comparison of one or more builds in the format: `/builds/:revisions+`.

For example, to link to a comparison of two builds:

[/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744](https://build-tracker-demo.herokuapp.com/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744)
