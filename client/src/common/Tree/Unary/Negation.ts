import { Unicode } from '../../MathSymbols'
import { Unary, unary, Kind, Visitor } from './Unary'

const functionName = Unicode.minus

export class Negation extends Unary {
  readonly $kind = Kind.Negation

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitNegation(this)
  }

  get function(): string { return functionName }
}

export const negate = unary(Negation)
