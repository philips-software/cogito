> Working on your first Pull Request? You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Code organization

We keep Cogito in a monorepo. Cogito consists of many packages that all live in this repository. We use a combination of [lerna](https://lernajs.io) and [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage them.

After you clone your forked repo, follow the following steps to bootstrap your local environment:

```bash
» yarn install
» (cd workspaces/demo-app/truffle && yarn install && yarn truffle compile)
» yarn build-for-netlify
» yarn test
» (cd workspaces/demo-app && yarn start-all)
» (cd workspaces/cogito-ios-app-distribution && yarn start)
» (cd workspaces/homepage && yarn develop)
```

Now step-by-step.

### yarn install

We first install all mono-repo dependencies with `yarn install`. It is fine if you see some warnings like those below:
```bash
» yarn install
yarn install v1.7.0
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning "workspace-aggregator-a042c019-5e73-4ff2-8358-fc2678427cd2 > homepage > eslint-config-react-app@2.1.0" has incorrect peer dependency "babel-eslint@^7.2.3".
warning "workspace-aggregator-a042c019-5e73-4ff2-8358-fc2678427cd2 > cogito-ios-app-distribution > @react-frontend-developer/react-scripts > babel-loader@8.0.0-beta.0" has incorrect peer dependency "webpack@2 || 3".
warning "workspace-aggregator-a042c019-5e73-4ff2-8358-fc2678427cd2 > homepage > gatsby > babel-plugin-remove-graphql-queries@2.0.2-beta.4" has incorrect peer dependency "graphql@^0.11.7".
warning "workspace-aggregator-a042c019-5e73-4ff2-8358-fc2678427cd2 > cogito-ios-app-distribution > @react-frontend-developer/react-scripts > babel-preset-react-app > babel-plugin-transform-dynamic-import > @babel/plugin-syntax-dynamic-import@7.0.0-beta.34" has incorrect peer dependency "@babel/core@7.0.0-beta.34".
[4/4] 📃  Building fresh packages...
✨  Done in 78.05s.
```

### truffle

Working with [truffle] can be tricky in a standard repo, and it is even more tricky in a monorepo. We want to keep all truffle stuff nicely separated from the React app and this is why for now, we have to perform these a bit inconvenient steps to get it properly initialized. We first install truffle specific dependencies and then we compile the contracts.

```bash
» (cd workspaces/demo-app/truffle && yarn install && yarn truffle compile)
yarn install v1.7.0
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning "ganache-cli > webpack-cli@2.0.14" has unmet peer dependency "webpack@^4.0.0".
[4/4] 📃  Building fresh packages...
✨  Done in 7.42s.
yarn run v1.7.0
$ /Users/mczenko/Documents/Projects/Philips/BLOCKCHAIN/lerna/tmp-cogito/cogito/workspaces/demo-app/truffle/node_modules/.bin/truffle compile
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/SimpleStorage.sol...
Writing artifacts to ./build/contracts

✨  Done in 6.79s.
```

The React app needs to "see" the contracts. This happens via symbolic link:

```bash
» ls -l workspaces/demo-app/src/contracts
lrwxr-xr-x  1 uname  ugroup  26 Jul 17 16:10 workspaces/demo-app/src/contracts -> ../truffle/build/contracts
```

If this is not what you see, you may need to recreate the link your self, either manually or by running `yarn link-contracts` from `workspaces/demo-app` directory.

[truffle]: https://truffleframework.com

### Build packages

Our monorepo contains a number of packages. They have to be build before client apps like `demo-app` and `cogito-ios-app-distribution` (both React) and `homepage` (Gatsby-based, so also React) can use them. We normally do not have to build `homepage` unless we want to (re)deploy it (we use netlify for deployment) that's why we use a build script `yarn build-for-netlify`. If you do not need to build the Gatsby-based `homepage` you can just do `yarn build`.

### Run tests

Finally, the tests to confirm that everything is well in place. We run all the tests from top level - this is far more efficient especially if the number of workspaces in the monorepo increases:

```bash
» yarn test
» yarn test --no-cache    // good to know this
» yarn jest --clearCache  // a nice one
```


> Also the tests for React apps are run from the monorepo level.

### Starting the demo-app

`demo-app` is a React-based web app that we use to demonstrate the use of various cogito components. It requires an Ethereum network with deployed contracts, a running `faucet` to seed the Ethereum accounts with some initial Ether needed to execute contracts, a deployed telepath queuing service (we have deployed one to be used with cogito apps, but you can also deploy your own), and finally, you will need to have the iOS Cogito app on your iPhone running. All the components of this infrastructure are open-sourced, but you can use the one that we deploy just to make starting up with Cogito easier.

To start a local Ethereum network with a local faucet you can use a convenience script:

```bash
» cd workspaces/demo-app
» yarn start-all
```

### Starting the cogito-ios-app-distribution

This is the app we use to make downloading and installing our Cogito iOS App easier for our partners. We use it for internal use only, but your can use the source code to use it for your own version of the iOS Cogito App if you like.

```bash
» cd workspaces/cogito-ios-app-distribution
» yarn start
```

### Gatsby-based homepage

This is our Cogito landing page. It uses Gatsby and we deploy it to netlify. Standard Gatsby cli can be used:

```bash
» cd workspaces/homepage
» yarn develop
» yarn build
```

We follow the beta-path of Gatsby 2.

## Babel 7

We decided to only support Babel 7, even though it is still in beta. It introduces some difficulties for now, but we hope this to pay back when Babel 7 moves out of the beta.

The use of Babel 7 has impact on almost every aspect of the monorepo: running tests, keeping React app intact and having Gatsby operational.

Since version `beta.46` Babel changed how babel configuration is discovered. We have to admit it still a bit confusing to us, but we managed to have an operational version that works well across all of our workspaces.

Babel 7 allows three different configuration files: `babel.config.js`, `.babelrc.js`, and the familiar `.babelrc`. The semantics of file discovery have changed. If `babel.config.js` is present at your current working directory, only this file will be used and `.babelrc` and `.babelrc.js` will be ignored (and it does not matter if they are in your `cwd` or in own of the subfolders).

If `babel.config.js` is not present, you can decide to either use `.babelrc` for static configuration or `.babelrc.js` if you prefer to programmatically create your configuration. If you use the `.babelrc` variant, please notice that the new Babel will look for a `.babelrc` in the current directory. If Babel finds other `.babelrc` files while transpiling files in a subfolder, it will merge the configurations together.

Because most of our Cogito packages share the same Babel configuration, we chose to create a single top-level `babel.config.js` where we can programmatically create the configuration based on the `BABEL_ENV` and `NODE_ENV` environment variables.

Also, we discovered that `jest` does not seem to like using anything but `babel.config.js` (it ignores `.babelrc` file even if `babel.config.js` is not present). When run from the top-level of the monorepo (as we want it to be), `jest` also does not seem to see `.babelrc` or `.babelrc.js` in the subfolders. In short, using top-level `babel.config.js` is the only option that worked for us with `jest`.

We could not avoid having babel configurations in subfolders because the new babel does not continue searching above the first `package.json` that it finds, and we run the `yarn build` command for the packages via top-level `yarn lerna run --scope @cogitojs/** build`, which means it will be executed from the package folder. We hoped that we will be able to simply reuse the top-level `babel.config.js` by having the package-specific `babel.config.js` with just the following content:

```javascript
module.exports = {
  extends: '../../babel.config.js'
}
```

And so it works, except when it does not. It turns out that it causes some subtle problems with `rollup` that we use to build `UMD` bundles of our packages. Fortunately, the problems with `rollup` do not show up when we use either `.babelrc` or `.babelrc.js`. Even though we like `.babelrc` a bit more (everyone knows what it is, while `.babelrc.js` may feel scary for some), `.babelrc.js` reopens the possibility for reuse that we lost when we realized that `rollup` is not (yet) Babel 7 friendly.

So to summarize, we have a top-level `babel.config.js` and then for each package that we intend to publish we have `.babelrc.js` with the following content:

```javascript
const babelConfig = require('../../babel.config')

module.exports = babelConfig
```

The only exceptions are `@cogitojs/cogito-attestations` and `@cogitojs/faucet` where - as an illustration - we use `babel.config.js` that extends the top-level one. `@cogitojs/faucet` doesn't need a UMD build and `@cogitojs/cogito-attestations` uses `webpack` (`rollup` caused other problems here).

And finally, `telepath-queuing-service` uses its own simplified `.babelrc.js` - it is not intended to be published as an npm package and its configuration is a bit different than other cogito packages.

Also notice that React apps do not need any extra babel configuration - running of the tests is nicely handled by the top-level `babel.config.js`.

With all these varieties, we keep observing what's happening with Babel 7 and we are looking forward to settle down on something stable as soon as Babel 7 is out of beta.

For now, we recommend the user the following links to read more about new Babel:

- [Configure Babel](https://babeljs.io/docs/en/next/configuration) - a great starting point to understand different options
- [babel.config.js](https://babeljs.io/docs/en/next/babelconfigjs)
- [.babelrc](https://babeljs.io/docs/en/next/babelrc)
- [babel-core](https://babeljs.io/docs/en/next/babel-core), especially [babel-core options](https://babeljs.io/docs/en/next/babel-core#options)
- active discussion on how babel configuration is going to be: [#7358](https://github.com/babel/babel/pull/7358) (erlier it was on [#6766](https://github.com/babel/babel/issues/6766) see [this comment](https://github.com/babel/babel/issues/6766#issuecomment-382859481))

## Staying in sync with upstream

You can follow the steps described in [Syncing a fork](https://help.github.com/articles/syncing-a-fork/). We recommend that you keep your local master branch pointing to the upstream master branch. Remaining in sync then becomes really easy:

```
git remote add upstream https://github.com/philips-software/cogito.git
git fetch upstream
git branch --set-upstream-to=upstream/master master
```

Now, when you do `git pull` from your local `master` branch git will fetch changes from the `upstream` remote. Then you can make all of your pull request branches based on this `master` branch.


## Submitting a Pull Request

Please go through existing issues and pull requests to check if somebody else is already working on it, we use `someone working on it` label to mark such issues.

Also, make sure to check if all packages build and that the tests pass before you commit your changes.

```bash
$ yarn build-for-netlify && yarn test
```
