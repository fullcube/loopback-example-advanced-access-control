const _ = require('lodash')

const common = require('../common')

const groups = common.getFixtures('Group')
const roleMappings = common.getFixtures('RoleMapping')
const roles = common.getFixtures('Role')
const users = common.getFixtures('User')

const roleMap = {}
const userMap = {}
const userGroupMap = {}

// Get a map of all the domains keyed by id
groups.forEach(group => {
  userGroupMap[group.userId] = userGroupMap[group.userId] || {}
  userGroupMap[group.userId][group.domainId] = userGroupMap[group.userId][group.domainId] || []
  userGroupMap[group.userId][group.domainId].push(group.role)
})

// Get a map of all the roles names keyed by id
roles.forEach(role => (roleMap[role.id] = role.name))

// Loop over the user objects to get the roles and group roles defined in the sample data
users.forEach(user => {

  // Get the Group Roles
  user.groups = userGroupMap[user.id] || []

  // Get the Roles
  user.roles = roleMappings
    .filter(roleMapping => roleMapping.principalId === user.id)
    .map(roleMapping => roleMapping.roleId)
    .map(roleId => roleMap[roleId])

  // Add the user to the userMap
  userMap[user.id] = user
})

describe('Check the map of users in realms with their roles and groups', () => {
  _.forEach(userMap, user => {

    describe(`${user.email} @ ${user.realm}`, function() {

      let userToken = null
      let loggedInUser = null
      let loggedInUserInfo = null

      it(`${user.email} should be able to log in and retrieve it's user data`, done => {
        common.apiLogin(user)
          .then(token => {
            expect(token.userId).to.equal(user.id)
            userToken = token
          })
          .then(() => common.findUser(userToken.userId))
          .then(res => (loggedInUser = res))
          .then(() => loggedInUser.info())
          .then(res => (loggedInUserInfo = res))
          .then(() => done())
      })

      it(`${user.email} should have roles: ${user.roles} `, done => {
        const assignedRoles = loggedInUserInfo.roles.assigned

        expect(assignedRoles).to.have.members(user.roles)
        expect(assignedRoles).to.have.length(user.roles.length)
        done()
      })

      describe(`${user.email} should have groups`, function() {
        _.forEach(user.groups, (userGroups, domainId) => {

          it(`${user.email} should have groups: ${userGroups} on ${domainId}`, done => {
            const assignedGroups = loggedInUserInfo.groups[domainId].assigned

            expect(assignedGroups).to.have.members(userGroups)
            expect(assignedGroups).to.have.length(userGroups.length)
            done()
          })
        })
      })

    })

  })
})
