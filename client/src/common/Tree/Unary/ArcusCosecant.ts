import { Unary, unary, Kind, Visitor  } from "./Unary";

export class ArcusCosecant extends Unary {
  static readonly function: string = 'acsc'

  readonly $kind = Kind.ArcusCosecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitArcusCosecant(this)
  }

  get function(): string { return ArcusCosecant.function }
}

export const acsc = unary(ArcusCosecant)
