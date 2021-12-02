import { Unicode } from '../MathSymbols';
// import { 
//   Expression,
//   Tree, Real, Complex,
//   real, complex, variable, assign, invoke,
//   add, subtract, multiply, divide, raise,
//   polygamma,
//   differentiate
// } from '../Tree'
// import { treeParser } from "../treeParser";
// import { Evaluation } from './Evaluation';
// import { Scope, scope } from './Visitor';

describe('foo', () => {
  it.todo('does nothing')
})

// const evaluate = (input: string, scope: Scope | undefined) => {
//   const evaluation = new Evaluation(scope)
//   return treeParser.value(input).accept(evaluation)
// }

// const expectReal = (actual: Real, expected: Real, precision: number) => {
//   if(expected === Real.NaN) {
//     expect(actual).toEqual(expected)
//   } else {
//     expect(actual.value).toBeCloseTo(expected.value, precision)
//   }
// }

// const expectComplex = (actual: Complex, expected: Complex, precision: number) => {
//   if(expected === Complex.NaN) {
//     expect(actual).toEqual(expected)
//   } else {
//     expect(actual.a).toBeCloseTo(expected.a, precision)
//     expect(actual.b).toBeCloseTo(expected.b, precision)  
//   }
// }

// const expectObject = (input: string, expected: Tree | undefined, precision: number = 15) => {
//   let output: Tree | undefined = undefined
//   const apply = () => expect(() => {output = evaluate(input, undefined)})
//   if( expected === undefined ) {
//     apply().toThrow()
//   } else {
//     apply().not.toThrow()
//     expect(output).not.toBeUndefined()
//     if( expected instanceof Real ){
//       expectReal(output as unknown as Real, expected, precision)
//     } else if( expected instanceof Complex ){
//       expectComplex(output as unknown as Complex, expected, precision)
//     } else {
//       expect(output).toMatchObject(expected)
//     }  
//   }
// }

// describe(Evaluation, () => {
//   describe('without variables', () => {
//     it('approximates e', () => {
//       expectObject(Unicode.e, Real.E)
//     })

//     it('represents i as a complex', () => {
//       expectObject(Unicode.i, complex(0, 1))
//     })

//     it('handles a zero imaginary as a complex', () => {
//       expectObject(`0${Unicode.i}`, complex(0, 0))
//     })

//     it('approximates pi', () => {
//       expectObject(Unicode.pi, Real.PI)
//     })

//     it('contemplates infinity', () => {
//       expectObject(Unicode.infinity, Real.Infinity)
//     })

//     it('evaluates binary expressions', () => {
//       expectObject('1 + 2', real(3))
//       expectObject('1 - 2', real(-1))
//       expectObject('2 * 3', real(6))
//       expectObject('6 / 2', real(3))
//     })

//     it('computes negative infinity', () => {
//       expectObject('(-5) / 0', real(-Infinity))
//     })

//     it('evaluates arithmetic with operator precedence', () => {
//       expectObject('1 - 2 * 3', real(-5))
//       expectObject('2 * 4 + 3 * 5', real(23))
//     })

//     it('evaluates arithmetic with left associativity', () => {
//       expectObject('1 - 2 - 3', real(-4))
//       expectObject('1 - 2 + 3', real(2))
//       expectObject('3 * 4 / 2', real(6))
//       expectObject('1024 / 32 / 8', real(4))
//       expectObject('1 / 2 * 3', real(1.5))
//     })

//     it('evaluates exponents with right associativity', () => {
//       expectObject('2 ^ 5', real(32))
//       expectObject('2 ^ 3 ^ 2', real(512))
//       expectObject('2 ^ 2 ^ 3', real(256))
//     })

//     it('converts a negative real to a complex when it is raised', () => {
//       expectObject('(-1)^2', complex(1))
//       expectObject('(-1)^0.5', complex(0, 1))
//       expectObject('(-25)^0.5', complex(0, 5))
//     })

//     it('evaluates negations', () => {
//       expectObject('-10', real(-10))
//       expectObject('-(2 * 3)', real(-6))
//       expectObject('-(-10)', real(10))
//     })

//     // TODO: revisit this once PI is implemented
//     it('evaluates trigonometric functions', () => {
//       expectObject('cos(0)', real(1))
//       expectObject('sin(0)', real(0))
//       expectObject('tan(0)', real(0))
//     })

//     it('evaluates arcus functions', () => {
//       expectObject('acos(0)', real(Math.PI / 2))
//       expectObject('asin(0)', real(0))
//       expectObject('atan(0)', real(0))
//     })

//     it('evaluates hyperbolic functions', () => {
//       expectObject('cosh(0)', real(1))
//       expectObject('sinh(0)', real(0))
//       expectObject('tanh(0)', real(0))
//     })

//     it('evaluates area hyperbolic functions', () => {
//       expectObject('acosh(0)', Real.NaN)
//       expectObject('asinh(0)', real(0))
//       expectObject('atanh(0)', real(0))
//     })

//     // TODO: revisit this once E is implemented
//     // TODO: Implement configuration precision?
//     it('evaluates logarithmic functions', () => {
//       expectObject('lg(1000)', real(3))
//       expectObject('lb(1024)', real(10))
//       expectObject('ln(10)', real(2.302585092994046))
//     })

//     it('evaluates factorials', () => {
//       expectObject('5!', real(120))
//     })

//     it('fails to evaluate a negative number factorial', () => {
//       expectObject('(-5)!', Real.NaN)
//     })

//     it('casts reals to complexes for mixed binary ops', () => {
//       expectObject(`2 + 3${Unicode.i}`, complex(2, 3))
//     })

//     it('computes the gamma function for integers', () => {
//       expectObject(`${Unicode.gamma}(5)`, real(24), 10)
//     })

//     it('computes the gamma function for reals', () => {
//       expectObject(`${Unicode.gamma}(5.5)`, real(52.34277778455362))
//     })

//     it('computes the gamma function for complexes', () => {
//       expectObject(`${Unicode.gamma}(1 - ${Unicode.i})`, complex(0.49801566811835646, 0.15494982830181053))
//     })

//     it.todo('computes the digamma function for reals')
//     it.todo('computes the digamma function for complexes')

//     it('computes the absolute value for reals', () => {
//       expectObject('abs(5)', real(5))
//       expectObject('abs(-5)', real(5))
//     })

//     it('computes the absolute value of infinity', () => {
//       expectObject(`abs(-${Unicode.infinity})`, Real.Infinity)
//     })

//     it('computes the absolute value of complexes', () => {
//       expectObject(`abs(2 + 3${Unicode.i})`, complex(3.6055512754639896))
//     })
//   })

//   describe('with variables without scope', () => {
//     it('returns the same node structure', () => {
//       expectObject('1 + x', add(real(1), variable('x')))
//     })

//     it('evaluates numeric sub-expressions', () => {
//       expectObject('(10 / 5) * x', multiply(real('2'), variable('x')))
//     })

//     it('throws an error if no scope given on assignment', () => {
//       expectObject('x <- 5', undefined)
//     })

//     it('evaluates expressions of functions', () => {
//       expectObject(`${Unicode.digamma}(x)`, polygamma(real(0), variable('x')))
//     })

//     it('computes derivatives', () => {
//       expectObject(`${Unicode.derivative}(x)`, real(1))
//     })

//     it('computes nested derivatives', () => {
//       expectObject(
//         `${Unicode.derivative}(${Unicode.derivative}(x + 2))`,
//         real(0)
//       )
//     })
//   })

//   describe('with variables and scope', () => {
//     it('assigns variables in the context object', () => {
//       const s = scope()
//       const output = evaluate('x <- 5', s)
//       expect(s.has('x'))
//       expect(s.get('x')).toMatchObject(real('5'))
//       expect(output).toMatchObject(real('5'))
//     })

//     it('evaluates the value of an expression before assigning', () => {
//       const s = scope()
//       const output = evaluate('x <- 2^3', s)
//       expect(s.get('x')).toMatchObject(real('8'))
//       expect(output).toMatchObject(real('8'))
//     })

//     it('returns the value of a variable as the value of the assignment', () => {
//       const s = scope()
//       const output = evaluate('x <- 5', s)
//       expect(s.get('x')).toMatchObject(output)
//       expect(output).not.toBeUndefined()
//     })

//     it('assigns expressions with valueless variables to variables', () => {
//       const s = scope()
//       evaluate('y <- x + 5', s)
//       expect(s.get('x')).toBeUndefined()
//       expect(s.get('y')).toMatchObject(add(
//         variable('x'), real(5)
//       ))
//     })

//     it('evaluates variables when assigning to variables', () => {
//       const s = scope()
//       evaluate('x <- 2^10', s)
//       evaluate('y <- x * 4', s)
//       expect(s.get('x')).toMatchObject(real('1024'))
//       expect(s.get('y')).toMatchObject(real('4096'))
//     })

//     it('returns the value of a variable when referenced', () => {
//       const s = scope()
//       evaluate('x <- 10', s)
//       const output = evaluate('x + 1', s)
//       expect(output).toMatchObject(real('11'))
//     })

//     it('returns an unevaluated variable if assigned to itself', () => {
//       const s = scope()
//       expect(() => evaluate('x <- x', s)).not.toThrow()
//       const output = evaluate('x(1)', s)
//       expect(output).toMatchObject(real('1'))
//     })

//     it('evaluates a variable in the current context when referenced', () => {
//       const s = scope()
//       evaluate('y <- x * 5', s)
//       evaluate('x <- 10', s)
//       expect(s.get('x')).toMatchObject(real('10'))
//       expect(s.get('y')).toMatchObject(multiply(variable('x'), real(5)))
//       const output = evaluate('y', s)
//       expect(output).toMatchObject(real('50'))
//     })

//     it('returns the argument if applied to an undefined variable', () => {
//       const s = scope()
//       const output = evaluate('x(2^3)', s)
//       expect(s.get('x')).toBeUndefined()
//       expect(output).toMatchObject(
//         real(8)
//       )
//     })

//     it('temporarily sets context when invoking a variable', () => {
//       const s = scope()
//       evaluate('y <- x * 5', s)
//       const output = evaluate('y(10)', s)
//       expect(s.get('x')).toBeUndefined()
//       expect(s.get('y')).toMatchObject(
//         multiply(variable('x'), real(5))
//       )
//       expect(output).toMatchObject(real('50'))
//     })

//     it('partially sets context if not enough arguments are supplied', () => {
//       const s = scope()
//       evaluate('f <- x * y', s)
//       const output = evaluate('f(10)', s)
//       expect(s.get('x')).toBeUndefined()
//       expect(s.get('y')).toBeUndefined()
//       expect(s.get('f')).toMatchObject(
//         multiply(variable('x'), variable('y'))
//       )
//       expect(output).toMatchObject(
//         multiply(real(10), variable('y'))
//       )
//     })

//     it('handles multiple arguments correctly', () => {
//       const s = scope()
//       evaluate('f <- x * y', s)
//       const output = evaluate('f(10, 5)', s)
//       expect(output).toMatchObject(real('50'))
//     })

//     it('ignores an excess of arguments', () => {
//       const s = scope()
//       evaluate('f <- x * y', s)
//       const output = evaluate('f(10, 5, 2)', s)
//       expect(output).toMatchObject(real('50'))
//     })

//     it('evaluates the arguments before evaluating the variable', () => {
//       const s = scope()
//       evaluate('f <- x * y', s)
//       const output = evaluate('f(2^3, 2^4)', s)
//       expect(output).toMatchObject(real('128'))
//     })

//     it('handles variables passed as argument', () => {
//       const s = scope()
//       evaluate('f <- lb(x)', s)
//       evaluate('y <- 2 ^ 10', s)
//       const output = evaluate('f(y)', s)
//       expect(output).toMatchObject(real('10'))
//     })

//     it('handles undefined variables as argument', () => {
//       const s = scope()
//       evaluate('f <- x + x', s)
//       expect(s.get('x')).toBeUndefined()
//       expect(s.get('f')).toMatchObject(
//         add(variable('x'), variable('x'))
//       )
//       const output = evaluate('f(x)', s)
//       expect(output).toMatchObject(
//         add(variable('x'), variable('x'))
//       )
//     })

//     it('replaces variables with functional composition', () => {
//       const s = scope()
//       evaluate('f <- x * 5', s)
//       expect(s.get('f')).toMatchObject(
//         multiply(variable('x'), real(5))
//       )

//       evaluate('g <- f(y)', s)
//       expect(s.get('x')).toBeUndefined()
//       expect(s.get('y')).toBeUndefined()
//       expect(s.get('g')).toMatchObject(
//         multiply(variable('y'), real(5))
//       )
//     })

//     it('handles functional composition', () => {
//       const s = scope()
//       evaluate('f <- 2 * x', s)
//       evaluate('g <- f(x) * 3', s)
//       evaluate('h <- g(x)', s)
//       expect(s.get('h')).toMatchObject(
//         multiply(
//           multiply(real(2), variable('x')),
//           real(3)
//         )
//       )
//       const output = evaluate('h(g(5))', s)
//       expect(output).toMatchObject(real('180'))
//     })

//     it('curries expression invocation', () => {
//       const s = scope()
//       expect(evaluate('(x + y + z)(1)(2)(3)', s)).toMatchObject(
//         real(6)
//       )
//       expect(evaluate('(x + y + z)(5)(10)', s)).toMatchObject(
//         add(real(15), variable('z'))
//       )
//     })

//     it('replaces variables with invoked expressions', () => {
//       const s = scope()
//       evaluate('f <- 2 * x', s)
//       evaluate('g <- y+z', s)
//       const output = evaluate('(f(g))(5)', s)
//       expect(output).toMatchObject(multiply(
//         real(2),
//         add(real(5), variable('z'))
//       ))
//     })
//   })
// })