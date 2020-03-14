---
id: github-actions
title: GitHub Actions
---

If you use GitHub and GitHub Actions, there's a ready-made Build Tracker action that you can include to add reports to every pull request. The action will include a summary of any failing budgets, a table comparison, and a link to your Build Tracker instance for a more in-depth view.

![GitHub Action comment on a pull request showing a failing Build Tracker budget](/img/github-action.png)

## Installation

Put the following content in the file `.github/workflows/main.yml`

```yaml
on: pull_request

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: actions/setup-node@master
        with:
          node-version: 10.x
      - run: yarn install --frozen-lockfile
      # You must build your project before running the Build Tracker action!
      - name: Build
        run: yarn build
      - uses: paularmstrong/build-tracker-action@master
        with:
          BT_CLI_CONFIG: ./config/build-tracker-cli.config.js
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BT_API_AUTH_TOKEN: ${{ secrets.BT_API_AUTH_TOKEN }}
          BT_FILTER_TABLE_ROWS: true
          BT_FAIL_ON_ERROR: true
```

## Configuration

### `GITHUB_TOKEN` (required)

You can get this from your repo secrets settings. It will allow the action to post comments on pull requests.

### `BT_CLI_CONFIG`

If your config file is not in the root of your repository, include the relative path here.

### `BT_API_AUTH_TOKEN`

Required if you've secured your API with an auth token.

### `BT_COLLAPSE_TABLE` (default: `true`)

Collapse the table output. Setting this to `false` will make the comparison table always visible.

### `BT_FILTER_TABLE_ROWS` (default: `false`)

Filter out table rows that do not have errors or warnings. Set this to `true` to prevent the table from becoming too large with un-actionable information.

### `BT_FAIL_ON_ERROR` (default: `true`)

Fails your GitHub action if any budgets do not pass. This may prevent merging the pull request.
