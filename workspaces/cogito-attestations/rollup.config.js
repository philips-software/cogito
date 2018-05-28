import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import json from 'rollup-plugin-json'

const config = {
  input: 'source/index.js',
  output: {
    name: 'cogitoAttestations'
  },
  plugins: [
    autoExternal({
      builtins: false,
      dependencies: false,
      peerDependencies: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    json(),
    babel({
      exclude: /node_modules/
    }),
    resolve(),
    commonjs({
      include: /node_modules/
    })
  ],
  external: [ 'ethereumjs-util' ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify())
}

export default config
