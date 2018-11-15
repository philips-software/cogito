const { Builder } = require('../../../tools/build')

const builder = new Builder({ umdFileName: 'cogito-attestations', useWebpack: true })

builder.build()
