# POC: LoopBack User Realms

> Proof of Concept: LoopBack API configured to partition users with realms

# TODO

- Add tests for manipulating roles/groups
- Add tests for logging in using access tokens
- Create ACLs based on groups + tests
- Add constraints on models (validatesUniquenessOf Group: domainId/userId/role, etc)
- Determine what functionality could live in loopback-component-access-groups
