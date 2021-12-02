import { Base } from './Expression'

// export class Invocation extends Expression {
//   readonly $kind = Kind.Invocation
//   readonly expression: Expression
//   readonly args: Expression[]

//   constructor(expression: Expression, ...args: Expression[]) {
//     super()
//     this.expression = expression
//     this.args = args
//   }

//   toString(): string {
//     return `[${this.expression}](${this.args.join(',')})`
//   }

//   accept<Value>(visitor: Visitor<Value>): Value {
//     return visitor.visitInvocation(this)
//   }
// }

// export function invoke(expression: Expression, ...args: Expression[]) {
//   return new Invocation(expression, ...args)
// }

export function invoke(expression: Base, ...args: Base[]) {
  return expression
}

// visitAssignment(node: Assignment): Tree {
//   if(!this.scope){ throw new Error(`No scope provided for assignment context`); }
//   const evaluated = node.b.accept(this)
//   this.scope.set(node.a.name, evaluated)
//   return evaluated  
// }

// visitInvocation(node: Invocation): Tree {
//   if(!this.scope){ throw new Error('No scope provided for invocation context'); }
//   const previousScope = new Map(this.scope)
//   const notInvoked = node.expression.accept(this)
//   try {
//     const parameters = notInvoked.accept(new Parameterization(this.scope))
//     let index = 0
//     for(const parameter of parameters){
//       const argument = node.args[index]?.accept(this)
//       if(argument){
//         this.scope.set(parameter, argument)
//       }
//       index++
//     }
//     return notInvoked.accept(this)
//   } finally {
//     this.scope.clear()
//     for(const [key, value] of previousScope){
//       this.scope.set(key, value)
//     }
//   }
// }