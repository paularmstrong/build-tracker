workflow "On Push" {
  on = "push"
  resolves = ["test", "audit", "lint", "tsc"]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@46ffca7632504e61db2d4cb16be1e80f333cb859"
  args = "branch next"
}

action "yarn" {
  uses = "Borales/actions-yarn"
  needs = ["Filters for GitHub Actions"]
  args = "install"
}

action "lint" {
  uses = "Borales/actions-yarn"
  needs = ["yarn"]
  args = "lint:ci"
}

action "test" {
  uses = "Borales/actions-yarn"
  needs = ["yarn"]
  args = "test:ci"
}

action "tsc" {
  uses = "Borales/actions-yarn"
  needs = ["yarn"]
  args = "tsc:ci"
}

action "audit" {
  uses = "JasonEtco/npm-audit-fix-action"
  needs = ["Filters for GitHub Actions"]
}
