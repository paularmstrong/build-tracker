---
id: cli
title: '@build-tracker/cli'
sidebar_label: '@build-tracker/cli'
---

Adding the `@build-tracker/cli` package includes a command-line utility, `bt-cli` for interacting with the Build Tracker API. It can be run with `yarn bt-cli` or `npx bt-cli`

> **Important note:** Set up the Build Tracker CLI close to your application's code (in the same repository and workspace). Remember that the configuration for the CLI is **not** the same as the configuration for the [server](./server.md).

## Install

```sh
yarn add @build-tracker/cli@latest
# or
npm install --save @build-tracker/cli@latest
```

To list all commands and help, run `yarn bt-cli --help`

## Configuration

The Build Tracker CLI uses the same configuration as the `@build-tracker/api-client`. For more information, see [api-client configuration](api-client#configuration).

## CLI

### `upload-build`

This command will read your configuration file, and upload the current build meta and artifact stats to your server. In most scenarios, this should be all you need.

Beside the arguments below, if you're running your server with a [`BT_API_AUTH_TOKEN` environment variable](server#securing-your-api), ensure you run this command with that variable available as well.

```
BT_API_AUTH_TOKEN=my-secret-token bt-cli upload-build
```

| option, alias        | description                                                | default                                           |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `--branch`, `-b`     | Set the branch name and do not attempt to read from git    | Current git working branch                        |
| `--config`, `-c`     | Set path to the build-tracker API config file              | [Found via cosmiconfig](api-client#configuration) |
| `--meta`             | JSON-encoded extra meta information to attach to the build |                                                   |
| `--parent-revision`  | Manually set the parent revision for the comparison.       | Determined via git-merge-base                     |
| `--skip-dirty-check` | Skip the git work tree state check                         | `false`                                           |

### `create-build`

This command will create a Build object for the current available build. If run independently, it will only output information, but not upload it anywhere. For that, you only need to run `yarn bt-cli upload-build`.

| option, alias        | description                                                | default                                           |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `--branch`, `-b`     | Set the branch name and do not attempt to read from git    | Current git working branch                        |
| `--config`, `-c`     | Set path to the build-tracker API config file              | [Found via cosmiconfig](api-client#configuration) |
| `--meta`             | JSON-encoded extra meta information to attach to the build |                                                   |
| `--out`, `-o`        | Write the build to stdout                                  | `true`                                            |
| `--parent-revision`  | Manually set the parent revision for the comparison.       | Determined via git-merge-base                     |
| `--skip-dirty-check` | Skip the git work tree state check                         | `false`                                           |

### `stat-artifacts`

Lower-level than `create-build`, this command will get artifact stats for the current build files and output a JSON representation of them.

| option, alias    | description                                   | default                                           |
| ---------------- | --------------------------------------------- | ------------------------------------------------- |
| `--config`, `-c` | Set path to the build-tracker API config file | [Found via cosmiconfig](api-client#configuration) |
| `--out`, `-o`    | Write the stats to stdout                     | `true`                                            |

### `version`

Output the version number of the `bt-cli`.
