---
id: types
title: '@build-tracker/types'
sidebar_label: '@build-tracker/types'
---

This package includes types and enums for working with other Build Tracker packages.

# Exports

## `BudgetType`

```js
import { BudgetType } from '@build-tracker/types';
```

### `BudgetType.SIZE`

A size budget is an absolute limite on the total size of an artifact. This is the most simple budget, because passing or failing can be seen with a single build and no math.

### `BudgetType.DELTA`

A budget delta is a limit on the amount of change allowed for one or more artifacts from one build to the next.

|         | First build | Second build | Δ (delta) |
| ------- | ----------- | ------------ | --------- |
| main.js | 40 KiB      | 48 KiB       | +8 KiB    |

### `BudgetType.PERCENT_DELTA`

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

## `BudgetType`

```js
import { BudgetType } from '@build-tracker/types';
```

### `BudgetLevel.ERROR`

### `BudgetLevel.WARN`
