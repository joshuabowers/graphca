import { Unicode } from '../../MathSymbols'
import { Binary, binary, Kind, Visitor } from './Binary'

const operators = [Unicode.minus, '-']

export class Subtraction extends Binary {
  readonly $kind = Kind.Subtraction

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitSubtraction(this)
  }
}

export const subtract = binary(Subtraction)
