workflow "On PR" {
  on = "pull_request"
  resolves = ["test", "lint", "tsc", "set status"]
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
  args = "tsc:ci"
}

action "set status" {
  uses = "wip/action@master"
  secrets = ["GITHUB_TOKEN"]
}
