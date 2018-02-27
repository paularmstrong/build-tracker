# Build Tracker [![build status](https://img.shields.io/travis/paularmstrong/build-tracker/master.svg?style=flat-square)](https://travis-ci.org/paularmstrong/build-tracker)

Work in progress.

## Development

### Getting set up

1.  `yarn` to install all dependencies. This will also install pre-commit hooks to help you ensure lint, test, and type checking pass before committing.
2.  `yarn lerna bootstrap` to ensure sub-projects are linked together. This is a [lerna](https://lernajs.io) monorepo. All projects are located under the `<root>/packages/` directory.

### Other commands

```
# Run lint and auto-format using prettier
yarn lint

# Run static type checking
yarn flow

# Build all packages
yarn build

# Run all tests
yarn test

# Publish new versions
yarn release
```
