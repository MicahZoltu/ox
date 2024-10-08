import { AesGcm, Bytes, Hex } from 'ox'
import { expect, test } from 'vitest'

test('default', async () => {
  const key = await AesGcm.getKey({ password: 'qwerty' })
  const encrypted = await AesGcm.encrypt(
    Hex.fromString('i am a secret message'),
    key,
  )

  const decrypted = await AesGcm.decrypt(encrypted, key)
  expect(decrypted).toEqual(Hex.fromString('i am a secret message'))

  const key_invalid = await AesGcm.getKey({ password: 'qwerty1' })
  expect(() =>
    AesGcm.decrypt(encrypted, key_invalid),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    '[OperationError: The operation failed for an operation-specific reason]',
  )
})

test('args: as: Bytes', async () => {
  const key = await AesGcm.getKey({ password: 'qwerty' })
  const encrypted = await AesGcm.encrypt(
    Bytes.fromString('i am a secret message'),
    key,
  )

  const decrypted = await AesGcm.decrypt(encrypted, key, { as: 'Bytes' })
  expect(decrypted).toEqual(Bytes.fromString('i am a secret message'))

  const key_invalid = await AesGcm.getKey({ password: 'qwerty1' })
  expect(() =>
    AesGcm.decrypt(encrypted, key_invalid),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    '[OperationError: The operation failed for an operation-specific reason]',
  )
})
