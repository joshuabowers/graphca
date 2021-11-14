import { Unicode } from '../../MathSymbols'
import { Binary, binary, Kind } from './Binary'

const operators = [Unicode.minus, '-']

export class Subtraction extends Binary {
  readonly $kind = Kind.Subtraction

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const subtract = binary(Subtraction)
