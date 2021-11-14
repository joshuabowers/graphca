import { Field, Node } from './Field'

export class Real extends Field {
  readonly $type = 'Real'
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
}

export function real(value: number) {
  return new Real(value)
}
