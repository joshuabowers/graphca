import { Unary, unary, Kind, Visitor  } from "./Unary";

export class HyperbolicCosecant extends Unary {
  static readonly function: string = 'csch'

  readonly $kind = Kind.HyperbolicCosecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitHyperbolicCosecant(this)
  }

  get function(): string { return HyperbolicCosecant.function }
}

export const csch = unary(HyperbolicCosecant)
