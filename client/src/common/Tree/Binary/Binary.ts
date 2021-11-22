import { Expression, Node, Kind, Visitor } from '../Expression'
export type { Expression, Node, Visitor }
export { Kind }

export abstract class Binary<
  Left extends Expression = Expression, 
  Right extends Expression = Expression
> extends Expression {
  
  constructor(readonly a: Left, readonly b: Right){
    super()
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

export function fixRight<
  L extends Expression,
  T extends Binary<L, Expression>
>(f: (a: L, b: Expression) => T, b: Expression): (a: L) => T {
  return function(a: L): T {
    return f(a, b)
  }
}
