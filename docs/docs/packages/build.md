---
id: build
title: '@build-tracker/build'
sidebar_label: '@build-tracker/build'
---

## Install

```sh
yarn add @build-tracker/build@latest
# or
npm install --save @build-tracker/build@latest
```

## `Build`

Construct a new build by passing it both the build's [`BuildMeta`](#buildmeta) and array of [`Artifact`s](#artifact):

```js
new Build({
  revision: '1234567',
  parentRevision: 'abcdefg',
  timestamp: 1577038148378,
  branch: 'master'
});
```

## Useful Methods

The following is a short selection of useful methods provided by the `Build` class.

### `Build.toJson()`

Returns a JSON representation of the Build.

### `get Build.meta(): BuildMeta`

Get a JSON representation of the full metadata of a Build.

### `get Build.timestamp(): Date`

Get a `Date` representation of the timestamp from the `BuildMeta`

### `getMetaValue(key: string): string`

Get the string value of a build meta entry.

### `getMetaUrl(key: string): string | undefined`

Get the URL value of a build meta entry. If one was not provided, this will return `undefined`.

### `getSum(artifactNames: Array<string>): ArtifactSizes`

Returns an object listing the total sum of the sizes for every key available in `ArtifactSizes` per the requested array of artifact names.

#### Example

Get the sum of a specific list of artifacts:

```js
myBuild.getSum(['main', 'vendor', 'shared']);
```

### `getTotals(artifactFilters?: Array<RegExp>): ArtifactSizes`

Returns an object listing the total sum of the sizes for every key available in `ArtifactSizes` for all artifacts in a Build.

If the first argument is provided, any artifact name that matches one of the regular expressions in the array will not be included in the sum total.

#### Filter Example

To filter out any artifact that matches `i18n/.*` except for the `i18n/en` artifact:

```js
myBuild.getTotals([/^i18n\/(?!en$).*$/]);
```

## Types

### `BuildMeta`

Build meta includes useful information for identifying the build in your system. This information is visible in the web application's interface.

```ts
interface BuildMeta {
  // Unique revision identifier. Usually a git SHA
  revision: BuildMetaItem;
  // Unique parent revision identifier. Usually a git SHA from `git merge-base $revision`.
  // This is used for default comparisons
  parentRevision: BuildMetaItem;
  // DateTime value representing when this build was created
  timestamp: number;
  // Branch name for this revision. Helps for in-progress work to be filtered from the default UI
  branch: BuildMetaItem;
  // Any extra information can be provided if you like
  [key: string]: BuildMetaItem;
}
```

#### `BuildMetaItem: string | { value: string; url: string }`

Any build meta item (other than `timestamp`) can either be a string `value` or an object containing a string `value` and a string `url`.

If a `url` is included, the web application will link the `value` to the `url`.

### `Artifact`

Every build artifact consists of a `name`, unique `hash` of the file for each build, and an object of keyed `sizes`.

```ts
export interface Artifact<AS extends ArtifactSizes> {
  // Unique hash of the contents of this artifact.
  hash: string;
  // Name of this build artifact
  name: string;
  // Computed sizes of the build artifact
  sizes: AS;
}
```

#### `ArtifactSizes`

Artifacts can have any number of keyed sizes. The defaults provided by the [cli](packages/cli.md) are `stat`, `gzip`, and `brotli`.

```ts
export interface ArtifactSizes {
  // Create your own size calculations, in bytes
  // `stat` and `gzip` sizes are most commonly used for web applications
  [key: string]: number;
}
```
