import React from 'react'
import { GanacheTestNetwork } from 'test-helpers'
import { render, wait } from 'react-testing-library'
import { CogitoReact } from './CogitoReact'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

describe('cogito-react', () => {
  // const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  let ganacheTestNetwork
  const appName = 'Cogito Demo App'

  const setupRenderPropFunction = () => {
    const renderFunctionArgs = {}
    const renderFuncion = args => {
      Object.assign(renderFunctionArgs, args)
      return null
    }
    return {
      renderFuncion,
      renderFunctionArgs
    }
  }

  const setupContractsInfo = () => {
    const contractsInfo = {
      rawContractsInfo: [
        { contractName: 'simpleStorage', contractDefinition: SimpleStorage }
      ],
      deployedContractsInfo: []
    }

    return contractsInfo
  }

  beforeEach(() => {
    ganacheTestNetwork = new GanacheTestNetwork()
    window.web3 = ganacheTestNetwork.web3
    process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('provides an instance of web3, telepath channel and contracts', async () => {
    const { renderFuncion, renderFunctionArgs } = setupRenderPropFunction()

    const contractsInfo = setupContractsInfo()

    render(<CogitoReact
      contracts={contractsInfo}
      appName={appName}>
      {renderFuncion}
    </CogitoReact>)

    await wait(() => {
      expect(renderFunctionArgs.web3).toBeDefined()
      expect(renderFunctionArgs.contracts.simpleStorage).toBeDefined()
      expect(renderFunctionArgs.contracts.simpleStorage.deployed).toEqual(expect.any(Function))
      expect(renderFunctionArgs.channel.appName).toBe(appName)
      expect(renderFunctionArgs.channel.key).toEqual(expect.any(Uint8Array))
      expect(renderFunctionArgs.channel.id).toEqual(expect.any(String))
    })
  })
})
