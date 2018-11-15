import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import autoExternal from 'rollup-plugin-auto-external'

const config = {
  input: 'source/index.js',
  output: {
    name: 'crypto'
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
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({ browser: true }),
    commonjs({
      include: /node_modules/
    }),
    builtins()
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify())
}

export default config
