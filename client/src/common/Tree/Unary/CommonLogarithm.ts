import { Unary, unary, Kind, Visitor } from './Unary'

const functionName = 'lg'

export class CommonLogarithm extends Unary {
  readonly $kind = Kind.NaturalLogarithm

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitCommonLogarithm(this)
  }

  get function(): string { return functionName }
}

export const lg = unary(CommonLogarithm)
