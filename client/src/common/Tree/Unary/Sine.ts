import { Unary, unary, Kind, Visitor } from "./Unary";

export class Sine extends Unary {
  static readonly function: string = 'sin'

  readonly $kind = Kind.Sine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitSine(this)
  }

  get function(): string { return Sine.function }
}

// export const Sine = classize(Kind.Sine, 'sin', () => (visitor) => visitor.visitSine)

export const sin = unary(Sine)
