import { Unary, unary, Kind, Visitor } from "./Unary";

export class HyperbolicSine extends Unary {
  static readonly function: string = 'sinh'

  readonly $kind = Kind.HyperbolicSine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitHyperbolicSine(this)
  }

  get function(): string { return HyperbolicSine.function }
}

export const sinh = unary(HyperbolicSine)
