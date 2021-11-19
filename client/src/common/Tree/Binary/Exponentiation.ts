import { Binary, binary, Kind, Visitor, fixRight } from './Binary'
import { real } from '../Constant/Real'

const operators = ['^']

export class Exponentiation extends Binary {
  readonly $kind = Kind.Exponentiation

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitExponentiation(this)
  }
}

export const raise = binary(Exponentiation)
export const square = fixRight(raise, real(2))
export const sqrt = fixRight(raise, real(0.5))
