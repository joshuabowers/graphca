import { Unary, unary, Kind, Visitor } from "./Unary";

export class AreaHyperbolicSine extends Unary {
  static readonly function: string = 'asinh'

  readonly $kind = Kind.AreaHyperbolicSine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAreaHyperbolicSine(this)
  }

  get function(): string { return AreaHyperbolicSine.function }
}

export const asinh = unary(AreaHyperbolicSine)
