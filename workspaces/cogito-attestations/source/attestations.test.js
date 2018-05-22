import { CogitoAttestations } from './attestations'

describe('attestations', () => {
  let cogitoAttestations
  let telepathChannel

  beforeEach(() => {
    telepathChannel = { send: jest.fn() }
    cogitoAttestations = new CogitoAttestations({ telepathChannel })
  })

  describe('requesting attestations', () => {
    const type = 'email'
    const attestations = [ 'email:bob@example.com', 'email:bobby@example.com' ]

    beforeEach(() => {
      const response = { jsonrpc: '2.0', result: attestations }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('sends the correct request', async () => {
      await cogitoAttestations.retrieve({ type })
      const request = {
        jsonrpc: '2.0',
        method: 'attestations',
        params: { type }
      }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns the attestations', async () => {
      expect(await cogitoAttestations.retrieve({ type })).toEqual(attestations)
    })

    it('throws when an error is returned', async () => {
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoAttestations.retrieve({ type })).rejects.toBeDefined()
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await cogitoAttestations.retrieve({ type })
      await cogitoAttestations.retrieve({ type })
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })
})
