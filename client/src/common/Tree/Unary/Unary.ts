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

// While a neat instance of meta-programming, this unfortunately does not
// play too well with ts-pattern. Notably, matches on $kind are not as
// definitive as they could otherwise be.
export function classize(kind: Kind, functionName: string, accept: <T, V>() => (visitor: Visitor<V>) => (node: T) => V) {
  return class Subclass extends Unary {
    static function: string = functionName

    readonly $kind = kind

    accept<Value>(visitor: Visitor<Value>): Value {
      return accept<Subclass, Value>()(visitor)(this)
    }

    get function(): string { return Subclass.function }
  }
}
