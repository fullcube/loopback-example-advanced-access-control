'use strict'

global.app = require('../server/server')
global.expect = require('chai').expect

const RoleMapping = app.models.RoleMapping

function apiModelLogin(modelName, user) {
  const Model = app.models[modelName]
  const credentials = {
    id: user.id,
    email: user.email,
    password: user.password,
  }

  return Model.login(credentials)
}

function checkUserRole(modelName, user, roleName) {
  it(`should log in user ${user.username} on model ${modelName} has role ${roleName}`, done => {

    apiModelLogin(modelName, user)
      .then(token => {
        expect(token.userId).to.equal(user.id)
      })
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

function checkUserLogin(modelName, user) {
  it(`should log in user ${user.username} on model ${modelName}`, done => {

    apiModelLogin(modelName, user)
      .then(token => {
        expect(token.userId).to.equal(user.id)
      })
      .then(() => done())
      .catch(err => console.error('Error', err))
  })
}

function getFixtures(type) {
  const fixturesPath = `${process.cwd()}/server/fixtures/${type}.json`

  return require(fixturesPath)
}

module.exports = {
  checkUserLogin,
  checkUserRole,
  getFixtures,
}
