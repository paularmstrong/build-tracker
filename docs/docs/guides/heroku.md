---
id: heroku
title: Deploy to Heroku
sidebar_label: Deploy to Heroku
---

## Prerequisites

This documentation assumes that you have an active Heroku account.

## 1. Create a new repository from the template

On GitHub, [create a new repository using the template](https://github.com/paularmstrong/build-tracker-heroku/generate) from [paularmstrong/build-tracker-heroku](https://github.com/paularmstrong/build-tracker-heroku).

## 2. Update the `build-tracker.config.js` file

This is the `@build-tracker/server` configuration. The most important thing to do here is to set up your [performance budgets](/docs/budgets). There are also [more options](/docs/packages/server#configuration) available that you may want to set as well. It is not recommended to change any of the presets other than the `artifacts` option.

## 3. Deploy to Heroku

If you are set up as a public GitHub repository, simply click the _Deploy to Heroku_ button at the top of the README.md file while viewing it on GitHub.

If you are using a private repository, update the `README.md` link to use the `?template=` argument, replacing the repository `my-org/my-repository` in this string with the correct organization and repository path:

```
https://heroku.com/deploy?template=https://github.com/my-org/my-repository/tree/master
```

Once that URL is updated, you may click it any time.

## 4. Configure on Heroku

Follow the instructions provided on Heroku to deploy your Build Tracker application. Take special note that the `BT_URL` option must be provided with the same application name if you plan on using a herokuapp.com domain. If you are going to configure any other domain, enter that instead.
