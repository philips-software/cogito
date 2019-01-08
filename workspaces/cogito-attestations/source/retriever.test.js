import { AttestationsRetriever } from './retriever'

describe('attestations retriever', () => {
  let retriever
  let telepathChannel

  beforeEach(() => {
    telepathChannel = { send: jest.fn() }
    retriever = new AttestationsRetriever({ telepathChannel })
  })

  describe('requesting attestations', () => {
    const type = 'email'
    const attestations = [ 'email:bob@example.com', 'email:bobby@example.com' ]

    beforeEach(() => {
      const response = { jsonrpc: '2.0', result: attestations }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('sends the correct request', async () => {
      await retriever.retrieve({ type })
      const request = {
        jsonrpc: '2.0',
        method: 'attestations',
        params: { type }
      }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns the attestations', async () => {
      expect(await retriever.retrieve({ type })).toEqual(attestations)
    })

    it('throws when an error is returned', async () => {
      const message = 'some error'
      const error = { code: -42, message }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(retriever.retrieve({ type })).rejects.toThrow(new Error(message))
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await retriever.retrieve({ type })
      await retriever.retrieve({ type })
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })
})
