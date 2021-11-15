import { Unary, unary, Kind, Visitor } from './Unary'

export class CommonLogarithm extends Unary {
  static readonly function: string = 'lg'

  readonly $kind = Kind.NaturalLogarithm

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitCommonLogarithm(this)
  }

  get function(): string { return CommonLogarithm.function }
}

export const lg = unary(CommonLogarithm)
