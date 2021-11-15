import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Cosine extends Unary {
  static readonly function: string = 'cos'

  readonly $kind = Kind.Cosine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitCosine(this)
  }

  get function(): string { return Cosine.function }
}

export const cos = unary(Cosine)
