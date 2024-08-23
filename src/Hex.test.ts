import { expect, test } from 'vitest'
import * as exports from './Hex.js'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "assertHex",
      "assert",
      "concat",
      "isHex",
      "isEqual",
      "padLeft",
      "padRight",
      "slice",
      "size",
      "trimLeft",
      "trimRight",
      "fromHex",
      "to",
      "hexToBigInt",
      "toBigInt",
      "hexToBoolean",
      "toBoolean",
      "hexToNumber",
      "toNumber",
      "hexToString",
      "toString",
      "hexToBytes",
      "toBytes",
      "booleanToHex",
      "fromBoolean",
      "bytesToHex",
      "fromBytes",
      "numberToHex",
      "fromBigInt",
      "fromNumber",
      "stringToHex",
      "fromString",
      "toHex",
      "from",
      "randomHex",
      "random",
    ]
  `)
})
