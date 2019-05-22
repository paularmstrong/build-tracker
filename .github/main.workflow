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
    BASE_DIRS = "src|plugins|docs"
  }
  secrets = ["GITHUB_TOKEN"]
}

workflow "On push" {
  resolves = [
    "Upload build",
    "Deploy documentation",
  ]
  on = "push"
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

action "Verify code" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "ci"
}

action "Build" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Verify code"]
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

action "Deploy documentation" {
  uses = "paularmstrong/docusaurus-github-action@master"
  needs = ["Install dependencies"]
  env = {
    BUILD_DIR = "docs/website"
    PROJECT_NAME = "build-tracker"
  }
  secrets = ["DEPLOY_SSH_KEY"]
}
