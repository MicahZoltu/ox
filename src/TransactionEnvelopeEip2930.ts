import type * as Errors from './Errors.js'
import * as Hex from './Hex.js'
import type { Signature } from './Signature.js'
import * as TransactionEnvelope from './TransactionEnvelope.js'
import { AccessList_fromTupleList } from './internal/AccessList/fromTupleList.js'
import { AccessList_toTupleList } from './internal/AccessList/toTupleList.js'
import type { AccessList } from './internal/AccessList/types.js'
import { Address_assert } from './internal/Address/assert.js'
import { Hash_keccak256 } from './internal/Hash/keccak256.js'
import { Rlp_fromHex } from './internal/Rlp/from.js'
import { Rlp_toHex } from './internal/Rlp/to.js'
import { Signature_extract } from './internal/Signature/extract.js'
import { Signature_from } from './internal/Signature/from.js'
import { Signature_fromTuple } from './internal/Signature/fromTuple.js'
import { Signature_toRpc } from './internal/Signature/toRpc.js'
import { Signature_toTuple } from './internal/Signature/toTuple.js'
import type {
  Assign,
  Compute,
  PartialBy,
  UnionPartialBy,
} from './internal/types.js'

export type TransactionEnvelopeEip2930<
  signed extends boolean = boolean,
  bigintType = bigint,
  numberType = number,
  type extends string = TransactionEnvelopeEip2930.Type,
> = Compute<
  TransactionEnvelope.Base<type, signed, bigintType, numberType> & {
    /** EIP-2930 Access List. */
    accessList?: AccessList | undefined
    /** Base fee per gas. */
    gasPrice?: bigintType | undefined
  }
>
export namespace TransactionEnvelopeEip2930 {
  // #region Types

  export type Rpc<signed extends boolean = boolean> =
    TransactionEnvelopeEip2930<signed, Hex.Hex, Hex.Hex, '0x1'>

  export type Serialized = `${SerializedType}${string}`

  export const serializedType = '0x01' as const
  export type SerializedType = typeof serializedType

  export type Signed = TransactionEnvelopeEip2930<true>

  export const type = 'eip2930' as const
  export type Type = typeof type

  // #endregion

  // #region Functions

  /**
   * Asserts a {@link ox#(TransactionEnvelopeEip2930:type)} is valid.
   *
   * @example
   * ```ts twoslash
   * import { TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * TransactionEnvelopeEip2930.assert({
   *   gasPrice: 2n ** 256n - 1n + 1n,
   *   chainId: 1,
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: Value.fromEther('1'),
   * })
   * // @error: GasPriceTooHighError:
   * // @error: The gas price (`gasPrice` = 115792089237316195423570985008687907853269984665640564039457584007913 gwei) cannot be
   * // @error: higher than the maximum allowed value (2^256-1).
   * ```
   *
   * @param envelope - The transaction envelope to assert.
   */
  export function assert(
    envelope: PartialBy<TransactionEnvelopeEip2930, 'type'>,
  ) {
    const { chainId, gasPrice, to } = envelope
    if (chainId <= 0)
      throw new TransactionEnvelope.InvalidChainIdError({ chainId })
    if (to) Address_assert(to, { strict: false })
    if (gasPrice && BigInt(gasPrice) > 2n ** 256n - 1n)
      throw new TransactionEnvelope.GasPriceTooHighError({ gasPrice })
  }

  export declare namespace assert {
    type ErrorType =
      | Address_assert.ErrorType
      | TransactionEnvelope.InvalidChainIdError
      | TransactionEnvelope.GasPriceTooHighError
      | Errors.GlobalErrorType
  }

  assert.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as assert.ErrorType

  /**
   * Deserializes a {@link ox#(TransactionEnvelopeEip2930:type)} from its serialized form.
   *
   * @example
   * ```ts twoslash
   * import { TransactionEnvelopeEip2930 } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.deserialize('0x01ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0')
   * // @log: {
   * // @log:   type: 'eip2930',
   * // @log:   nonce: 785n,
   * // @log:   gasPrice: 2000000000n,
   * // @log:   gas: 1000000n,
   * // @log:   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   * // @log:   value: 1000000000000000000n,
   * // @log: }
   * ```
   *
   * @param serializedTransaction - The serialized transaction.
   * @returns Deserialized Transaction Envelope.
   */
  export function deserialize(
    serializedTransaction: TransactionEnvelopeEip2930.Serialized,
  ): TransactionEnvelopeEip2930 {
    const transactionArray = Rlp_toHex(Hex.slice(serializedTransaction, 1))

    const [
      chainId,
      nonce,
      gasPrice,
      gas,
      to,
      value,
      data,
      accessList,
      yParity,
      r,
      s,
    ] = transactionArray as readonly Hex.Hex[]

    if (!(transactionArray.length === 8 || transactionArray.length === 11))
      throw new TransactionEnvelope.InvalidSerializedError({
        attributes: {
          chainId,
          nonce,
          gasPrice,
          gas,
          to,
          value,
          data,
          accessList,
          ...(transactionArray.length > 8
            ? {
                yParity,
                r,
                s,
              }
            : {}),
        },
        serializedTransaction,
        type: 'eip2930',
      })

    let transaction = {
      chainId: Number(chainId as Hex.Hex),
      type: 'eip2930',
    } as TransactionEnvelopeEip2930
    if (Hex.validate(to) && to !== '0x') transaction.to = to
    if (Hex.validate(gas) && gas !== '0x') transaction.gas = BigInt(gas)
    if (Hex.validate(data) && data !== '0x') transaction.data = data
    if (Hex.validate(nonce) && nonce !== '0x') transaction.nonce = BigInt(nonce)
    if (Hex.validate(value) && value !== '0x') transaction.value = BigInt(value)
    if (Hex.validate(gasPrice) && gasPrice !== '0x')
      transaction.gasPrice = BigInt(gasPrice)
    if (accessList!.length !== 0 && accessList !== '0x')
      transaction.accessList = AccessList_fromTupleList(accessList as any)

    const signature =
      r && s && yParity ? Signature_fromTuple([yParity, r, s]) : undefined
    if (signature)
      transaction = {
        ...transaction,
        ...signature,
      } as TransactionEnvelopeEip2930

    TransactionEnvelopeEip2930.assert(transaction)

    return transaction
  }

  export declare namespace deserialize {
    type ErrorType = Errors.GlobalErrorType
  }

  /* v8 ignore next */
  deserialize.parseError = (error: unknown) => error as deserialize.ErrorType

  /**
   * Converts an arbitrary transaction object into an EIP-2930 Transaction Envelope.
   *
   * @example
   * ```ts twoslash
   * // @noErrors
   * import { TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   accessList: [...],
   *   gasPrice: Value.fromGwei('10'),
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: Value.fromEther('1'),
   * })
   * ```
   *
   * @example
   * ### Attaching Signatures
   *
   * It is possible to attach a `signature` to the transaction envelope.
   *
   * ```ts twoslash
   * import { Secp256k1, TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   gasPrice: Value.fromGwei('10'),
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: Value.fromEther('1'),
   * })
   *
   * const signature = Secp256k1.sign({
   *   payload: TransactionEnvelopeEip2930.getSignPayload(envelope),
   *   privateKey: '0x...',
   * })
   *
   * const envelope_signed = TransactionEnvelopeEip2930.from(envelope, { // [!code focus]
   *   signature, // [!code focus]
   * }) // [!code focus]
   * // @log: {
   * // @log:   chainId: 1,
   * // @log:   gasPrice: 10000000000n,
   * // @log:   to: '0x0000000000000000000000000000000000000000',
   * // @log:   type: 'eip2930',
   * // @log:   value: 1000000000000000000n,
   * // @log:   r: 125...n,
   * // @log:   s: 642...n,
   * // @log:   yParity: 0,
   * // @log: }
   * ```
   *
   * @example
   * ### From Serialized
   *
   * It is possible to instantiate an EIP-2930 Transaction Envelope from a {@link ox#(TransactionEnvelopeEip2930:namespace).Serialized} value.
   *
   * ```ts twoslash
   * import { TransactionEnvelopeEip2930 } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from('0x01f858018203118502540be4008504a817c800809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c08477359400e1a001627c687261b0e7f8638af1112efa8a77e23656f6e7945275b19e9deed80261')
   * // @log: {
   * // @log:   chainId: 1,
   * // @log:   gasPrice: 10000000000n,
   * // @log:   to: '0x0000000000000000000000000000000000000000',
   * // @log:   type: 'eip2930',
   * // @log:   value: 1000000000000000000n,
   * // @log: }
   * ```
   *
   * @param envelope - The transaction object to convert.
   * @param options - Options.
   * @returns A {@link ox#(TransactionEnvelopeEip2930:type)}
   */
  export function from<
    const envelope extends
      | UnionPartialBy<TransactionEnvelopeEip2930, 'type'>
      | TransactionEnvelopeEip2930.Serialized,
    const signature extends Signature | undefined = undefined,
  >(
    envelope:
      | envelope
      | UnionPartialBy<TransactionEnvelopeEip2930, 'type'>
      | TransactionEnvelopeEip2930.Serialized,
    options: TransactionEnvelopeEip2930.from.Options<signature> = {},
  ): TransactionEnvelopeEip2930.from.ReturnType<envelope, signature> {
    const { signature } = options

    const envelope_ = (
      typeof envelope === 'string'
        ? TransactionEnvelopeEip2930.deserialize(envelope)
        : envelope
    ) as TransactionEnvelopeEip2930

    TransactionEnvelopeEip2930.assert(envelope_)

    return {
      ...envelope_,
      ...(signature ? Signature_from(signature) : {}),
      type: 'eip2930',
    } as never
  }

  export declare namespace from {
    type Options<signature extends Signature | undefined = undefined> = {
      signature?: signature | Signature | undefined
    }

    type ReturnType<
      envelope extends
        | UnionPartialBy<TransactionEnvelopeEip2930, 'type'>
        | Hex.Hex = TransactionEnvelopeEip2930 | Hex.Hex,
      signature extends Signature | undefined = undefined,
    > = Compute<
      envelope extends Hex.Hex
        ? TransactionEnvelopeEip2930
        : Assign<
            envelope,
            (signature extends Signature ? Readonly<signature> : {}) & {
              readonly type: 'eip2930'
            }
          >
    >

    type ErrorType =
      | TransactionEnvelopeEip2930.deserialize.ErrorType
      | TransactionEnvelopeEip2930.assert.ErrorType
      | Errors.GlobalErrorType
  }

  from.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as from.ErrorType

  /**
   * Returns the payload to sign for a {@link ox#(TransactionEnvelopeEip2930:type)}.
   *
   * @example
   * The example below demonstrates how to compute the sign payload which can be used
   * with ECDSA signing utilities like {@link ox#Secp256k1.(sign:function)}.
   *
   * ```ts twoslash
   * import { Secp256k1, TransactionEnvelopeEip2930 } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   nonce: 0n,
   *   gasPrice: 1000000000n,
   *   gas: 21000n,
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   *
   * const payload = TransactionEnvelopeEip2930.getSignPayload(envelope) // [!code focus]
   * // @log: '0x...'
   *
   * const signature = Secp256k1.sign({ payload, privateKey: '0x...' })
   * ```
   *
   * @param envelope - The transaction envelope to get the sign payload for.
   * @returns The sign payload.
   */
  export function getSignPayload(
    envelope: TransactionEnvelopeEip2930,
  ): getSignPayload.ReturnType {
    return TransactionEnvelopeEip2930.hash(envelope, { presign: true })
  }

  export declare namespace getSignPayload {
    type ReturnType = Hex.Hex

    type ErrorType =
      | TransactionEnvelopeEip2930.hash.ErrorType
      | Errors.GlobalErrorType
  }

  getSignPayload.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as getSignPayload.ErrorType

  /**
   * Hashes a {@link ox#(TransactionEnvelopeEip2930:type)}. This is the "transaction hash".
   *
   * @example
   * ```ts twoslash
   * import { Secp256k1, TransactionEnvelopeEip2930 } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   nonce: 0n,
   *   gasPrice: 1000000000n,
   *   gas: 21000n,
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   *
   * const signature = Secp256k1.sign({
   *   payload: TransactionEnvelopeEip2930.getSignPayload(envelope),
   *   privateKey: '0x...',
   * })
   *
   * const envelope_signed = TransactionEnvelopeEip2930.from(envelope, {
   *   signature,
   * })
   *
   * const hash = TransactionEnvelopeEip2930.hash(envelope_signed) // [!code focus]
   * ```
   *
   * @param envelope - The EIP-2930 Transaction Envelope to hash.
   * @param options - Options.
   * @returns The hash of the transaction envelope.
   */
  export function hash<presign extends boolean = false>(
    envelope: TransactionEnvelopeEip2930<presign extends true ? false : true>,
    options: TransactionEnvelopeEip2930.hash.Options<presign> = {},
  ): hash.ReturnType {
    const { presign } = options
    return Hash_keccak256(
      TransactionEnvelopeEip2930.serialize({
        ...envelope,
        ...(presign
          ? {
              r: undefined,
              s: undefined,
              yParity: undefined,
              v: undefined,
            }
          : {}),
      }),
    )
  }

  export declare namespace hash {
    type Options<presign extends boolean = false> = {
      /** Whether to hash this transaction for signing. @default false */
      presign?: presign | boolean | undefined
    }

    type ReturnType = Hex.Hex

    type ErrorType =
      | Hash_keccak256.ErrorType
      | TransactionEnvelopeEip2930.serialize.ErrorType
      | Errors.GlobalErrorType
  }

  hash.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as hash.ErrorType

  /**
   * Serializes a {@link ox#(TransactionEnvelopeEip2930:type)}.
   *
   * @example
   * ```ts twoslash
   * import { TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   gasPrice: Value.fromGwei('10'),
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: Value.fromEther('1'),
   * })
   *
   * const serialized = TransactionEnvelopeEip2930.serialize(envelope) // [!code focus]
   * ```
   *
   * @example
   * ### Attaching Signatures
   *
   * It is possible to attach a `signature` to the serialized Transaction Envelope.
   *
   * ```ts twoslash
   * import { Secp256k1, TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   gasPrice: Value.fromGwei('10'),
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: Value.fromEther('1'),
   * })
   *
   * const signature = Secp256k1.sign({
   *   payload: TransactionEnvelopeEip2930.getSignPayload(envelope),
   *   privateKey: '0x...',
   * })
   *
   * const serialized = TransactionEnvelopeEip2930.serialize(envelope, { // [!code focus]
   *   signature, // [!code focus]
   * }) // [!code focus]
   *
   * // ... send `serialized` transaction to JSON-RPC `eth_sendRawTransaction`
   * ```
   *
   * @param envelope - The Transaction Envelope to serialize.
   * @param options - Options.
   * @returns The serialized Transaction Envelope.
   */
  export function serialize(
    envelope: PartialBy<TransactionEnvelopeEip2930, 'type'>,
    options: TransactionEnvelopeEip2930.serialize.Options = {},
  ): TransactionEnvelopeEip2930.Serialized {
    const {
      chainId,
      gas,
      data,
      input,
      nonce,
      to,
      value,
      accessList,
      gasPrice,
    } = envelope

    TransactionEnvelopeEip2930.assert(envelope)

    const accessTupleList = AccessList_toTupleList(accessList)

    const signature = Signature_extract(options.signature || (envelope as any))

    const serializedTransaction = [
      Hex.fromNumber(chainId),
      nonce ? Hex.fromNumber(nonce) : '0x',
      gasPrice ? Hex.fromNumber(gasPrice) : '0x',
      gas ? Hex.fromNumber(gas) : '0x',
      to ?? '0x',
      value ? Hex.fromNumber(value) : '0x',
      data ?? input ?? '0x',
      accessTupleList,
      ...(signature ? Signature_toTuple(signature) : []),
    ] as const

    return Hex.concat(
      '0x01',
      Rlp_fromHex(serializedTransaction),
    ) as TransactionEnvelopeEip2930.Serialized
  }

  export declare namespace serialize {
    type Options = {
      /** Signature to append to the serialized Transaction Envelope. */
      signature?: Signature | undefined
    }

    type ErrorType =
      | TransactionEnvelopeEip2930.assert.ErrorType
      | Hex.fromNumber.ErrorType
      | Signature_toTuple.ErrorType
      | Hex.concat.ErrorType
      | Rlp_fromHex.ErrorType
      | Errors.GlobalErrorType
  }

  serialize.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as serialize.ErrorType

  /**
   * Converts an {@link ox#(TransactionEnvelopeEip2930:type)} to an {@link ox#(TransactionEnvelopeEip2930:namespace).Rpc}.
   *
   * @example
   * ```ts twoslash
   * import { RpcRequest, TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * const envelope = TransactionEnvelopeEip2930.from({
   *   chainId: 1,
   *   nonce: 0n,
   *   gas: 21000n,
   *   maxFeePerGas: Value.fromGwei('20'),
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: Value.fromEther('1'),
   * })
   *
   * const envelope_rpc = TransactionEnvelopeEip2930.toRpc(envelope) // [!code focus]
   *
   * const request = RpcRequest.from({
   *   id: 0,
   *   method: 'eth_sendTransaction',
   *   params: [envelope_rpc],
   * })
   * ```
   *
   * @param envelope - The EIP-2930 transaction envelope to convert.
   * @returns An RPC-formatted EIP-2930 transaction envelope.
   */
  export function toRpc(
    envelope: Omit<TransactionEnvelopeEip2930, 'type'>,
  ): TransactionEnvelopeEip2930.Rpc {
    const signature = Signature_extract(envelope)!

    return {
      ...envelope,
      chainId: Hex.fromNumber(envelope.chainId),
      data: envelope.data ?? envelope.input,
      ...(typeof envelope.gas === 'bigint'
        ? { gas: Hex.fromNumber(envelope.gas) }
        : {}),
      ...(typeof envelope.nonce === 'bigint'
        ? { nonce: Hex.fromNumber(envelope.nonce) }
        : {}),
      ...(typeof envelope.value === 'bigint'
        ? { value: Hex.fromNumber(envelope.value) }
        : {}),
      ...(typeof envelope.gasPrice === 'bigint'
        ? { gasPrice: Hex.fromNumber(envelope.gasPrice) }
        : {}),
      type: '0x1',
      ...(signature ? Signature_toRpc(signature) : {}),
    } as never
  }

  export declare namespace toRpc {
    export type ErrorType = Signature_extract.ErrorType | Errors.GlobalErrorType
  }

  toRpc.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as toRpc.ErrorType

  /**
   * Validates a {@link ox#(TransactionEnvelopeEip2930:type)}. Returns `true` if the envelope is valid, `false` otherwise.
   *
   * @example
   * ```ts twoslash
   * import { TransactionEnvelopeEip2930, Value } from 'ox'
   *
   * const valid = TransactionEnvelopeEip2930.assert({
   *   gasPrice: 2n ** 256n - 1n + 1n,
   *   chainId: 1,
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: Value.fromEther('1'),
   * })
   * // @log: false
   * ```
   *
   * @param envelope - The transaction envelope to validate.
   */
  export function validate(
    envelope: PartialBy<TransactionEnvelopeEip2930, 'type'>,
  ) {
    try {
      TransactionEnvelopeEip2930.assert(envelope)
      return true
    } catch {
      return false
    }
  }

  export declare namespace validate {
    type ErrorType = Errors.GlobalErrorType
  }

  validate.parseError = (error: unknown) =>
    /* v8 ignore next */
    error as validate.ErrorType

  // #endregion
}
