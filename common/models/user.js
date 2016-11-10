'use strict'

module.exports = function modelFnUser(User) {

  // This does not work on bulk create: https://github.com/strongloop/loopback-datasource-juggler/issues/793
  User.validatesUniquenessOf('email', { scopedTo: [ 'realm' ], message: 'Email is not unique within this realm' })

}
