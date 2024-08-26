import { ripemd160 } from '@noble/hashes/ripemd160'

import { Bytes_from } from '../bytes/from.js'
import type { GlobalErrorType } from '../errors/error.js'
import { Hex_from } from '../hex/from.js'
import { Hex_isHex } from '../hex/isHex.js'
import type { Bytes, Hex } from '../types/data.js'

/**
 * Calculates the [Ripemd160](https://en.wikipedia.org/wiki/RIPEMD) hash of a Bytes or Hex value.
 *
 * This function is a re-export of `keccak_256` from [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) – an audited & minimal JS hashing library.
 *
 * @example
 * ```ts twoslash
 * import { Hash } from 'ox'
 *
 * Hash.ripemd160('0xdeadbeef')
 * // '0x226821c2f5423e11fe9af68bd285c249db2e4b5a'
 * ```
 */
export function Hash_ripemd160<to extends 'Hex' | 'Bytes' = 'Hex'>(
  value: Hex | Bytes,
  to_?: to | undefined,
): Hash_ripemd160.ReturnType<to> {
  const to = to_ || 'Hex'
  const bytes = ripemd160(
    Hex_isHex(value, { strict: false }) ? Bytes_from(value) : value,
  )
  if (to === 'Bytes') return bytes as Hash_ripemd160.ReturnType<to>
  return Hex_from(bytes) as Hash_ripemd160.ReturnType<to>
}

export declare namespace Hash_ripemd160 {
  type ReturnType<to extends 'Hex' | 'Bytes' = 'Hex'> =
    | (to extends 'Bytes' ? Bytes : never)
    | (to extends 'Hex' ? Hex : never)

  type ErrorType =
    | Bytes_from.ErrorType
    | Hex_isHex.ErrorType
    | Hex_from.ErrorType
    | GlobalErrorType
}

/* v8 ignore next */
Hash_ripemd160.parseError = (error: unknown) =>
  error as Hash_ripemd160.ErrorType
