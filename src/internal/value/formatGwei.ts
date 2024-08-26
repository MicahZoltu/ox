import { valueExponents } from '../constants/value.js'
import type { GlobalErrorType } from '../errors/error.js'

import { Value_format } from './format.js'

/**
 * Formats a `bigint` Value (default: wei) to a string representation of Gwei.
 *
 * - Docs: https://oxlib.sh/api/value/formatGwei
 *
 * @example
 * ```ts
 * import { Value } from 'ox'
 *
 * Value.formatGwei(1_000_000_000n)
 * // '1'
 * ```
 */
export function Value_formatGwei(wei: bigint, unit: 'wei' = 'wei') {
  return Value_format(wei, valueExponents.gwei - valueExponents[unit])
}

export declare namespace Value_formatGwei {
  type ErrorType = Value_format.ErrorType | GlobalErrorType
}

/* v8 ignore next */
Value_formatGwei.parseError = (error: unknown) =>
  error as Value_formatGwei.ErrorType
