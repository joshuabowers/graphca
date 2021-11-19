import { Unary, unary, Kind, Visitor  } from "./Unary";

export class ArcusCotangent extends Unary {
  static readonly function: string = 'acot'

  readonly $kind = Kind.ArcusCotangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitArcusCotangent(this)
  }

  get function(): string { return ArcusCotangent.function }
}

export const acot = unary(ArcusCotangent)
