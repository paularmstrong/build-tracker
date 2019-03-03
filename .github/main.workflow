workflow "On pull request" {
  on = "pull_request"
  resolves = [
    "test",
    "lint",
    "tsc",
    "set status",
    "set labels",
  ]
}

action "yarn" {
  uses = "nuxt/actions-yarn@master"
  args = "install --frozen-lockfile"
}

action "lint" {
  uses = "nuxt/actions-yarn@master"
  needs = ["yarn"]
  args = "lint:ci"
}

action "test" {
  uses = "nuxt/actions-yarn@master"
  needs = ["yarn"]
  args = "test:ci"
}

action "tsc" {
  uses = "nuxt/actions-yarn@master"
  needs = ["yarn"]
  args = "tsc"
}

action "set status" {
  uses = "wip/action@master"
  secrets = ["GITHUB_TOKEN"]
}

action "set labels" {
  uses = "adamzolyak/monorepo-pr-labeler-action@1.1.1"
  env = {
    BASE_DIRS = "src"
  }
  secrets = ["GITHUB_TOKEN"]
}

workflow "On push" {
  on = "push"
  resolves = ["test", "lint", "tsc"]
}
