const common = require('../common')

const roleMappings = common.getFixtures('RoleMapping')
const roles = common.getFixtures('Role')
const users = common.getFixtures('User')

describe('log in the users to the realms', () => {
  users.forEach(user => common.checkUserLogin(user))
})

describe('check the the user roles', () => {

  const roleMap = {}
  const userMap = {}

  roles.forEach(role => (roleMap[role.id] = role.name))
  users.forEach(user => (userMap[user.id] = user))

  roleMappings.forEach(roleMapping => {
    const role = roleMap[roleMapping.roleId]
    const user = userMap[roleMapping.principalId]

    common.checkUserRole(user, role)
  })
})
