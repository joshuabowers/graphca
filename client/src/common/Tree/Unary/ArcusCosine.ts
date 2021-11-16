import { Unary, unary, Kind, Visitor  } from "./Unary";

export class ArcusCosine extends Unary {
  static readonly function: string = 'acos'

  readonly $kind = Kind.ArcusCosine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitArcusCosine(this)
  }

  get function(): string { return ArcusCosine.function }
}

export const acos = unary(ArcusCosine)
