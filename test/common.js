'use strict'

global.app = require('../server/server')
global.expect = require('chai').expect

const RoleMapping = app.models.RoleMapping
const User = app.models.user

// Method to get access to the data in the fixtures
function getFixtures(type) {
  const fixturesPath = `${process.cwd()}/server/fixtures/${type}.json`

  return require(fixturesPath)
}

// Log a user in to the API
function apiLogin(user) {
  const credentials = {
    realm: user.realm,
    email: user.email,
    password: user.password,
  }

  return User.login(credentials)
}

// Log a user in and perform checks if it's the correct user
function checkUserLogin(user) {
  it(`should log in at realm ${user.realm} as ${user.email}`, done => {

    apiLogin(user)
      .then(token => expect(token.userId).to.equal(user.id))
      .then(() => done())
      .catch(err => console.error('Error', err))
  })
}

// Log in a user and check the expected roles
function checkUserRole(user, roleName) {
  it(`should log in at realm ${user.realm} as ${user.email} with role ${roleName}`, done => {

    apiLogin(user)
      .then(token => expect(token.userId).to.equal(user.id))
      .then(() => RoleMapping.find({
        where: {
          principalId: user.id,
        },
        include: 'role',
      }))
      .then(res => {
        const role = res[0].role()

        expect(role.name).to.equal(roleName)
      })
      .then(() => done())
      .catch(err => console.error('Error', err))
  })
}

module.exports = {
  checkUserLogin,
  checkUserRole,
  getFixtures,
}
