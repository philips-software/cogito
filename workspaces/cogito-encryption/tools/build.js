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

console.log('\nBuilding cogito-encryption.js ...')

exec('rollup -c -f umd -o umd/cogito-encryption.js', {
  BABEL_ENV: 'umd',
  NODE_ENV: 'development'
})

console.log('\nBuilding cogito-encryption.min.js ...')

exec('rollup -c -f umd -o umd/cogito-encryption.min.js', {
  BABEL_ENV: 'umd',
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('umd/cogito-encryption.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
