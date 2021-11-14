import { Binary, binary } from './Binary'

const operators = ['+']

export class Addition extends Binary {
  readonly $type = 'Addition'

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const add = binary(Addition)
