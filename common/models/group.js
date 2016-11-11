'use strict'
const _ = require('lodash')
const createPromiseCallback = require('loopback-datasource-juggler/lib/utils').createPromiseCallback

module.exports = function modelFnGroup(Group) {

  Group.ROLE_NAMES = [
    'user',
    'manager',
    'admin',
    'developer',
  ]

  /**
   * Method that finds all the Domain Roles for all domains
   * @param {Function} cb Callback function
   * @returns boolean
   */
  Group.findAllRoles = function findAllRoles(cb) {
    cb = cb || createPromiseCallback()

    Group.app.models.Domain
      .find()
      .then(domains => {
        const res = {}

        // Get the assigned roles for this user in each domain
        domains.forEach(domain => {
          res[domain.id] = {
            domain,
            assigned: Group.ROLE_NAMES,
            unassigned: [],
          }
        })

        return res
      })
      .then(res => cb(null, res))
      .catch(cb)

    return cb.promise
  }

  /**
   * Method that find the Team Roles for a user
   * @param {String} userId The ID of the user
   * @param {Function} cb Callback function
   * @returns boolean
   */
  Group.findUserRoles = function findUserRoles(userId, cb) {
    cb = cb || createPromiseCallback()

    Group
      .find({ where: { userId }, include: [ 'domain' ] })
      .then(userGroups => {
        const res = {}

        // Get the assigned roles for this user in each domain
        userGroups.forEach(userGroup => {
          if (!res[userGroup.domainId]) {
            res[userGroup.domainId] = {
              domain: userGroup.domain(),
              assigned: [],
              unassigned: [],
            }
          }
          res[userGroup.domainId].assigned.push(userGroup.role)
        })

        // Get the unassigned roles for this user
        _.mapKeys(res, (roleMap, domainId) => {
          res[domainId].unassigned = Group.ROLE_NAMES.filter(name => res[domainId].assigned.indexOf(name) === -1)
        })

        return res
      })
      .then(res => cb(null, res))
      .catch(cb)

    return cb.promise
  }

}
