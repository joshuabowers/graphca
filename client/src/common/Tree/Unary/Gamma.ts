import { Unicode } from "../../MathSymbols";
import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Gamma extends Unary {
  static readonly function: string = Unicode.gamma

  readonly $kind = Kind.Gamma

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitGamma(this)
  }

  get function(): string { return Gamma.function }
}

export const gamma = unary(Gamma)
