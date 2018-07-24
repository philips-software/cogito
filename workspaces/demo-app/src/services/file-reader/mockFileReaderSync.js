import { FileStreamReaderAsync } from './FileStreamReaderAsync'
import { FileReaderSyncMock } from './FileReaderSyncMock'

const mockFileReaderSync = async file => {
  const abs = []
  const fileStreamReaderAsync = new FileStreamReaderAsync(file, dataChunk => {
    abs.push(dataChunk)
  })

  await fileStreamReaderAsync.read()

  FileReaderSyncMock.prepare(abs)
}

export { mockFileReaderSync }
