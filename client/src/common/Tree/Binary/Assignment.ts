import { Binary, binary, Kind, Visitor } from './Binary'
import { Variable } from '../Variable'

export class Assignment extends Binary<Variable> {
  static readonly operators = ['<-']

  readonly $kind = Kind.Assignment

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAssignment(this)
  }

  get operators(): string[] { return Assignment.operators }
}

export const assign = binary(Assignment)
