'use strict'
const datasources = {}

const MONGODB_URL = process.env.MONGODB_URL

if (MONGODB_URL) {
  console.log('Datasource: MONGODB_URL: %s', MONGODB_URL)

  datasources.db = {
    name: 'db',
    connector: 'loopback-connector-mongodb',
    url: MONGODB_URL,
  }
}

module.exports = datasources
