import { Unary, unary, Kind, Visitor  } from "./Unary";

export class ArcusSecant extends Unary {
  static readonly function: string = 'asec'

  readonly $kind = Kind.ArcusSecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitArcusSecant(this)
  }

  get function(): string { return ArcusSecant.function }
}

export const asec = unary(ArcusSecant)
