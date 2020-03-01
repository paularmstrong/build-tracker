---
id: budgets
title: Setting performance budgets
sidebar_label: Setting budgets
---

## What is a performance budget?

Performance budgets are limits set on various metrics that affect site and application performance. With Build Tracker, we are most focused on how the size of your build assets affects your app’s loading speed.

A Build Tracker _Budget_ consists of 4 items: `level`, `sizeKey`, `type`, and `maximum`.

```
{
  level: BudgetLevel.ERROR,
  maximum: 150000,
  sizeKey: 'gzip',
  type: BudgetType.SIZE,
}
```

### `level`

A budget level can either be `BudgetLevel.ERROR` (`'error'`) or `BudgetLevel.WARN` (`'warn'`). The determination of which level you'd like to use is up to you. They're mostly cosmetic for reporting. You can import these from [`@build-tracker/types`](/docs/packages/types);

```js
const { BudgetLevel } = require('@build-tracker/types');
```

### `maximum`

This is a numerical value that has different meaning based on the [type](#type) of budget you've defined.

### `sizeKey`

Out of the box, Build Tracker comes with three possible size measurements. Depending on how you're serving you're app, you will want to choose one of these for each budget.

Available size keys are:

- `'stat'`
  - The full stat size of an artifact as it is on-disk
- `'gzip'`
  - If you're serving with the _gzip_ compression type. Most services include this.
- `'brotli'`\*
  - If you're serving with the newer _brotli_ compression type.
  - \*Requires Node 10.16.0 or greater

### `type`

Build Tracker supports three kinds of budgets, allowing you to have the most fine-grained control over your build reports. You can import these from [`@build-tracker/types`](/docs/packages/types);

```js
const { BudgetType } = require('@build-tracker/types');
```

#### `BudgetType.SIZE`

A size budget is an absolute limite on the total size of an artifact. This is the most simple budget, because passing or failing can be seen with a single build and no math.

For this budget type, `maximum` should be a whole number, in _bytes_.

#### `BudgetType.DELTA`

A budget delta is a limit on the amount of change allowed for one or more artifacts from one build to the next.

|         | First build | Second build | Δ (delta) |
| ------- | ----------- | ------------ | --------- |
| main.js | 40 KiB      | 48 KiB       | +8 KiB    |

For this budget type, `maximum` is a _maximum_ number of bytes allowed for the delta.

#### `BudgetType.PERCENT_DELTA`

The percent delta budget is a limit on the artifacts total size percent change from one build to the next. For this, we divide the delta by the size of the first build:

> Note: this is a simplified version of the formula that does not account for edge cases

```js
function percentDelta(firstSize, secondSize) {
  return (secondSize - firstSize) / firstSize;
}

percentDelta(40, 48);
```

|         | First build | Second build | Δ% (percent delta) |
| ------- | ----------- | ------------ | ------------------ |
| main.js | 40 KiB      | 48 KiB       | + 20%              |

For this budget type, `maximum` is a float value where `1.0` is a 100% delta increase.

## Setting performance budgets with Build Tracker

Using the [`@build-tracker/server configuration`](/docs/packages/servver#basic-configuration), there are a number of possible ways to set budgets: on individual artifacts, every artifact, groups of artifacts, and all artifacts.

### Budgets for individual and every artifact

In your server config file, you can add an `artifacts.budgets` object and define budgets by artifact name. Each artifact can be configured with an array of 1 or more budget.

To set a single budget for an artifact with the filename `main.js`:

```js
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = {
  artifacts: {
    budgets: {
      'main.js': [
        {
          level: BudgetLevel.ERROR,
          sizeKey: 'gzip',
          type: BudgetType.SIZE,
          maximum: 150000
        }
      ]
    }
  }
};
```

If you'd like to set a single budget that applies to each artifact without knowing every single artifact's filename, you can use the special asterisk key `'*'`. When using the asterisk, the budgets defined will be applied to every single artifact. This can be useful if you want to call out major changes so they are more noticeable.

In this example, we will receive _warning_ any time the _percent delta_ of any artifact exceeds 50%.

```js
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = {
  artifacts: {
    budgets: {
      '*': [
        {
          level: BudgetLevel.WARN,
          sizeKey: 'gzip',
          type: BudgetType.PERCENT_DELTA,
          maximum: 0.5
        }
      ]
    }
  }
};
```

### Budgets for groups

Groups are a set of Artifacts that you can define in your server's configuration to group together one or more artifacts by name or regular expression. These are useful for reporting when you know what artifacts are required for certain areas of your application or site, like a Home page.

To create a group, add a `artifacts.groups` array with one or more `group` configuration:

```js
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = {
  artifacts: {
    groups: [
      {
        // An array of strings that match your artifacts
        artifactNames: ['main', 'shared', 'vendor'],
        // Optional, a regular expression to match artifact names
        artifactMatch: /^i18n/,
        // An array of budgets
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 150000 }],
        // A name for the group
        name: 'Initial'
      }
    ]
  }
};
```

### Budgets for overall totals

It is also possible to define budgets for the overall sum of artifacts. To do this, you can add an array of one or more budgets to a `budgets` key on the server's configuration:

```js
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = {
  budgets: [
    {
      level: BudgetLevel.ERROR,
      sizeKey: 'brotli',
      type: BudgetType.SIZE,
      maximum: 1000000
    }
  ]
};
```
