import { Expression, Node, Kind, Visitor } from './Expression'

export class Variable extends Expression {
  readonly $kind = Kind.Variable
  readonly name: string

  constructor(name: string){
    super()
    this.name = name
  }

  toString(): string {
    return this.name;
  }

  equals(that: Node): boolean {
    const asVariable = that as Variable
    return super.equals(that)
      && this.name === asVariable.name
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitVariable(this)
  }
}

export function variable(name: string) {
  return new Variable(name)
}
