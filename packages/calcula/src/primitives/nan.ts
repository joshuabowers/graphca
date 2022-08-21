import { Writer, unit } from '../monads/writer'
import { $kind } from '../utility/ASTNode'
import { NaN } from "../closures/primitive"
export { NaN }

export const nan: Writer<NaN> = unit({
  [$kind]: 'NaN', value: NaN,
  isUnary: false,
  isBinary: false,
  isPrimitive: true
})
