import { secp256r1 } from '@noble/curves/p256'

import type { Bytes } from '../../Bytes.js'
import type { Errors } from '../../Errors.js'
import { Hex } from '../../Hex.js'
import { PublicKey_from } from '../PublicKey/from.js'
import type { PublicKey } from '../PublicKey/types.js'

/**
 * Computes the P256 ECDSA public key from a provided private key.
 *
 * @example
 * ```ts twoslash
 * import { P256 } from 'ox'
 *
 * const publicKey = P256.getPublicKey({ privateKey: '0x...' })
 * ```
 *
 * @param options - The options to compute the public key.
 * @returns The computed public key.
 */
export function P256_getPublicKey(
  options: P256_getPublicKey.Options,
): PublicKey {
  const { privateKey } = options
  const point = secp256r1.ProjectivePoint.fromPrivateKey(
    typeof privateKey === 'string'
      ? privateKey.slice(2)
      : Hex.fromBytes(privateKey).slice(2),
  )
  return PublicKey_from(point)
}

export declare namespace P256_getPublicKey {
  type Options = {
    /**
     * Private key to compute the public key from.
     */
    privateKey: Hex | Bytes
  }

  type ErrorType = Errors.GlobalErrorType
}
