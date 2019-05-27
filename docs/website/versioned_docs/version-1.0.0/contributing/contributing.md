---
id: version-1.0.0-contributing
title: Contributing
sidebar_label: Getting started
original_id: contributing
---

Thank you for your interest in helping out with Build Tracker! This is a project done with joy and care, out of our free time. Before getting started, please familiarize yourself with the [Contributor Covenant Code of Conduct](https://github.com/paularmstrong/build-tracker/blob/next/CODE_OF_CONDUCT.md).

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
