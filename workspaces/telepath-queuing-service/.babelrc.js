module.exports = function (api) {
  const babelEnv = api.env()
  api.cache(true)

  console.log('[telepath-queueing] babelEnv=', babelEnv)

  const presets = setupPresets()
  const plugins = setupPlugins()
  const ignore = setupIgnoredFiles(babelEnv)

  return {
    presets,
    plugins,
    ignore
  }
}

function setupPresets (babelEnv) {
  return ['@babel/preset-env']
}

function setupPlugins () {
  return [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime'
  ]
}

function setupIgnoredFiles (babelEnv) {
  let ignore

  if (babelEnv !== 'test') {
    ignore = [
      '**/*.test.js',
      '**/__mocks__/**'
    ]
  }

  return ignore
}
