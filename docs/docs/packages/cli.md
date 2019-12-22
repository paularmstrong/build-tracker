---
id: cli
title: @build-tracker/cli
sidebar_label: @build-tracker/cli
---

Adding the `@build-tracker/cli` package will install a binary available as `bt-cli`. It can be run with `yarn bt-cli` or `npx bt-cli`

> **Important note:** Set up the Build Tracker CLI close to your application's code (in the same repository and workspace). Remember that the configuration for the CLI is **not** the same as the configuration for the [server](./server.md).

## Install

```sh
yarn add @build-tracker/cli@latest
# or
npm install --save @build-tracker/cli@latest
```

To list all commands and help, run `yarn bt-cli --help`

## Configuration

The Build Tracker CLI is easily configured using a [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) compatible file.

Starting from the current working directory, it will look for the following possible sources, in this order:

1. a `build-tracker` property in your `package.json`
2. a `.build-tracerrc` file
3. a `build-tracker.config.js` file exporting a JS object

The .`.build-trackerrc` file (without extension) can be in JSON or YAML format.

Alternately, you can add a filename extension to designate JSON, YAML, or JS format: `.build-trackerrc.json`, `.build-trackerrc.yaml`, `.build-trackerrc.yml`, `.build-trackerrc.js`. You may want to use an extension so that your text editor can better interpret the file, and help with syntax checking and highlighting.

Once one of these is found and parsed, the search will stop and that object will be used.

The configuration search can also be short-circuited by passing a `--config` argument with a path to your configuration file.

### `applicationUrl: string`

The full URL (with scheme) to your application. New builds will be posted to the API available at this URL

```js
module.exports = {
  applicationUrl: 'https://build-tracker-demo.herokuapp.com',
  // OR, if you're running from a subdirectory
  applicationUrl: 'https://mysite.dev/build-tracker'
};
```

### `artifacts: Array<string>`

An array of [glob](https://github.com/isaacs/node-glob#readme) paths to search for your artifacts.

```js
module.exports = {
  artifacts: ['./dist/**/*.js']
};
```

### `baseDir?: string = process.cwd()`

A base directory option to calculate relative paths for your artifacts. This is most often useful for stripping off unwanted paths, like `dist`, though it must be an absolute path on your system. This can be most easily accomplished by using the `path` node API:

```js
module.exports = {
  baseDir: path.join(__dirname, 'dist')
};
```

### `cwd?: string = process.cwd()`

The command working directory. Set this to change the script working path to something else other than `process.cwd()`

```js
module.exports = {
  cwd: path.join(__dirname, '..')
};
```

### `getFilenameHash?: (filename: string) => string | void`

This optional method allows you to extract a filename hash from the built artifact filename. Many applications built with webpack will include a chunk hash in the filename for cache-busting reasons.

It's important to register filename hashes in Build Tracker builds foe each artifact to know if your service is requiring users to redownload files, even though their functional content has not changed.

For example, if your dist folder looks like this:

```
vendor.a64785b.js
main.56acd2e.js
```

You can extract the hash from the filename with a function:

```js
module.exports = {
  getFilenameHash: fileName => {
    const parts = path.basename(fileName, '.js').split('.');
    return parts.length > 1 ? parts[parts.length - 1] : null;
  }
};
```

### `nameMapper?: (filename: string) => string`

Similar to the `getFilenameHash` method above, you may want to strip out parts of the artifact filenames to make them more legible in reports and the application.

```js
const filenameHash = fileName => {
  const parts = path.basename(fileName, '.js').split('.');
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

module.exports = {
  nameMapper: fileName => {
    const hash = filenameHash(fileName);
    const out = fileName.replace(/\.js$/, '');
    return hash ? out.replace(`.${hash}`, '') : out;
  }
};
```

### `buildUrlFormat?: string`

You may want to link each build to a commit. Provide `buildUrlFormat` in the following format to map revision value to an url.

```js
module.exports = {
  buildUrlFormat: 'https://github.com/paularmstrong/build-tracker/commit/:revision'
};
```

### `onCompare?: (data: APIResponse) => Promise<void>`

Take any action on the response from the API.

```js
module.exports = {
  onCompare: data => {
    // send markdown response somewhere…
    GithubApi.postComment(data.markdown);
    return Promise.resolve();
  }
};
```

The data response consists of a lot of useful information. Depending on how you want to report information, you may only need part of it.

```ts
interface APIResponse {
  build: { meta: BuildMeta; artifacts: Array<Artifact> };
  parentBuild: { meta: BuildMeta; artifacts: Array<Artifact> };
  groupDeltas: Array<ArtifactDelta>;
  artifactDeltas: Array<ArtifactDelta>;
  json: ComparisonMatrix; // Object representation of the build comparison chart
  markdown: string; // Markdown table of the build comparison chart
  csv: string; // CSV formatted string of the build comparison chart
}
```

Most likely, you'll care about `groupDeltas` and `artifactDeltas`. These contain information about every group and artifact in your build, compared to its parent.

```ts
interface ArtifactDelta {
  name: string;
  sizes: { [key: string]: number };
  percents: { [key: string]: number };
  hashChanged: boolean;
  budgets: Array<BudgetResult>;
  failingBudgets: Array<BudgetResult>;
}
```

The `failingBudgets` on each `ArtifactDelta` will be an array of budgets that you have configured that have been exceeded in this change.

```ts
interface BudgetResult {
  sizeKey: string;
  passing: boolean;
  expected: number;
  actual: number;
  type: Budget['type'];
  level: Budget['level'];
}
```

## Commands

### `upload-build`

This command will read your configuration file, and upload the current build meta and artifact stats to your server. In most scenarios, this should be all you need.

Beside the arguments below, if you're running your server with a [`BT_API_AUTH_TOKEN` environment variable](./server#securing-your-api), ensure you run this command with that variable available as well.

```
BT_API_AUTH_TOKEN=my-secret-token bt-cli upload-build
```

| option, alias        | description                                             | default                       |
| -------------------- | ------------------------------------------------------- | ----------------------------- |
| `--branch`, `-b`     | Set the branch name and do not attempt to read from git | Current git working branch    |
| `--config`, `-c`     | Set path to the build-tracker CLI config file           | `./build-tracker.config.js`   |
| `--out`, `-o`        | Write the build to stdout                               | `true`                        |
| `--parent-revision`  | Manually set the parent revision for the comparison.    | Determined via git-merge-base |
| `--skip-dirty-check` | Skip the git work tree state check                      | `false`                       |

### `create-build`

This command will create a Build object for the current available build. If run independently, it will only output information, but not upload it anywhere. For that, you only need to run `yarn bt-cli upload-build`.

| option, alias        | description                                             | default                     |
| -------------------- | ------------------------------------------------------- | --------------------------- |
| `--branch`, `-b`     | Set the branch name and do not attempt to read from git | Current git working branch  |
| `--config`, `-c`     | Set path to the build-tracker CLI config file           | `./build-tracker.config.js` |
| `--skip-dirty-check` | Skip the git work tree state check                      | `false`                     |

### `stat-artifacts`

Lower-level than `create-build`, this command will get artifact stats for the current build files and output a JSON representation of them.

| option, alias    | description                                   | default                     |
| ---------------- | --------------------------------------------- | --------------------------- |
| `--config`, `-c` | Set path to the build-tracker CLI config file | `./build-tracker.config.js` |
| `--out`, `-o`    | Write the stats to stdout                     | `true`                      |

### `version`

Output the version number of the `bt-cli`.
