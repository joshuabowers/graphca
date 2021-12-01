import { Unicode } from '../MathSymbols';
import { 
  Tree, Expression,
  real, variable, assign, invoke,
  add, subtract, multiply, divide, raise, square, sqrt,
  negate, abs,
  ln,
  sin, cos, tan, sec, csc, cot,
  sinh, cosh, tanh, sech, csch, coth,
  factorial, gamma, polygamma
} from '../Tree'
import { Scope, scope } from './Visitor'
import { treeParser } from '../treeParser';
import { Differentiation } from "./Differentiation";

const expectObject = (input: string, expected: Expression, scope?: Scope) => {
  const parsed = treeParser.value(input)
  let output: Tree | undefined
  expect(() => output = parsed.accept(new Differentiation(scope))).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe(Differentiation, () => {
  describe('of constants', () => {
    it('returns 0 for any constant', () => {
      expectObject('5', real('0'))
      expectObject(Unicode.infinity, real('0'))
    })
  })

  describe('of variables', () => {
    it('returns 1 if the variable is undefined', () => {
      expectObject('x', real('1'))
    })

    it('returns the derivative of variable if it is defined', () => {
      expectObject('x', real('0'), scope([['x', real(5)]]))
    })
  })

  describe('of assignments', () => {
    it('returns an assignment of the derivative of the value', () => {
      expectObject('y <- x', assign(variable('y'), real(1)))
    })
  })

  describe('of invocations', () => {
    it('returns the invocation of the derivative of the expression', () => {
      expectObject('(2 * x)(5)', invoke(
        add(
          multiply(real(0), variable('x')),
          multiply(real(2), real(1))
        ),
        real(5)
      ))
    })
  })

  describe('of additions', () => {
    it('returns the sum of the derivatives of the parts', () => {
      expectObject('x + 5', add(real('1'), real('0')))
    })
  })

  describe('of subtractions', () => {
    it('returns the difference of the derivatives of the parts', () => {
      expectObject('x - 5', subtract(real('1'), real('0')))
    })
  })

  describe('of multiplications', () => {
    it('returns the product rule of the multiplicands', () => {
      expectObject('5 * x', add(
        multiply(real('0'), variable('x')), 
        multiply(real('5'), real('1'))
      ))
    })
  })

  describe('of divisions', () => {
    it('returns the quotient rule of the parts', () => {
      expectObject('5 / x', divide(
        subtract(
          multiply(real('0'), variable('x')),
          multiply(real('1'), real('5'))
        ),
        raise(variable('x'), real('2'))
      ))
    })
  })

  describe('of powers and exponentials', () => {
    it('returns the generalized power rule of the parts for powers', () => {
      expectObject('x ^ 2', multiply(
        raise(variable('x'), real('2')),
        add(
          multiply(
            real('1'),
            divide(real('2'), variable('x'))
          ),
          multiply(
            real('0'),
            ln(variable('x'))
          )
        )
      ))
    })

    it('returns the generalized power rule of the parts for exponentials', () => {
      expectObject('2 ^ x', multiply(
        raise(real('2'), variable('x')),
        add(
          multiply(
            real('0'),
            divide(variable('x'), real('2'))
          ),
          multiply(
            real('1'),
            ln(real('2'))
          )
        )
      ))
    })
  })

  describe('of negations', () => {
    it('returns the negation of derivative of the expression', () => {
      expectObject('-x', negate(real('1')))
    })
  })

  describe('of cosines', () => {
    it('returns the chain rule of the derivative of cosine of an expression', () => {
      expectObject('cos(x)', multiply(
        negate(sin(variable('x'))),
        real('1')
      ))
    })
  })

  describe('of sines', () => {
    it('returns the chain rule of the derivative of sine of an expression', () => {
      expectObject('sin(x)', multiply(
        cos(variable('x')),
        real('1')
      ))
    })
  })

  // add(
  //   real('1'), 
  //   raise(
  //     tan(variable('x')), 
  //     real('2')
  //   )
  // ),


  describe('of tangents', () => {
    it('returns the chain rule of the derivative of tangent of an expression', () => {
      expectObject('tan(x)', multiply(
        raise(
          sec(variable('x')),
          real('2')
        ),
        real('1')
      ))
    })
  })

  describe('of secants', () => {
    it('returns the chain rule of the derivative of the secant', () => {
      expectObject('sec(x)', multiply(
        multiply(sec(variable('x')), tan(variable('x'))),
        real(1)
      ))
    })
  })

  describe('of cosecants', () => {
    it('returns the chain rule of the derivative of the cosecant', () => {
      expectObject('csc(x)', multiply(
        multiply(negate(csc(variable('x'))), cot(variable('x'))),
        real(1)
      ))
    })
  })

  describe('of cotangents', () => {
    it('returns the chain rule of the derivative of the cotangent', () => {
      expectObject('cot(x)', multiply(
        negate(raise(
          csc(variable('x')),
          real(2)
        )),
        real(1)
      ))
    })
  })

  describe('of arccosines', () => {
    it('returns the chain rule of the derivative of the arccos', () => {
      expectObject('acos(x)', negate(
        divide(
          real('1'),
          raise(
            subtract(
              real('1'),
              raise(variable('x'), real('2'))
            ),
            real('0.5')
          )
        )
      ))
    })
  })

  describe('of arcsines', () => {
    it('returns the chain rule of the derivative of the arcsin', () => {
      expectObject('asin(x)', divide(
        real('1'),
        raise(
          subtract(
            real('1'), 
            raise(variable('x'), real('2'))),
          real('0.5')
        )
      ))
    })
  })

  describe('of arctangents', () => {
    it('returns the chain rule of the derivative of the arctan', () => {
      expectObject('atan(x)', divide(
        real('1'),
        add(
          real('1'),
          raise(variable('x'), real('2'))
        )
      ))
    })
  })

  describe('of arcus secants', () => {
    it('returns the chain rule of the derivative of the asec', () => {
      expectObject('asec(x)', divide(
        real(1),
        multiply(
          abs(variable('x')),
          raise(
            subtract(
              raise(variable('x'), real(2)),
              real(1)
            ),
            real(0.5)
          )
        )
      ))
    })
  })

  describe('of arcus cosecants', () => {
    it('returns the chain rule of the derivative of the acsc', () => {
      expectObject('acsc(x)', negate(
        divide(
          real(1),
          multiply(
            abs(variable('x')),
            raise(
              subtract(
                raise(variable('x'), real(2)),
                real(1)
              ),
              real(0.5)
            )
          )
        )
      ))
    })
  })

  describe('of arcus cotangent', () => {
    it('returns the chain rule of the derivative of the acot', () => {
      expectObject('acot(x)', negate(
        divide(
          real(1),
          add(
            raise(variable('x'), real(2)),
            real(1)
          )
        )
      ))
    })
  })

  describe('of hyperbolic cosines', () => {
    it('returns the chain rule of the derivative of the cosh', () => {
      expectObject('cosh(x)', multiply(
        sinh(variable('x')),
        real('1')
      ))
    })
  })

  describe('of hyperbolic sines', () => {
    it('returns the chain rule of the derivative of the sinh', () => {
      expectObject('sinh(x)', multiply(
        cosh(variable('x')),
        real('1')
      ))
    })
  })

  describe('of hyperbolic tangents', () => {
    it('returns the chain rule of the derivative of the tanh', () => {
      expectObject('tanh(x)', multiply(
        square(sech(variable('x'))),
        real('1')
      ))
    })
  })

  describe('of hyperbolic secants', () => {
    it('returns the chain rule of the derivative of the sech', () => {
      expectObject('sech(x)', multiply(
        multiply(
          negate(tanh(variable('x'))),
          sech(variable('x'))
        ),
        real(1)
      ))
    })
  })

  describe('of hyperbolic cosecants', () => {
    it('returns the chain rule of the derivative of the csch', () => {
      expectObject('csch(x)', multiply(
        multiply(
          negate(coth(variable('x'))),
          csch(variable('x'))
        ),
        real(1)
      ))
    })
  })

  describe('of hyperbolic cotangents', () => {
    it('returns the chain rule of the derivative of the coth', () => {
      expectObject('coth(x)', multiply(
        negate(square(csch(variable('x')))),
        real(1)
      ))
    })
  })

  describe('of area hyperbolic cosines', () => {
    it('returns the chain rule of the derivative of the acosh', () => {
      expectObject('acosh(x)', divide(
        real('1'),
        raise(
          subtract(
            raise(variable('x'), real('2')),
            real('1')
          ),
          real('0.5')
        )
      ))
    })
  })

  describe('of area hyperbolic sines', () => {
    it('returns the chain rule of the derivative of the asinh', () => {
      expectObject('asinh(x)', divide(
        real('1'),
        raise(
          add(
            real('1'),
            raise(variable('x'), real('2'))
          ),
          real('0.5')
        )
      ))
    })
  })

  describe('of area hyperbolic tangents', () => {
    it('returns the chain rule of the derivative of the atanh', () => {
      expectObject('atanh(x)', divide(
        real('1'),
        subtract(
          real('1'),
          raise(variable('x'), real('2'))
        )
      ))
    })
  })

  describe('of area hyperbolic secants', () => {
    it('returns the chain rule of the derivative of the asech', () => {
      expectObject('asech(x)', negate(
        divide(
          real(1),
          multiply(
            variable('x'),
            sqrt(
              subtract(real(1), square(variable('x')))
            )
          )
        )
      ))
    })
  })

  describe('of area hyperbolic cosecants', () => {
    it('returns the chain rule of the derivative of the acsch', () => {
      expectObject('acsch(x)', negate(
        divide(
          real(1),
          multiply(
            abs(variable('x')),
            sqrt(
              add(real(1), square(variable('x')))
            )
          )
        )
      ))
    })
  })

  describe('of area hyperbolic cotangents', () => {
    it('returns the chain rule of the derivative of the acoth', () => {
      expectObject('acoth(x)', divide(
        real(1),
        subtract(real(1), square(variable('x')))
      ))
    })
  })

  describe('of binary logarithms', () => {
    it('returns the chain rule of the derivative of the lb', () => {
      expectObject('lb(x)', divide(
        real('1'),
        multiply(
          variable('x'),
          ln(real('2'))
        )
      ))
    })
  })

  describe('of natural logarithms', () => {
    it('returns the chain rule of the derivative of the ln', () => {
      expectObject('ln(x)', divide(
        real('1'),
        variable('x')
      ))
    })
  })

  describe('of common logarithms', () => {
    it('returns the chain rule of the derivative of the lg', () => {
      expectObject('lg(x)', divide(
        real('1'),
        multiply(
          variable('x'),
          ln(real('10'))
        )
      ))
    })
  })

  describe('of factorials', () => {
    it('returns the chain rule of the derivative of the factorial', () => {
      expectObject('x!', multiply(
        multiply(factorial(variable('x')), polygamma(real(0), add(variable('x'), real(1)))),
        real(1)
      ))
    })
  })

  describe('of gamma', () => {
    it('returns the chain rule of the derivative of gamma', () => {
      expectObject(`${Unicode.gamma}(x)`, multiply(
        multiply(gamma(variable('x')), polygamma(real(0), variable('x'))),
        real(1)
      ))
    })
  })

  describe('of polygamma', () => {
    it('returns the chain rule of the derivative of the polygamma', () => {
      expectObject(`${Unicode.digamma}(n, x)`, multiply(
        polygamma(add(variable('n'), real(1)), variable('x')),
        real(1)
      ))
    })
  })

  describe('of absolute values', () => {
    it('returns the chain rule of the derivative of the absolute', () => {
      expectObject('abs(x)', divide(
        multiply(variable('x'), real(1)),
        abs(variable('x'))
      ))
    })
  })

  describe('of derivatives', () => {
    it('returns the second derivative of the nested expression', () => {
      expectObject(
        `${Unicode.derivative}(cos(x))`, 
        add(
          multiply(
            negate(multiply(cos(variable('x')), real(1))),
            real(1)
          ),
          multiply(
            negate(sin(variable('x'))),
            real(0)
          )
        )
      )
    })
  })
})