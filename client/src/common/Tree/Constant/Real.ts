import { Field, Node, Kind, Visitor } from './Field'

export class Real extends Field {
  readonly $kind = Kind.Real
  readonly value: number

  constructor(value: number){
    super()
    this.value = value
  }

  toString(): string {
    return this.value.toFixed(15)
  }

  equals(that: Node): boolean {
    return super.equals(that) && this.value === (that as Real).value
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitReal(this)
  }
}

export function real(value: number) {
  return new Real(value)
}
