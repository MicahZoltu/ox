import type {
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from 'abitype'

import type { Compute } from './utils.js'

// TODO: Make reusable for Viem?
export type TypedData_Definition<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
  ///
  primaryTypes = typedData extends TypedData ? keyof typedData : string,
> = primaryType extends 'EIP712Domain'
  ? TypedData_EIP712DomainDefinition<typedData, primaryType>
  : TypedData_MessageDefinition<typedData, primaryType, primaryTypes>

export type TypedData_EIP712DomainDefinition<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends 'EIP712Domain' = 'EIP712Domain',
  ///
  schema extends Record<string, unknown> = typedData extends TypedData
    ? TypedDataToPrimitiveTypes<typedData>
    : Record<string, unknown>,
> = {
  types?: typedData | undefined
} & {
  primaryType:
    | 'EIP712Domain'
    | (primaryType extends 'EIP712Domain' ? primaryType : never)
  domain: schema extends { EIP712Domain: infer domain }
    ? domain
    : Compute<TypedDataDomain>
  message?: undefined
}

export type TypedData_MessageDefinition<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData = keyof typedData,
  ///
  primaryTypes = typedData extends TypedData ? keyof typedData : string,
  schema extends Record<string, unknown> = typedData extends TypedData
    ? TypedDataToPrimitiveTypes<typedData>
    : Record<string, unknown>,
  message = schema[primaryType extends keyof schema
    ? primaryType
    : keyof schema],
> = {
  types: typedData
} & {
  primaryType:
    | primaryTypes // show all values
    | (primaryType extends primaryTypes ? primaryType : never) // infer value
  domain?:
    | (schema extends { EIP712Domain: infer domain }
        ? domain
        : Compute<TypedDataDomain>)
    | undefined
  message: { [_: string]: any } extends message // Check if message was inferred
    ? Record<string, unknown>
    : message
}
