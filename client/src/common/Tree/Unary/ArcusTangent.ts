import { Unary, unary, Kind, Visitor  } from "./Unary";

export class ArcusTangent extends Unary {
  static readonly function: string = 'atan'

  readonly $kind = Kind.ArcusTangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitArcusTangent(this)
  }

  get function(): string { return ArcusTangent.function }
}

export const atan = unary(ArcusTangent)
