import { versionedHashVersionKzg } from '../constants/kzg.js'
import type { Hex } from '../types/data.js'

import { BaseError } from './base.js'

export class EmptyBlobVersionedHashesError extends BaseError {
  override readonly name = 'EmptyBlobVersionedHashesError'
  constructor() {
    super('Blob versioned hashes must not be empty.')
  }
}

export class InvalidVersionedHashSizeError extends BaseError {
  override readonly name = 'InvalidVersionedHashSizeError'
  constructor({
    hash,
    size,
  }: {
    hash: Hex
    size: number
  }) {
    super(`Versioned hash "${hash}" size is invalid.`, {
      metaMessages: ['Expected: 32', `Received: ${size}`],
    })
  }
}

export class InvalidVersionedHashVersionError extends BaseError {
  override readonly name = 'InvalidVersionedHashVersionError'
  constructor({
    hash,
    version,
  }: {
    hash: Hex
    version: number
  }) {
    super(`Versioned hash "${hash}" version is invalid.`, {
      metaMessages: [
        `Expected: ${versionedHashVersionKzg}`,
        `Received: ${version}`,
      ],
    })
  }
}
