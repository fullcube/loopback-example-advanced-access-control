const common = require('../common')

describe('models', () => {

  const expectedModels = [
    'AccessToken',
    'Domain',
    'Fixtures',
    'fixtures',
    'User',
    'user',
    'ACL',
    'RoleMapping',
    'Role',
    'Group',
  ]

  it(`should have the expected number of models: ${expectedModels.length}`, done => {
    expect(Object.keys(common.app.models).length).to.equal(expectedModels.length)
    done()
  })

  expectedModels.forEach(expectedModel => {
    const Model = common.app.models[expectedModel]

    it(`should have the model: ${expectedModel} `, done => {
      expect(Model).to.be.a('function')
      done()
    })
  })

})
