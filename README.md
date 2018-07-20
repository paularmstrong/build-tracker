# Build Tracker [![build status](https://img.shields.io/travis/paularmstrong/build-tracker/master.svg?style=flat-square)](https://travis-ci.org/paularmstrong/build-tracker)

Build Tracker is a set of tools to track the size of your build artifacts over time.

![app screenshot](docs/app-screenshot.png?raw=true)

Package-specific information and documentation can be found here:

* [@build-tracker/app](packages/app)
* [@build-tracker/builds](packages/builds)
* [@build-tracker/cli](packages/cli)
* [@build-tracker/comparator](packages/comparator)
* [@build-tracker/server](packages/server)
* [@build-tracker/types](packages/types)
* [@build-tracker/webpack-plugin](packages/webpack-plugin)

## Development

### Getting set up

1.  `yarn` to install all dependencies. This will also install pre-commit hooks to help you ensure lint, test, and type checking pass before committing.
2.  `yarn lerna bootstrap` to ensure sub-projects are linked together. This is a [lerna](https://lernajs.io) monorepo. All projects are located under the `<root>/packages/` directory.

### Starting a static server

```bash
# in packages/server
yarn start:static
# in packages/app
yarn start
```

### Other commands

```bash
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
