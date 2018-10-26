const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

class Builder {
  constructor ({umdFileName, useWebpack, skipEsModules}) {
    this.umdFileName = umdFileName
    this.useWebpack = useWebpack
    this.skipEsModules = skipEsModules
  }

  exec (command, extraEnv) {
    execSync(command, {
      stdio: 'inherit',
      env: Object.assign({}, process.env, extraEnv)
    })
  }

  commonjs () {
    console.log('Building CommonJS modules ...')

    this.exec('babel source -d lib --delete-dir-on-start --copy-files', {
      BABEL_ENV: 'commonjs'
    })
  }

  es () {
    console.log('\nBuilding ES modules ...')

    this.exec('babel source -d es --delete-dir-on-start --copy-files', {
      BABEL_ENV: 'es'
    })
  }

  umd () {
    if (this.useWebpack) {
      this.webpack()
    } else {
      this.rollup()
    }

    this.reportProductionUmdBuildSize()
  }

  messageUmd () {
    console.log(`\n${this.useWebpack ? '[WEBPACK]' : '[ROLLUP]'} Building ${this.umdFileName}.js UMD module ...`)
  }

  messageMinUmd () {
    console.log(`\n${this.useWebpack ? '[WEBPACK]' : '[ROLLUP]'} Building ${this.umdFileName}.min.js UMD module ...`)
  }

  webpack () {
    this.messageUmd()

    this.exec('webpack --mode=development -o umd/cogito-attestations.js')

    this.messageMinUmd()

    this.exec('webpack --mode=production -o umd/cogito-attestations.min.js')
  }

  rollup () {
    this.messageUmd()

    this.exec(`rollup -c -f umd -o umd/${this.umdFileName}.js`, {
      BABEL_ENV: 'umd',
      NODE_ENV: 'development'
    })

    this.messageMinUmd()

    this.exec(`rollup -c -f umd -o umd/${this.umdFileName}.min.js`, {
      BABEL_ENV: 'umd',
      NODE_ENV: 'production'
    })
  }

  reportProductionUmdBuildSize () {
    const size = gzipSize.sync(
      fs.readFileSync(`umd/${this.umdFileName}.min.js`)
    )

    console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
  }

  build () {
    this.commonjs()
    !this.skipEsModules && this.es()
    this.umdFileName && this.umd()
  }
}

module.exports = { Builder }
