workflow "On Push" {
  on = "push"
  resolves = ["test", "audit", "lint", "tsc"]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@46ffca7632504e61db2d4cb16be1e80f333cb859"
  args = "branch next"
}

action "yarn" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Filters for GitHub Actions"]
  args = "install"
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

action "audit" {
  uses = "JasonEtco/npm-audit-fix-action@master"
  needs = ["Filters for GitHub Actions"]
}
