import type * as Errors from '../../../Errors.js'
import * as Hex from '../../../Hex.js'
import * as TransactionEnvelope from '../../../TransactionEnvelope.js'
import { AccessList_fromTupleList } from '../../AccessList/fromTupleList.js'
import { Blobs_toSidecars } from '../../Blobs/toSidecars.js'
import { Rlp_toHex } from '../../Rlp/to.js'
import { Signature_fromTuple } from '../../Signature/fromTuple.js'
import type { Compute } from '../../types.js'
import { TransactionEnvelopeEip4844_assert } from './assert.js'
import type {
  TransactionEnvelopeEip4844,
  TransactionEnvelopeEip4844_Serialized,
} from './types.js'

/**
 * Deserializes a {@link ox#TransactionEnvelopeEip4844.TransactionEnvelope} from its serialized form.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeEip4844 } from 'ox'
 *
 * const envelope = TransactionEnvelopeEip4844.deserialize('0x03ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0')
 * // @log: {
 * // @log:   blobVersionedHashes: [...],
 * // @log:   type: 'eip4844',
 * // @log:   nonce: 785n,
 * // @log:   maxFeePerGas: 2000000000n,
 * // @log:   gas: 1000000n,
 * // @log:   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 * // @log:   value: 1000000000000000000n,
 * // @log: }
 * ```
 *
 * @param serializedTransaction - The serialized transaction.
 * @returns Deserialized Transaction Envelope.
 */
export function TransactionEnvelopeEip4844_deserialize(
  serializedTransaction: TransactionEnvelopeEip4844_Serialized,
): Compute<TransactionEnvelopeEip4844> {
  const transactionOrWrapperArray = Rlp_toHex(
    Hex.slice(serializedTransaction, 1),
  )

  const hasNetworkWrapper = transactionOrWrapperArray.length === 4

  const transactionArray = hasNetworkWrapper
    ? transactionOrWrapperArray[0]!
    : transactionOrWrapperArray
  const wrapperArray = hasNetworkWrapper
    ? transactionOrWrapperArray.slice(1)
    : []

  const [
    chainId,
    nonce,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gas,
    to,
    value,
    data,
    accessList,
    maxFeePerBlobGas,
    blobVersionedHashes,
    yParity,
    r,
    s,
  ] = transactionArray
  const [blobs, commitments, proofs] = wrapperArray

  if (!(transactionArray.length === 11 || transactionArray.length === 14))
    throw new TransactionEnvelope.InvalidSerializedError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to,
        value,
        data,
        accessList,
        ...(transactionArray.length > 9
          ? {
              yParity,
              r,
              s,
            }
          : {}),
      },
      serializedTransaction,
      type: 'eip4844',
    })

  let transaction = {
    blobVersionedHashes: blobVersionedHashes as Hex.Hex[],
    chainId: Number(chainId),
    type: 'eip4844',
  } as TransactionEnvelopeEip4844
  if (Hex.validate(to) && to !== '0x') transaction.to = to
  if (Hex.validate(gas) && gas !== '0x') transaction.gas = BigInt(gas)
  if (Hex.validate(data) && data !== '0x') transaction.data = data
  if (Hex.validate(nonce) && nonce !== '0x') transaction.nonce = BigInt(nonce)
  if (Hex.validate(value) && value !== '0x') transaction.value = BigInt(value)
  if (Hex.validate(maxFeePerBlobGas) && maxFeePerBlobGas !== '0x')
    transaction.maxFeePerBlobGas = BigInt(maxFeePerBlobGas)
  if (Hex.validate(maxFeePerGas) && maxFeePerGas !== '0x')
    transaction.maxFeePerGas = BigInt(maxFeePerGas)
  if (Hex.validate(maxPriorityFeePerGas) && maxPriorityFeePerGas !== '0x')
    transaction.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas)
  if (accessList?.length !== 0 && accessList !== '0x')
    transaction.accessList = AccessList_fromTupleList(accessList as any)
  if (blobs && commitments && proofs)
    transaction.sidecars = Blobs_toSidecars(blobs as Hex.Hex[], {
      commitments: commitments as Hex.Hex[],
      proofs: proofs as Hex.Hex[],
    })

  const signature =
    r && s && yParity
      ? Signature_fromTuple([yParity as Hex.Hex, r as Hex.Hex, s as Hex.Hex])
      : undefined
  if (signature)
    transaction = {
      ...transaction,
      ...signature,
    } as TransactionEnvelopeEip4844

  TransactionEnvelopeEip4844_assert(transaction)

  return transaction
}

export declare namespace TransactionEnvelopeEip4844_deserialize {
  type ErrorType = Errors.GlobalErrorType
}

TransactionEnvelopeEip4844_deserialize.parseError = (error: unknown) =>
  /* v8 ignore next */
  error as TransactionEnvelopeEip4844_deserialize.ErrorType
