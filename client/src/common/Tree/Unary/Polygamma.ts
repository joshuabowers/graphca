import { Unicode } from "../../MathSymbols";
import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Polygamma extends Unary {
  static readonly function: string = Unicode.digamma

  readonly $kind = Kind.Polygamma

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitPolygamma(this)
  }

  get function(): string { return Polygamma.function }
}

export const polygamma = unary(Polygamma)
