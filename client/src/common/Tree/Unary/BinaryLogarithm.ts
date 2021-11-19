import { Unary, unary, Kind, Visitor } from './Unary'

export class BinaryLogarithm extends Unary {
  static readonly function: string = 'lb'

  readonly $kind = Kind.BinaryLogarithm

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitBinaryLogarithm(this)
  }

  get function(): string { return BinaryLogarithm.function }
}

export const lb = unary(BinaryLogarithm)
