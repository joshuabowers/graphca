import { Unicode } from './MathSymbols';
import {
  Base, Variable,
  add, subtract, multiply, divide, raise, double, square, sqrt,
  real, complex, bool, variable, 
  negate, abs,
  lb, ln, lg, log,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  factorial, gamma, polygamma, digamma, permute, combine,
  differentiate, nil, greaterThan, lessThan
} from './Tree'
import { parser, Scope, scope } from "./parser";
import { EulerMascheroni } from './Tree/real';

const expectObject = (input: string, expected: Base, scope?: Scope) => {
  let output = undefined
  expect(() => {output = parser.value(input, {context: scope})}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

const expectInScope = (scope: Scope, input: string, ...expected: Variable[]) => {
  expectObject(input, expected[0].value ?? real(0xdeadbeef), scope)
  for(let e of expected){
    if(e.value) {
      expect(scope.get(e.name)).toEqual(e)
    } else {
      expect(scope.get(e.name)).toBeUndefined()
    }
  }
}

describe('parser', () => {
  describe('of constants', () => {
    it('matches reals', () => {
      expectObject('1.2345', real(1.2345))
    })

    it(`matches ${Unicode.e}`, () => {
      expectObject(Unicode.e, real(Math.E))
    })

    it(`matches ${Unicode.pi}`, () => {
      expectObject(Unicode.pi, real(Math.PI))
    })

    it(`matches ${Unicode.infinity}`, () => {
      expectObject(Unicode.infinity, real(Infinity))
    })

    it(`matches ${Unicode.euler}`, () => {
      expectObject(Unicode.euler, EulerMascheroni)
    })

    it('matches complex numbers', () => {
      expectObject(`1.23 + 4.56${Unicode.i}`, complex(1.23, 4.56))
    })

    it('matches complex numbers with negative imaginary', () => {
      expectObject(`1.23 - 4.56${Unicode.i}`, complex(1.23, -4.56))
    })

    it('matches complex numbers with negative real', () => {
      expectObject(`-1.23 + 4.56${Unicode.i}`, complex(-1.23, 4.56))
    })

    it('matches negated imaginary numbers', () => {
      expectObject(`-2${Unicode.i}`, complex(0, -2))
    })

    it(`matches ${Unicode.e}${Unicode.i}`, () => {
      expectObject(`${Unicode.e}${Unicode.i}`, complex(0, Math.E))
    })

    it(`matches ${Unicode.pi}${Unicode.i}`, () => {
      expectObject(`${Unicode.pi}${Unicode.i}`, complex(0, Math.PI))
    })

    it('matches nil', () => {
      expectObject('nil', nil())
    })

    it('matches true', () => {
      expectObject('true', bool(true))
    })

    it('matches false', () => {
      expectObject('false', bool(false))
    })
  })

  describe('of variables', () => {
    it('matches identifiers', () => {
      expectObject('x', variable('x'))
    })

    it('matches lowercase strings', () => {
      expectObject('xyz', variable('xyz'))
    })

    it('matches uppercase strings', () => {
      expectObject('XYZ', variable('XYZ'))
    })

    it('matches mixed case strings', () => {
      expectObject('xYz', variable('xYz'))
    })

    it('matches intermixed digits', () => {
      expectObject('x0', variable('x0'))
    })

    it('does not match leading digits', () => {
      expect(() => parser.value('0y')).toThrow()
    })

    it('matches leading underscores', () => {
      expectObject('_x', variable('_x'))
    })

    it('matches intermixed underscores', () => {
      expectObject('x_', variable('x_'))
    })

    it('matches theta', () => {
      expectObject(Unicode.theta, variable(Unicode.theta))
    })

    it('matches leading theta', () => {
      expectObject(`${Unicode.theta}x`, variable(`${Unicode.theta}x`))
    })

    it('matches intermixed theta', () => {
      expectObject(`x${Unicode.theta}`, variable(`x${Unicode.theta}`))
    })

    it('does not match reserved words', () => {
      expect(() => parser.value('cos')).toThrow()
    })

    it('returns the value of the variable if present in scope', () => {
      const s = scope()
      s.set('x', variable('x', real(5)))
      expectInScope(s, 'x', variable('x', real(5)))
    })

    it('returns an unbound variable if set to nil', () => {
      const s = scope()
      s.set('x', variable('x', nil()))
      expectObject('x', variable('x'), s)
    })
  })

  describe('of additions', () => {
    it('matches a simple binary', () => {
      expectObject('1.23 + 4.56', add(real(1.23), real(4.56)))
    })

    it('matches nested additions left associatively', () => {
      expectObject('1.23 + 4.56 + 7.89', add(
        add(real(1.23), real(4.56)),
        real(7.89)
      ))
    })
  })

  describe('of subtractions', () => {
    it('matches a simple binary', () => {
      expectObject('1 - 2', subtract(real(1), real(2)))
    })

    it('matches nested subtractions left associatively', () => {
      expectObject('1 - 2 - 3', subtract(
        subtract(real(1), real(2)),
        real(3)
      ))
    })

    it('matches mixed addition and subtraction', () => {
      expectObject('1 + 2 - 3', subtract(
        add(real(1), real(2)),
        real(3)
      ))
    })

    it('matches an alternative symbol for subtraction', () => {
      expectObject(`1 ${Unicode.minus} 2`, subtract(real(1), real(2)))
    })
  })

  describe('of multiplications', () => {
    it('matches a simple binary', () => {
      expectObject('1 * 2', multiply(real(1), real(2)))
    })

    it('matches nested multiplications left associatively', () => {
      expectObject('1 * 2 * 3', multiply(
        multiply(real(1), real(2)),
        real(3)
      ))
    })

    it('has a higher precedence for multiplication over addition', () => {
      expectObject('2 * 3 + 4 * 5', add(
        multiply(real(2), real(3)),
        multiply(real(4), real(5))
      ))
    })

    it('matches an alternative symbol for multiplication', () => {
      expectObject(`2 ${Unicode.multiplication} 3`, multiply(real(2), real(3)))
    })
  })

  describe('of divisions', () => {
    it('matches a simple binary', () => {
      expectObject('1 / 2', divide(real(1), real(2)))
    })

    it('matches nested divisions left associatively', () => {
      expectObject('1 / 2 / 3', divide(
        divide(real(1), real(2)),
        real(3)
      ))
    })

    it('has a higher precedence for division over addition', () => {
      expectObject('1 / 2 + 3 / 4', add(
        divide(real(1), real(2)),
        divide(real(3), real(4))
      ))
    })

    it('has equal precedence to multiplication', () => {
      expectObject('1 / 2 * 3', multiply(
        divide(real(1), real(2)),
        real(3)
      ))
      expectObject('1 * 2 / 3', divide(
        multiply(real(1), real(2)),
        real(3)
      ))
    })

    it('matches an alternative symbol for division', () => {
      expectObject(`1 ${Unicode.division} 2`, divide(real(1), real(2)))
    })
  })

  describe('of exponentiations', () => {
    it('matches a simple binary', () => {
      expectObject('1 ^ 2', raise(real(1), real(2)))
    })

    it('matches nested exponentiations right recursively', () => {
      expectObject('1 ^ 2 ^ 3', raise(
        real(1),
        raise(real(2), real(3))
      ))
    })

    it('matches a square root shorthand', () => {
      expectObject(`${Unicode.squareRoot}(x)`, sqrt(variable('x')))
    })
  })

  describe('of grouping parentheses', () => {
    it('matches the inner expression', () => {
      expectObject('(1 + 2)', add(real(1), real(2)))
    })

    it('influences associativity', () => {
      expectObject('1 + (2 + 3)', add(
        real(1),
        add(real(2), real(3))
      ))
    })

    it('matches brackets', () => {
      expectObject('[1 + 2]', real(3))
    })

    it('matches braces', () => {
      expectObject('{1 + 2}', real(3))
    })

    it('matches nested different forms', () => {
      expectObject('2 * (27 ^ [4 / {6 * 2}])', real(6))
    })
  })

  describe('of negations', () => {
    it('matches a basic negation', () => {
      expectObject('-1', negate(real(1)))
    })

    it('matches nested negations', () => {
      expectObject('--1', negate(negate(real(1))))
    })

    it('matches negations of complex numbers', () => {
      expectObject(`-(-1 - ${Unicode.i})`, negate(complex(-1, -1)))
    })

    it('matches an alternative symbol for negations', () => {
      expectObject(`${Unicode.minus}1`, negate(real(1)))
    })
  })

  describe('of absolute values', () => {
    it('matches a basic absolute', () => {
      expectObject('abs(-x)', abs(negate(variable('x'))))
    })
  })

  describe('of logarithms', () => {
    it('matches the binary logarithm', () => {
      expectObject('lb(x)', lb(variable('x')))
    })

    it('matches the natural logarithm', () => {
      expectObject('ln(x)', ln(variable('x')))
    })

    it('matches the common logarithm', () => {
      expectObject('lg(x)', lg(variable('x')))
    })

    it('matches arbitrary logarithms', () => {
      expectObject('log(x, y)', log(variable('x'), variable('y')))
    })
  })

  describe('of trigonometric functions', () => {
    it('matches cosines', () => {
      expectObject('cos(x)', cos(variable('x')))
    })

    it('matches sines', () => {
      expectObject('sin(x)', sin(variable('x')))
    })

    it('matches tangents', () => {
      expectObject('tan(x)', tan(variable('x')))
    })

    it('matches secants', () => {
      expectObject('sec(x)', sec(variable('x')))
    })

    it('matches cosecants', () => {
      expectObject('csc(x)', csc(variable('x')))
    })

    it('matches cotangents', () => {
      expectObject('cot(x)', cot(variable('x')))
    })
  })

  describe('of arcus functions', () => {
    it('matches arcus cosines', () => {
      expectObject('acos(x)', acos(variable('x')))
    })

    it('matches arcus sines', () => {
      expectObject('asin(x)', asin(variable('x')))
    })

    it('matches arcus tangents', () => {
      expectObject('atan(x)', atan(variable('x')))
    })

    it('matches arcus secants', () => {
      expectObject('asec(x)', asec(variable('x')))
    })

    it('matches arcus cosecants', () => {
      expectObject('acsc(x)', acsc(variable('x')))
    })

    it('matches arcus cotangents', () => {
      expectObject('acot(x)', acot(variable('x')))
    })
  })

  describe('of hyperbolic functions', () => {
    it('matches hyperbolic cosines', () => {
      expectObject('cosh(x)', cosh(variable('x')))
    })

    it('matches hyperbolic sines', () => {
      expectObject('sinh(x)', sinh(variable('x')))
    })

    it('matches hyperbolic tangents', () => {
      expectObject('tanh(x)', tanh(variable('x')))
    })

    it('matches hyperbolic secants', () => {
      expectObject('sech(x)', sech(variable('x')))
    })

    it('matches hyperbolic cosecants', () => {
      expectObject('csch(x)', csch(variable('x')))
    })

    it('matches hyperbolic cotangents', () => {
      expectObject('coth(x)', coth(variable('x')))
    })
  })

  describe('of area hyperbolic functions', () => {
    it('matches area hyperbolic cosines', () => {
      expectObject('acosh(x)', acosh(variable('x')))
    })

    it('matches area hyperbolic sines', () => {
      expectObject('asinh(x)', asinh(variable('x')))
    })

    it('matches area hyperbolic tangents', () => {
      expectObject('atanh(x)', atanh(variable('x')))
    })

    it('matches area hyperbolic secants', () => {
      expectObject('asech(x)', asech(variable('x')))
    })

    it('matches area hyperbolic cosecants', () => {
      expectObject('acsch(x)', acsch(variable('x')))
    })

    it('matches area hyperbolic cotangents', () => {
      expectObject('acoth(x)', acoth(variable('x')))
    })
  })

  describe('of factorial-likes', () => {
    it('matches factorial functions', () => {
      expectObject('x!', factorial(variable('x')))
    })

    it('matches nested factorials', () => {
      expectObject('x!!', factorial(factorial(variable('x'))))
    })

    it('matches gamma', () => {
      expectObject(`${Unicode.gamma}(x)`, gamma(variable('x')))
    })

    it('matches digamma', () => {
      expectObject(`${Unicode.digamma}(x)`, digamma(variable('x')))
    })

    it('matches polygamma', () => {
      expectObject(`${Unicode.digamma}(1, x)`, polygamma(real(1), variable('x')))
    })

    it('matches polygamma with non-real order', () => {
      expectObject(`${Unicode.digamma}(n, x)`, polygamma(variable('n'), variable('x')))
    })
  })

  describe('of combinatorics', () => {
    it('matches permutations', () => {
      expectObject('P(n, r)', permute(variable('n'), variable('r')))
    })

    it('matches combinations', () => {
      expectObject('C(n, r)', combine(variable('n'), variable('r')))
    })
  })

  describe('of functions', () => {
    it('matches nested composition', () => {
      expectObject('cos(ln(tan(x)))', cos(ln(tan(variable('x')))))
    })
  })

  describe('of derivatives', () => {
    it('matches a basic derivative', () => {
      expectObject(`${Unicode.derivative}(x)`, differentiate(variable('x')))
    })

    it('matches nested derivatives', () => {
      expectObject(
        `${Unicode.derivative}(${Unicode.derivative}(x))`,
        differentiate(differentiate(variable('x')))
      )
    })

    it('matches a derivative order', () => {
      expectObject(`${Unicode.derivative}(2, x^2)`, differentiate(real(2), square(variable('x'))))
    })
  })

  describe('of assignments', () => {
    it('matches a basic assignment', () => {
      expectInScope(scope(), 'x := 2', variable('x', real(2)))
    })

    it('matches the assignment of a variable expression', () => {
      expectInScope(scope(), 'y := 2 * x^2', 
        variable('y', double(square(variable('x')))),
        variable('x')
      )
    })

    it('matches assignments right-associatively', () => {
      expectInScope(scope(), 'z := y := x', 
        variable('z', variable('x')),
        variable('y', variable('x')),
        variable('x')        
      )
    })

    it('matches assignments of nil by unsetting variable', () => {
      expectInScope(scope(), 'x := nil', variable('x', nil()))
    })

    it('assigns the value of the expression automatically to Ans', () => {
      expectInScope(scope(), '2 * 5', variable('Ans', real(10)))
    })
  })

  describe('of invocations', () => {
    it('matches a basic invocation', () => {
      expectObject('x(2)', real(2), scope())
    })

    it('allows multiple arguments to be passed', () => {
      expectObject('x(2, y, 4)', real(2), scope())
    })

    it('can invoke a parenthetical', () => {
      expectObject('(x^2 + x)(5)', real(30), scope())
    })

    it('can invoke a derivative', () => {
      expectObject(`${Unicode.derivative}(x^2)(5)`, real(10), scope())
    })

    it('can recursively invoke', () => {
      expectObject('(x + y * z)(1)(2)(3)', real(7), scope())
    })

    it('recursively associates correctly', () => {
      expectObject('(x*2)(y+3)(1)', real(8), scope())
    })
  })

  describe('of logical operations', () => {
    it('matches the logical complement of false', () => {
      expectObject(`${Unicode.not}false`, bool(true))
    })

    it('matches the logical complement of true', () => {
      expectObject(`${Unicode.not}true`, bool(false))
    })

    it('matches strict equalities', () => {
      expectObject('1 == 2', bool(false))
    })

    it('matches strict inequalities', () => {
      expectObject('1 != 2', bool(true))
    })

    it('matches less than inequalities', () => {
      expectObject('1 < 2', bool(true))
    })

    it('matches greater than inequalities', () => {
      expectObject('1 > 2', bool(false))
    })

    it('matches less than equals inequalities', () => {
      expectObject('1 <= 2', bool(true))
    })

    it('matches greater than equals inequalities', () => {
      expectObject('1 >= 2', bool(false))
    })

    it('matches inequalities with lower precedence than arithmetic', () => {
      expectObject('1 + 2 > x + 4', greaterThan(real(3), add(variable('x'), real(4))))
    })

    it('matches inequalities with higher precedence than assignments', () => {
      expectInScope(scope(), 'y := x < 10', variable('y', 
        lessThan(variable('x'), real(10))
      ))
    })

    it('matches inequalities with left associativity', () => {
      expectObject('1 < x < 5', lessThan(
        lessThan(real(1), variable('x')), real(5)
      ))
    })
  })
})
