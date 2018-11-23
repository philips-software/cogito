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

  transpile ({ logMessage, babelEnv, outputDir }) {
    console.log(logMessage)

    this.exec(`babel source -d ${outputDir} --delete-dir-on-start ${this.copyFiles} --source-maps`, {
      BABEL_ENV: babelEnv
    })
  }

  commonjs () {
    this.transpile({
      logMessage: '\nBuilding CommonJS modules...',
      babelEnv: 'commonjs',
      outputDir: 'lib'
    })
  }

  es () {
    if (this.esModule) {
      this.transpile({
        logMessage: '\nBuilding ES modules...',
        babelEnv: 'es',
        outputDir: 'es'
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
