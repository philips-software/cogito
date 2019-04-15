> Working on your first Pull Request? You can learn how from this *free* series
> [How to Contribute to an Open Source Project on
> GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Code organization

We keep Cogito in a monorepo. Cogito consists of many packages that all live in
this repository. We use a combination of [lerna](https://lernajs.io) and [yarn
workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage them.

After you clone your forked repo, follow the following steps to bootstrap your
local environment:

```bash
» yarn setup:dev
» yarn test
» (cd workspaces/demo-app && yarn start:all)
» (cd workspaces/cogito-ios-app-distribution && yarn start)
» (cd workspaces/homepage && yarn develop)
```

Now step-by-step.

### yarn setup:dev

This installs dependencies, compiles contracts, and build all package workspaces (it does not build `homepage`).

Our monorepo contains a number of packages. They have to be build before client
apps like `demo-app` and `cogito-ios-app-distribution` (both React) and
`homepage` (Gatsby-based, so also React) can use them.

### Run tests

Finally, the tests to confirm that everything is well in place. We run all the
tests from top level - this is far more efficient especially if the number of
workspaces in the monorepo increases:

```bash
» yarn test
» yarn test --no-cache    // good to know this
» yarn jest --clearCache  // a nice one
```

> Also the tests for React apps are run from the monorepo level.

### Starting the demo-app

`demo-app` is a React-based web app that we use to demonstrate the use of
various cogito components. It requires an Ethereum network with deployed
contracts, a running `faucet` to seed the Ethereum accounts with some initial
Ether needed to execute contracts, a deployed telepath queuing service (we have
deployed one to be used with cogito apps, but you can also deploy your own), and
finally, you will need to have the iOS Cogito app on your iPhone running. All
the components of this infrastructure are open-sourced, but you can use the one
that we deploy just to make starting up with Cogito easier.

To start a local Ethereum network with a local faucet you can use a convenience
script:

```bash
» cd workspaces/demo-app
» yarn start:all
```

### Starting the cogito-ios-app-distribution

This is the app we use to make downloading and installing our Cogito iOS App
easier for our partners. We use it for internal use only, but your can use the
source code to use it for your own version of the iOS Cogito App if you like.

```bash
» cd workspaces/cogito-ios-app-distribution
» yarn start
```

### Gatsby-based homepage

This is our landing page. It uses [Confluenza](https://confluenza.now.sh), which is based on [Gatsby](https://www.gatsbyjs.org/).

```bash
» cd workspaces/homepage
» yarn develop
» yarn build
```

We use Babel 7.

Babel 7 has changed in how babel configuration is discovered.

It allows three different configuration files: `babel.config.js`,
`.babelrc.js`, and the familiar `.babelrc`. The semantics of file
discovery have changed. If `babel.config.js` is present at your
current working directory, only this file will be used and `.babelrc`
and `.babelrc.js` will be ignored (and it does not matter if they are
in your `cwd` or in one of the subfolders).

If `babel.config.js` is not present, you can decide to either use
`.babelrc` for static configuration or `.babelrc.js` if you prefer to
programmatically create your configuration. If you use the `.babelrc` variant, please notice that Babel 7 will look for a `.babelrc` in the current directory. If Babel finds
other `.babelrc` files while transpiling files in a subfolder, it will merge the configurations together.

Because our packages share the same Babel configuration, we chose
to create a single top-level `babel.config.js` where we can
programmatically create the configuration based on the `BABEL_ENV` and
`NODE_ENV` environment variables. The same configuration file is used
to run jest tests.

We could not avoid having babel configurations in subfolders because
the Babel 7 does not continue searching above the first `package.json` that it finds, and we run the `yarn build` command for the packages via top-level `yarn lerna run build`, which means it will be executed from the package folder.

Fortunately, we are able to reuse the top-level
`babel.config.js` by having the package-specific `babel.config.js`
with just the following content:

```javascript
module.exports = {
  extends: '../../babel.config.js'
}
```

Alternatively, you can also use `.babelrc.js` with the following content:

```javascript
const babelConfig = require('../../babel.config')

module.exports = babelConfig
```

> In this case, make sure that you do not use the `--no-babelrc`
option in any of the babel commands in the `tools/build.js` top-level
script.


So to summarize, we have a top-level `babel.config.js` and then for each package that we intend to publish to npm registry we have `babel.config.js`.

Also notice that React apps do not need any extra babel configuration - running of the tests is nicely handled by the top-level `babel.config.js`.

And finally, `telepath-queuing-service` uses its own (simplified) babel configuration -
it is not intended to be published as an npm package and its configuration is a
bit different than other cogito packages.

## Staying in sync with upstream

You can follow the steps described in [Syncing a
fork](https://help.github.com/articles/syncing-a-fork/). We recommend that you
keep your local master branch pointing to the upstream master branch. Remaining
in sync then becomes really easy:

```
git remote add upstream https://github.com/philips-software/cogito.git
git fetch upstream
git branch --set-upstream-to=upstream/master master
```

Now, when you do `git pull` from your local `master` branch git will fetch
changes from the `upstream` remote. Then you can make all of your pull request
branches based on this `master` branch.

## Submitting a Pull Request

Please go through existing issues and pull requests to check if somebody else is
already working on it, we use `someone working on it` label to mark such issues.

Also, make sure to check if all packages build and that the tests pass before
you commit your changes.

When merging pull requests, we use the Github "Rebase and merge" strategy, meaning
that the commits are rebased on master. This gives you, as a contributor, the
responsibility to make sure your pull request contains the right set of commits.
In other words, before making the pull request, please check whether your
commits tell a clear story. If not, first squash / rebase commits as needed
on your branch, and only then create the pull request.

## Publishing Cogito packages

When you want to publish Cogito packages, please do the following:

Note: **ALWAYS PUBLISH ON MASTER**

Make sure you've installed the latest packages and a clean git repository.
```
yarn
```

Build the application by running the setup:
```
yarn setup:dev
```

Rebuild to make sure:
```
yarn build
```

Login to npm:
```
npm login
```

Publish packages. Make sure you've updated the documentation.
```
yarn lerna publish
```

