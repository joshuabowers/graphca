import { Unicode } from '../../MathSymbols'
import { Binary, binary, Kind, Visitor } from './Binary'

const operators = [Unicode.multiplication, '*']

export class Multiplication extends Binary {
  readonly $kind = Kind.Multiplication

  static get operators(): string[] {
    return operators
  }
  
  get operators(): string[] {
    return operators
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitMultiplication(this)
  }
}

export const multiply = binary(Multiplication)
