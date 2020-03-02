---
id: api-errors
title: '@build-tracker/api-errors'
sidebar_label: '@build-tracker/api-errors'
---

This is a shared package for creating and comparing API errors returned from the Build Tracker server's API.

## 400 `ValidationError`

The build that you are trying to insert into the database does not meet requirements. See the specific error message for more information.

## 401 `AuthError`

If your server's API is protected with an API key and you do not provide it with requests requiring authentication, a 401 unauthorized response will be returned.

## 404 `NotFoundError`

When querying one or more builds, you may find that they do not exist. This will result in a 404 not found error.

## 501 `UnimplementedError`

If your API or API plugin does not support a method, a 501 unimplemented error will be returned.
