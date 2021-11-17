import { Unary, unary, Kind, Visitor  } from "./Unary";

export class AreaHyperbolicCosecant extends Unary {
  static readonly function: string = 'acsch'

  readonly $kind = Kind.AreaHyperbolicCosecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAreaHyperbolicCosecant(this)
  }

  get function(): string { return AreaHyperbolicCosecant.function }
}

export const acsch = unary(AreaHyperbolicCosecant)
