import { Expression, Node, Kind } from '../Expression'
export type { Expression, Node }
export { Kind }

export abstract class Binary extends Expression {
  readonly a: Expression
  readonly b: Expression
  
  constructor(a: Expression, b: Expression){
    super()
    this.a = a
    this.b = b
  }

  toString(): string {
    return `${this.a}${this.operators[0]}${this.b}`
  }

  equals(that: Node): boolean {
    const asBinary = that as Binary
    return super.equals(that) 
      && this.a.equals(asBinary.a) 
      && this.b.equals(asBinary.b)
  }

  abstract get operators(): string[]
}

export function binary<T extends Binary>(type: (new(a: Expression, b: Expression) => T)){
  return function(a: Expression, b: Expression): T {
    return new type(a, b)
  }
}
