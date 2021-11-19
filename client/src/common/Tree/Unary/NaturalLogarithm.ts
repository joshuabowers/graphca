import { Unary, unary, Kind, Visitor } from './Unary'

export class NaturalLogarithm extends Unary {
  static readonly function: string = 'ln'

  readonly $kind = Kind.NaturalLogarithm

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitNaturalLogarithm(this)
  }

  get function(): string { return NaturalLogarithm.function }
}

export const ln = unary(NaturalLogarithm)
