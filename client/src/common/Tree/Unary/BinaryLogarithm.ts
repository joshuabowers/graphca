import { Unary, unary, Kind, Visitor } from './Unary'

const functionName = 'lb'

export class BinaryLogarithm extends Unary {
  readonly $kind = Kind.BinaryLogarithm

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitBinaryLogarithm(this)
  }

  get function(): string { return functionName }
}

export const lb = unary(BinaryLogarithm)
