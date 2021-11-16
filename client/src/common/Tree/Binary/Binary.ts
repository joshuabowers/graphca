import { Expression, Node, Kind, Visitor } from '../Expression'
export type { Expression, Node, Visitor }
export { Kind }

export abstract class Binary<
  Left extends Expression = Expression, 
  Right extends Expression = Expression
> extends Expression {
  readonly a: Left
  readonly b: Right
  
  constructor(a: Left, b: Right){
    super()
    this.a = a
    this.b = b
  }

  toString(): string {
    return `${this.a}${this.operators[0]}${this.b}`
  }

  equals(that: Node): boolean {
    const asBinary = that as Binary<Left, Right>
    return super.equals(that) 
      && this.a.equals(asBinary.a) 
      && this.b.equals(asBinary.b)
  }

  abstract get operators(): string[]
}

export function binary<
  L extends Expression,
  R extends Expression,
  T extends Binary<L, R>
>(type: (new(a: L, b: R) => T)){
  return function(a: L, b: R): T {
    return new type(a, b)
  }
}
