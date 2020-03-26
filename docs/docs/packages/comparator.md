---
id: comparator
title: '@build-tracker/comparator'
sidebar_label: '@build-tracker/comparator'
---

The Build Tracker Comparator contains the core functionality for calculating how two or more Builds differ. This package is only needed individually if you would like to do some custom reporting on various Builds.

## Install

```sh
yarn add @build-tracker/comparator@latest
# or
npm install --save @build-tracker/comparator@latest
```

## class `BuildComparator`

The following is a list of useful public methods for the `BuildComparator` class. More may be available.

### `constructor (ComparatorOptions)`

Construct a new `BuildComparator` instance.

#### Example

```js
import Build from '@build-tracker/build';
import BuildComparator from '@build-tracker/comparator';

new BuildComparator({
  builds: [
    new Build(build1Meta, build1Artifacts),
    new Build(build2Meta, build2Artifacts),
    /* ... more than 2 builds can be added */
  ],
});
```

### `toJSON(): ComparisonMatrix`

Get a full JSON representation of a comparison matrix. This is typically used for constructing large user-interface tables, such as the one provided in the Build Tracker web app UI.

### `toMarkdown(FormattingOptions): string`

Get a Markdown table represetnation of the comparison matrix. Post these, along with a [summary](#tosummaryuseemoji-boolean--true-arraystring), as pull request comments.

### Default Example

```
|          |  1234567 |  8901234 |                   Δ1 |
| :------- | -------: | -------: | -------------------: |
| All      | 0.13 KiB | 0.16 KiB |     0.03 KiB (20.7%) |
| churros  |    0 KiB | 0.12 KiB | ⚠️ 0.12 KiB (100.0%) |
| burritos | 0.09 KiB |    0 KiB |  -0.09 KiB (-100.0%) |
| tacos    | 0.04 KiB | 0.04 KiB |     🚨 0 KiB (-4.4%) |
```

### `toCsv(FormattingOptions): string`

For old-school spreadsheet storage, export your comparison table as a CSV and import it into your favorite spreadsheet editor.

### Default Example

```csv
,1234567,8901234,Δ1
All,0.13 KiB,0.16 KiB,0.03 KiB (20.7%)
churros,0 KiB,0.12 KiB,0.12 KiB (100.0%)
burritos,0.09 KiB,0 KiB,-0.09 KiB (-100.0%)
tacos,0.04 KiB,0.04 KiB,0 KiB (-4.4%)
```

### `toSummary(useEmoji: boolean = true): Array<string>`

Returns an array Markdown-formatted summaries of the overall comparison and any budgets that you have defined.

#### No failures:

```js
['✅ No failing budgets'];
```

#### Warnings and Errors:

```js
[
  '⚠️: `Group \\"All\\"` failed the gzip budget size limit of 0 KiB by 0.16 KiB',
  '⚠️: `Group \\"warning\\"` failed the gzip budget size limit of 0 KiB by 0.12 KiB',
  '🚨: `Group \\"error\\"` failed the gzip budget size limit of 0 KiB by 0.16 KiB',
  '#️⃣: `burritos` hash changed without any file size change',
];
```

If `useEmoji` is set to `false`, emoji will be replaced with words:

| Emoji            | Word    |
| ---------------- | ------- |
| ✅ (U+2705)      | Success |
| ⚠️ (U+26A0)      | Warning |
| 🚨 (U+1F6A9)     | Error   |
| #️⃣ (U+0023-20E3) | Hash    |

## Types

NOTE: Cell types have been omitted. Please refer to the source code to get the full type definitions.

### `ComparisonMatrix`

```ts
interface ComparisonMatrix {
  header: HeaderRow;
  groups: Array<GroupRow>;
  artifacts: Array<ArtifactRow>;
}
```

### `ComparatorOptions`

```ts
interface ComparatorOptions {
  artifactBudgets?: ArtifactBudgets;
  artifactFilters?: Array<RegExp>;
  budgets?: Array<Budget>;
  builds: Array<Build>;
  groups?: Array<Group>;
}
```

### `FormattingOptions`

```ts
interface FormattingOptions {
  formatCellText?: CellTextStringFormatter;
  formatRevision?: RevisionStringFormatter;
  formatRevisionDelta?: RevisionDeltaStringFormatter;
  formatTotal?: TotalStringFormatter;
  formatDelta?: DeltaStringFormatter;
  artifactFilter?: ArtifactFilter;
  sizeKey?: string;
}
```

### Formatters

```ts
type CellTextStringFormatter = (cell: TextCell | GroupCell | ArtifactCell) => string;
type RevisionStringFormatter = (cell: RevisionCell) => string;
type RevisionDeltaStringFormatter = (cell: RevisionDeltaCell) => string;
type TotalStringFormatter = (cell: TotalCell, sizeKey: string) => string;
type DeltaStringFormatter = (cell: DeltaCell | TotalDeltaCell, sizeKey: string) => string;
type ArtifactFilter = (row: ArtifactRow) => boolean;
```
