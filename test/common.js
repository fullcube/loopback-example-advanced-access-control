'use strict'

global.app = require('../server/server')
global.expect = require('chai').expect

const User = app.models.user

// Log a user in to the API
function apiLogin(user) {
  const credentials = {
    realm: user.realm,
    email: user.email,
    password: user.password,
  }

  return User.login(credentials)
}

// Method to return the the user based on userId
function findUser(userId) {
  return User.findById(userId)
}

// Method to get access to the data in the fixtures
function getFixtures(type) {
  const fixturesPath = `${process.cwd()}/server/fixtures/${type}.json`

  return require(fixturesPath)
}

module.exports = {
  apiLogin,
  findUser,
  getFixtures,
}
