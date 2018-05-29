const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('Building CommonJS modules ...')

exec('babel source -d lib --delete-dir-on-start', {
  BABEL_ENV: 'commonjs'
})

console.log('\nBuilding ES modules ...')

exec('babel source -d es --delete-dir-on-start', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding cogito-attestations.js ...')

exec('browserify lib/index.js --standalone cogito-attestations > umd/cogito-attestations.js')

console.log('\nBuilding cogito-attestations.min.js ...')

exec('uglifyjs umd/cogito-attestations.js > umd/cogito-attestations.min.js')

const size = gzipSize.sync(
  fs.readFileSync('umd/cogito-attestations.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
