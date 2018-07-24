import '@react-frontend-developer/jsdom-worker'
import { ReactWebWorker } from './ReactWebWorker'
import { ExampleWorkerScript } from './ExampleWorkerScript'
import { Promise } from 'core-js'

describe('ReactWebWorker', () => {
  it('creates a worker from the provided script file', () => {
    let exampleWorker
    expect(() => {
      exampleWorker = ReactWebWorker.createFromScript(
        ExampleWorkerScript
      )
    }).not.toThrow()
    expect(exampleWorker).toBeDefined()
  })

  it('can send and receive data to and from worker', async () => {
    const exampleWorker = ReactWebWorker.createFromScript(ExampleWorkerScript)

    const promise = new Promise(resolve => {
      exampleWorker.onmessage = m => {
        resolve(m.data)
      }
    })

    exampleWorker.postMessage(5)

    const result = await promise

    expect(result).toBe(10)
  })
})
