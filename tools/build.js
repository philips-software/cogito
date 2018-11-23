const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

class Builder {
  constructor ({ umdFileName, skipEsModules, copyFiles } = {}) {
    this.umdFileName = umdFileName
    this.skipEsModules = skipEsModules
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
    console.log('\nBuilding ES modules ...')

    this.exec(`babel source -d es --delete-dir-on-start ${this.copyFiles} --source-maps`, {
      BABEL_ENV: 'es'
    })
  }

  umd () {
    this.webpack()

    this.reportProductionUmdBuildSize()
  }

  messageUmd () {
    console.log(`\n$[WEBPACK] Building ${this.umdFileName}.js UMD module ...`)
  }

  messageMinUmd () {
    console.log(`\n[WEBPACK] Building ${this.umdFileName}.min.js UMD module ...`)
  }

  webpack () {
    this.messageUmd()

    this.exec('webpack --mode=development -o umd/cogito-attestations.js')

    this.messageMinUmd()

    this.exec('webpack --mode=production -o umd/cogito-attestations.min.js')
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
