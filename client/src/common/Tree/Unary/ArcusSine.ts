import { Unary, unary, Kind, Visitor  } from "./Unary";

export class ArcusSine extends Unary {
  static readonly function: string = 'asin'

  readonly $kind = Kind.ArcusSine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitArcusSine(this)
  }

  get function(): string { return ArcusSine.function }
}

export const asin = unary(ArcusSine)
