import { Expression, Kind, Visitor } from './Expression'

export class Invocation extends Expression {
  readonly $kind = Kind.Invocation
  readonly expression: Expression
  readonly args: Expression[]

  constructor(expression: Expression, ...args: Expression[]) {
    super()
    this.expression = expression
    this.args = args
  }

  toString(): string {
    return `[${this.expression}](${this.args.join(',')})`
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitInvocation(this)
  }
}

export function invoke(expression: Expression, ...args: Expression[]) {
  return new Invocation(expression, ...args)
}
