const { Builder } = require('../../../tools/build')

const builder = new Builder({umdFileName: 'demo-app-contracts', copyFiles: true})

builder.build()
