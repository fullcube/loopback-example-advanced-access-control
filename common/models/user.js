'use strict'
const _ = require('lodash')
const createPromiseCallback = require('loopback-datasource-juggler/lib/utils').createPromiseCallback

module.exports = function modelFnUser(user) {

  // This does not work on bulk create: https://github.com/strongloop/loopback-datasource-juggler/issues/793
  user.validatesUniquenessOf('email', { scopedTo: [ 'realm' ], message: 'Email is not unique within this realm' })

  /**
   * Method that verifies if a user has a certain role
   * @param {String} userId The ID of the user
   * @param {String} roleId The ID of the Role
   * @param {Function} cb Callback function
   * @returns boolean
   */
  user.hasRole = function hasRole(userId, roleId, cb) {
    cb = cb || createPromiseCallback()

    const RoleMapping = user.app.models.RoleMapping

    RoleMapping.findOne({
      where: {
        roleId,
        principalId: userId,
        principalType: RoleMapping.USER,
      },
    })
      .then(roleMapping => cb(null, roleMapping ? roleMapping.id : false))
      .catch(cb)

    return cb.promise
  }

  /**
   * Add a role to the current user
   * @param {String} roleName The name of the Role
   * @param {Function} [cb] Callback function.
   * @returns {Boolean} True if successful
   */
  user.prototype.addRole = function addRole(roleName, cb) {
    cb = cb || createPromiseCallback()

    const userId = this.id
    const Role = user.app.models.Role
    const RoleMapping = user.app.models.RoleMapping

    Role.findOne({ where: { name: roleName } })
      .then(role => {
        if (!role) {
          return Promise.reject(new Error(`Unable to find role with name ${roleName}`))
        }
        return user.hasRole(userId, role.id)
          .then(roleMappingId => RoleMapping.upsert({
            id: roleMappingId || null,
            roleId: role.id,
            principalId: userId,
            principalType: RoleMapping.USER,
          }))
          .then(() => cb(null, true))
      })
      .catch(err => cb(new Error(`Error adding ${roleName} role to user ${this.id}. ${err.message}`)))
    return cb.promise
  }

  /**
   * Remove a role from the current user
   * @param {String} roleName The name of the Role
   * @param {Function} [cb] Callback function.
   * @returns {Boolean} True if successful
   */
  user.prototype.removeRole = function addRole(roleName, cb) {
    cb = cb || createPromiseCallback()

    const userId = this.id
    const Role = user.app.models.Role
    const RoleMapping = user.app.models.RoleMapping

    Role.findOne({ where: { name: roleName } })
      .then(role => {
        if (!role) {
          return Promise.reject(new Error(`Unable to find role with name ${roleName}`))
        }
        return user.hasRole(userId, role.id)
          .then(() => RoleMapping.deleteAll({
            roleId: role.id,
            principalId: userId,
            principalType: RoleMapping.USER,
          }))
          .then(() => cb(null, true))
      })
      .catch(err => cb(new Error(`Error removing ${roleName} role from user ${this.id}. ${err.message}`)))
    return cb.promise
  }

  /**
   * Method that retrieves all the roles in the system
   * @param {Function} cb Callback function
   * @returns boolean
   */
  user.getAllRoleNames = function getAllRoleNames(cb) {
    cb = cb || createPromiseCallback()

    user.app.models.Role
      .find()
      .then(roles => roles.map(role => role.name))
      .then(res => cb(null, res))
      .catch(cb)

    return cb.promise
  }

  /**
   * Get the roles for this user.
   * @param {Function} [cb] Callback function.
   * @returns {Object} A map of all roles of this user
   */
  user.prototype.info = function info(cb) {
    cb = cb || createPromiseCallback()

    const Group = user.app.models.Group
    const id = this.id
    const result = {
      user: this,
      roles: {},
      groups: {},
    }
    let allRoleNames = []
    let userRoleNames = []
    let hasAllRoles = false

    this.roles.getAsync()
      .then(userRoles => userRoles.map(userRole => userRole.name))
      .then(res => {
        userRoleNames = res
        // Unsure if we should always give admin all roles
        hasAllRoles = _.intersection(userRoleNames, [ 'admin' ]).length > 0
      })
      .then(() => user.getAllRoleNames())
      .then(res => {
        allRoleNames = res
      })
      .then(() => {
        result.roles = {
          assigned: allRoleNames.filter(name => userRoleNames.indexOf(name) !== -1),
          unassigned: allRoleNames.filter(name => userRoleNames.indexOf(name) === -1),
        }
      })
      /* eslint no-confusing-arrow: [0] */
      .then(() => (hasAllRoles ? Group.findAllRoles() : Group.findUserRoles(id)))
      .then(groupRoles => {
        result.groups = groupRoles
      })
      .then(() => cb(null, result))
    return cb.promise
  }
}
