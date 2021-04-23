# Dev rules

## Versioning

This project use [semantic versioning rules](https://semver.org/)

The release tag is automatic generated
by [semantic-release](https://github.com/semantic-release/semantic-release#commit-message-format)

In order to create a good tag you need to use Angular commit message conventions, so when you do things that need to be
mark on the future release (function rename, bug fix, new feature, ...) you need to use this commit message format

For more information you can go [here](https://github.com/semantic-release/semantic-release#commit-message-format)

Let's say that the tag format is like this: **x.y.z**

**Note: Don't forget to replace: \<title\>**

### Patch Release: x . y . z + 1

`1.0.0` -> `1.0.1`

Commit message:

    git commit -m "fix(<title>): stop graphite breaking when too much pressure applied"

Release description result:

    Bug Fixes
        * pencil: stop graphite breaking when too much pressure applied

### Feature Release: x . y + 1 . z

`1.0.0` -> `1.1.0`

Commit message:

    git commit -m "feat(<title>): add 'graphiteWidth' option"

Release description result:

    Features
        * pencil: add 'graphiteWidth' option

### Breaking Release: x + 1 . y . z

`1.0.0` -> `2.0.0`

Commit message:

    git commit -m "perf(<title>): remove graphiteWidth option.
      BREAKING CHANGE: The graphiteWidth option has been removed."

Release description result:

    BREAKING CHANGES
        * pencil: The graphiteWidth option has been removed.
