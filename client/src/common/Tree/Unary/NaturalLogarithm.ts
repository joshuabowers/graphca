import { Unary, unary, Kind, Visitor } from './Unary'

const functionName = 'ln'

export class NaturalLogarithm extends Unary {
  readonly $kind = Kind.NaturalLogarithm

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitNaturalLogarithm(this)
  }

  get function(): string { return functionName }
}

export const ln = unary(NaturalLogarithm)
