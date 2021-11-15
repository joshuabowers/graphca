import { Expression, Node, Kind, Visitor } from '../Expression'
export type { Expression, Node, Visitor }
export { Kind }

export abstract class Unary extends Expression {
  readonly expression: Expression

  constructor(expression: Expression){
    super()
    this.expression = expression
  }

  toString(): string {
    return `${this.function}${this.expression}`
  }

  equals(that: Node): boolean {
    const asUnary = that as Unary
    return super.equals(that) 
      && this.function === asUnary.function
      && this.expression.equals(asUnary.expression)
  }

  abstract get function(): string
}

export function unary<T extends Unary>(type: (new(expression: Expression) => T)){
  return function(expression: Expression){
    return new type(expression)
  }
}
