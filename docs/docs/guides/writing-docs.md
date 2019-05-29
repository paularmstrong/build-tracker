---
id: writing-docs
title: Writing documentation
---

Thank you for your interest in helping out with Build Tracker! This is a project done with joy and care, out of our free time. Before getting started, please familiarize yourself with the [Contributor Covenant Code of Conduct](https://github.com/paularmstrong/build-tracker/blob/next/CODE_OF_CONDUCT.md).

---

Documentation is a great place to get started contributing to the Build Tracker project because writing good docs is difficult. For that reason, your help is _always_ appreciated.

## Get started

First, follow the general repository [getting started](./contributing) guide. Once you've done this, continue on from here.

## Running the docs locally

To run the documentation with hot reloading from your local machine, simple run:

```sh
$ yarn docs
LiveReload server started on port 35729
Docusaurus server started on port 3000
```

Your browser should automatically be opened to the documentation site running locally. If it is not, you can visit `http://localhost:3000` (or swap the port `3000` with whatever is on the last line of the output above)

## Updating documentation

To update any documentation pages, first update the files from the repository root at `docs/docs`. If your changes are also relevant to the 1.x.x version, you will also need to update `website/versioned_docs/1.0.0` files.

## Updating other pages

All pages and templates are written with React.js and can be found in `website/core` and `website/pages`.

## Submitting your PR

After your changes look the way you want on your local documentation server. You can close the server down (`CTRL+C`). Simply commit your changes and open a PR on the [Build Tracker repository](https://github.com/paularmstrong/build-tracker).

## Other help

Build Tracker uses [Docusaurus](https://docusaurus.io) for generating it's docs. If you're unfamiliar with any of the internals of how the docs are built, structured, or how to add a feature to them, the [official docs](https://docusaurus.io) are the best place to start.
