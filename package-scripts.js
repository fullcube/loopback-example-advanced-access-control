module.exports = {
  scripts: {
    dev: 'NODE_ENV=development nodemon server/server.js --watch server --watch common --ext js,json,yml',
    lint: 'eslint .',
    test: {
      default: 'mocha --full-trace test/**/*.test.js',
      watch: 'npm run test -- --watch',
    },
    posttest: 'npm run lint && nsp check',
  },
}
