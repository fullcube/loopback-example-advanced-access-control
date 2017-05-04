# loopback-example-advanced-access-control

[![Greenkeeper badge](https://badges.greenkeeper.io/fullcube/loopback-example-advanced-access-control.svg)](https://greenkeeper.io/)

> LoopBack - Example implementation of advanced access control

# About

This project is an example of how to implement advanced access control in a LoopBack server.

It is a combination of:

- Users partitioned by [Realms](http://loopback.io/doc/en/lb2/Partitioning-users-with-realms.html)
- Fine-grained access per group using [loopback-component-access-groups](https://github.com/fullcube/loopback-component-access-groups)

**⚠️ Note: this project does not apply any ACL rules based on these groups.**

# Installation

    $ git clone https://github.com/fullcube/loopback-example-advanced-access-control.git
    $ cd loopback-example-advanced-access-control
    $ npm install

# Running the project

The project consist of a set of tests that prove that the access is as expected. You can run these by executing:

    $ nps test

If you want to start the server in development mode:

    $ npm start dev

# TODO

- Add tests for manipulating roles/groups
- Add tests for logging in using access tokens
- Create ACLs based on groups + tests
