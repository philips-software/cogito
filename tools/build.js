const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')
const packageJson = require(path.join(process.cwd(), 'package.json'))

class Builder {
  constructor ({ copyFiles } = {}) {
    this.packageName = packageJson.name
    this.esModule = packageJson.module
    this.copyFiles = copyFiles ? '--copy-files' : ''
  }

  exec (command, extraEnv) {
    execSync(command, {
      stdio: 'inherit',
      env: Object.assign({}, process.env, extraEnv)
    })
  }

  commonjs () {
    console.log('Building CommonJS modules ...')

    this.exec(`babel source -d lib --delete-dir-on-start ${this.copyFiles} --source-maps`, {
      BABEL_ENV: 'commonjs'
    })
  }

  es () {
    if (this.esModule) {
      console.log('\nBuilding ES modules ...')

      this.exec(`babel source -d es --delete-dir-on-start ${this.copyFiles} --source-maps`, {
        BABEL_ENV: 'es'
      })
    }
  }

  umd () {
    const webpackConfigPath = path.join(process.cwd(), 'webpack.config.js')
    if (fs.existsSync(webpackConfigPath)) {
      const webpackConfig = require(path.join(process.cwd(), 'webpack.config.js'))
      this.webpack(webpackConfig)

      this.reportProductionUmdBuildSize(webpackConfig)
    }
  }

  webpack (webpackConfig) {
    console.log(`\nBuilding ${webpackConfig().output.filename} UMD module ...`)

    this.exec('webpack')

    console.log(`\nBuilding ${webpackConfig({ production: true }).output.filename} UMD module ...`)

    this.exec('webpack --env.production')
  }

  reportProductionUmdBuildSize (webpackConfig) {
    const size = gzipSize.sync(
      fs.readFileSync(`umd/${webpackConfig({ production: true }).output.filename}`)
    )

    console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
  }

  build () {
    console.log('\n---------------------------------------------------')
    console.log(`Building ${this.packageName}`)
    this.commonjs()
    this.es()
    this.umd()
    console.log('---------------------------------------------------\n')
  }
}

module.exports = { Builder }
