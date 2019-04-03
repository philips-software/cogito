import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import { createSerializer } from 'jest-emotion'
import * as emotion from 'emotion'

expect.addSnapshotSerializer(createSerializer(emotion))
jest.setTimeout(9000)
