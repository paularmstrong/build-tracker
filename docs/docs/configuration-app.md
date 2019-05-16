---
id: configuration-app
title: App configuration
sidebar_label: Application
---

Create a `build-tracker.config.js` file.

## Example

```js
module.exports = {
  defaultBranch: 'master'
};
```

### `defaultBranch?: string = 'master'`

Your application will graph this branch by default and ignore builds from other branches.

This is a useful setting if you use and track a branch that is not `master` in your git repository. For example, Build Tracker uses `next` as its default working branch.
