---
id: api-client
title: '@build-tracker/api-client'
sidebar_label: '@build-tracker/api-client'
---

The `@build-tracker/api-client` package includes node.js functions for creating and uploading builds to your Build Tracker instance’s API.

> **Important note:** Set up the Build Tracker API configuration close to your application's code (in the same repository and workspace). Remember that the configuration for the API is **not** the same as the configuration for the [server](./server.md).

## Install

```sh
yarn add @build-tracker/api-client@latest
# or
npm install --save @build-tracker/api-client@latest
```

## Configuration

The Build Tracker API is easily configured using a [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) compatible file.

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

### `getFilenameHash?: (filename: string) => string | null`

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
    GithubApi.postComment(data.summary.join('\n'));
    return Promise.resolve();
  }
};
```

The data response consists of a lot of useful information. Depending on how you want to report information, you may only need part of it.

```ts
interface APIResponse {
  // JSON serialized string that can be read back into a `Comparator` instance
  comparatorData: string;
  // Summary response from the original Comparator object
  summary: Array<string>;
}
```

More can be done with the data. Check out the [Continuous Integration guide](guides/ci.md) for more ideas.

## API

### `getConfig(path?: string): Promise<Config>`

Reads your Build Tracker Utility configuration. If a path is not provided, this will use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find the appropriate file.

```js
import { getConfig } from '@build-tracker/api-client';

const config = await getConfig();
```

### `createBuild(config: Config, opts: Options): Promise<Build>`

Creates a JSON-friendly build configuration, suitable for POSTing to the Build Tracker API.

```js
import { createBuild, getConfig } from '@build-tracker/api-client';

const config = await getConfig();
createBuild(config, {
  branch: 'master', // optional, in case your git state is not on a branch
  meta: {}, // optional additional metadata to provide in the build
  parentRevision: '123456', // optional, in case your git state cannot find the merge-base
  skipDirtyCheck: false // set to true to bypass enforcing no local changes in your git work tree
}).then(build => {
  // do something with the build
});
```

### `statArtifacts(config): Map<string, Stat>`

Reads the artifacts from disk and builds a map of filenames to size stats. This is done automatically by `createBuild`; it is only included in case you want to create builds with a custom script.

```js
import { getConfig, statArtifacts } from '@build-tracker/api-client';

const config = await getConfig();
const artifactMap = statArtifacts(config);
const mainSizes = artifactMap.get('main.js');
```

### `uploadBuild(config: Config, build: Build, apiToken?: string, logger: { log, error }): Promise<ApiReturn>`

Uploads a Build to your Build Tracker instance.

```js
import { createBuild, getConfig, uploadBuild } from '@build-tracker/api-client';

const config = await getConfig();
createBuild(config, {}).then(build => {
  return uploadBuild(config, build, process.env.BT_API_AUTH_TOKEN);
});
```
