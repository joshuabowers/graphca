import { Unicode } from '../../MathSymbols'
import { Binary, binary } from './Binary'

const operators = [Unicode.multiplication, '*']

export class Multiplication extends Binary {
  readonly $type = 'Multiplication'

  static get operators(): string[] {
    return operators
  }
  
  get operators(): string[] {
    return operators
  }
}

export const multiply = binary(Multiplication)
