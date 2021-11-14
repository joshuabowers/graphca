import { Binary, binary, Kind } from './Binary'

const operators = ['+']

export class Addition extends Binary {
  readonly $kind = Kind.Addition

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const add = binary(Addition)
