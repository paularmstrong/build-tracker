workflow "On pull request" {
  on = "pull_request"
  resolves = [
    "Set status",
    "Add labels",
    "Lint PR",
    "Verify tests PR",
    "Verify types PR",
  ]
}

action "Set status" {
  uses = "wip/action@master"
  secrets = ["GITHUB_TOKEN"]
}

action "Add labels" {
  uses = "adamzolyak/monorepo-pr-labeler-action@1.1.1"
  env = {
    BASE_DIRS = "src|plugins"
  }
  secrets = ["GITHUB_TOKEN"]
}

workflow "On push" {
  on = "push"
  resolves = ["Lint", "Verify tests", "Verify types", "Upload build"]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  args = "branch next"
}

action "Install dependencies" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Filters for GitHub Actions"]
  args = "install --frozen-lockfile"
}

action "Lint" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "lint:ci"
}

action "Verify tests" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "test:ci"
}

action "Verify types" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "tsc"
}

action "Build" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "build"
}

action "Upload build" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Build"]
  args = "ts-node src/cli/src/bin.ts upload-build -c demo/build-tracker-cli.config.js"
}

action "Install PR dependencies" {
  uses = "nuxt/actions-yarn@master"
  args = "install --frozen-lockfile"
}

action "Lint PR" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install PR dependencies"]
  args = "lint:ci"
}

action "Verify tests PR" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install PR dependencies"]
  args = "test:ci"
}

action "Verify types PR" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install PR dependencies"]
  args = "tsc"
}
