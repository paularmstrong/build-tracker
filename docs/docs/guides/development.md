---
id: development
title: Development
sidebar_label: Development
---

Thank you for your interest in helping out with Build Tracker! This is a project done with joy and care, out of our free time. Before getting started, please familiarize yourself with the [Contributor Covenant Code of Conduct](https://github.com/paularmstrong/build-tracker/blob/next/CODE_OF_CONDUCT.md).

---

## Getting started

Fork and pull the repository from Github. If you're unsure how to fork a repository, read the [getting started docs here](https://help.github.com/en/articles/fork-a-repo).

```sh
git clone git@github.com:<myuser>/build-tracker.git
```

Once you've pulled the repository, you'll be working on the _next_ branch. This may be slightly different from what you're used to, so make sure to pay attention to always keep the _next_ branch up to date, and don't worry about _master_.

### Install dependencies

Build Tracker is a monorepo managed by [Yarn](https://yarnpkg.com). Start by installing dependencies for all packages:

```sh
cd build-tracker
yarn
```

### Make your changes

Always work on features in a separate branch from the main _next_ or _master_ branch.

```sh
git checkout -b my-feature
```

Now that you're on a branch, make changes directly to the code related to your feature or bug fix.

Ensure to always add tests, preferrably before you start making changes. This helps both you and any future reviewer verify that the code's intentions work correctly.

Run tests using the main script from the root of the repository:

```sh
yarn test
```

Once you've completed your changes and all of your tests pass, commit and push your branch to your fork:

```sh
git commit -am "[bugfix] a short description of what I did"
git push
```

### Open a pull request

Finally, open a pull request on the main [Build Tracker repository](https://github.com/paularmstrong/build-tracker).

## Monorepo

The Build Tracker git repository is a monorepo that is composed of many publishable packages. This has been done so that it's easier to iterate on cross-functional dependencies without requiring premature publishing steps.

The tool for managing these packages is [Lerna](https://github.com/lerna/lerna) with [Yarn workspaces](https://yarnpkg.com/en/docs/workspaces).

### Package workspace structure

```plaintext
├── docs
│   └── website
├── plugins
│   ├── with-mariadb
│   └── with-postgres
└── src
    ├── api-errors
    ├── app
    ├── build
    ├── cli
    ├── comparator
    ├── fixtures
    ├── formatting
    ├── server
    └── types
```

#### Source `./src`

All core Build Tracker packages reside here.

All folder names should be mapped as the publishable name without the `@build-tracker` scope. For example: `@build-tracker/app` is in the path `src/app`, while `@build-tracker/server` is at `src/server`.

#### Plugins `./plugins`

All implementation-specific code for various integrations should be kept here, instead of in the `src` directory.

All folder names should be mapped as the publishable name without the `@build-tracker/plugin-` scope. For example: `@build-tracker/plugin-with-mariadb` is in the path `plugins/with-mariadb`.

#### Docs `./docs`

This directory holds packages related to the documentation website

## Development

Here are some things to keep in mind while working in a monorepo:

### Adding a dependency to a package

To add a third-party dependency to a sub-package in the Build Tracker repository, ensure that it's done from the specific sub-package using the `yarn workspace` command:

```sh
# To add to the @build-tracker/app package
$ yarn workspace @build-tracker/app add <some-third-party-module>
```

### Don't abstract too early

Repeating code is not inherently bad. If some logic clearly fits in one of the already published packages, that's probably the right place for it. If there isn't a package available for something that is reusable, use your best judgement about complexity and scope of functions to determine if a new package is warranted.

## Typescript

Build Tracker is written in Typescript throughout all workspaces. Please do not add code that is not written in Typescript or change to another language.

## Dev environment

To run the development environment, some shortcuts are provided in the `package.json` scripts:

- `yarn dev` Run the server and application in a hot-reloadable environment using pre-seeded builds on the filesystem
- `yarn dev:maria` (coming soon) Run the server using a local MariaDB instance
- `yarn dev:postgres` (coming soon) Run the server using a local Postgres instance

## Code integrity

The following conformance checks can be run manually and will be automatically run on `pre-commit` as well as during the pull-request verification flow via Github Actions.

- `yarn lint` Lint and auto-format code
- `yarn test` Jest tests
- `yarn tsc` Typescript type check
