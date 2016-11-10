'use strict'

module.exports = function modelFnDomain(Domain) {

  // Set the domain ID to be the same as the name
  Domain.observe('before save', (ctx, next) => {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.id = ctx.instance.name
    }
    next()
  })

}
