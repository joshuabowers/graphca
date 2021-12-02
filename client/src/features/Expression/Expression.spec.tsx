import { Unicode } from '../../common/MathSymbols'
import { Base } from '../../common/Tree/Expression'
import { real } from '../../common/Tree/real'
import { complex } from '../../common/Tree/complex'
import { variable } from '../../common/Tree/variable'
import { add, subtract } from '../../common/Tree/addition'
import { multiply, divide, negate } from '../../common/Tree/multiplication'
import { raise, reciprocal, square } from '../../common/Tree/exponentiation'
import { cos, sin, tan, sec, csc, cot } from '../../common/Tree/trigonometric'
import { acos, asin, atan, asec, acsc, acot } from '../../common/Tree/arcus'
import { cosh, sinh, tanh, sech, csch, coth } from '../../common/Tree/hyperbolic'
import { acosh, asinh, atanh, asech, acsch, acoth } from '../../common/Tree/areaHyperbolic'
import { log, lb, ln, lg } from '../../common/Tree/logarithmic'
import { gamma } from '../../common/Tree/gamma'
import { factorial } from '../../common/Tree/factorial'
import { abs } from '../../common/Tree/absolute'
import { Expression } from '.'
import { shallow } from 'enzyme'

const expectMarkup = (input: Base, className: string, expected: string) => {
  expect(() => <Expression node={input} />).not.toThrow()
  const actual = shallow(<Expression node={input} />)
  expect(actual.is(className)).toBe(true);
  expect(actual.text()).toEqual(expected);
}

describe(Expression, () => {
  describe('of complex numbers', () => {
    it('renders the singleton imaginary', () => {
      expectMarkup(complex(0, 1), '.constant.complex', Unicode.i)
    })

    it('renders multiplicative imaginary numbers', () => {
      expectMarkup(complex(0, 3), '.constant.complex', `3${Unicode.i}`)
    })

    it('renders symbolic values', () => {
      expectMarkup(
        complex(Math.E, Math.PI), '.constant.complex',
        `${Unicode.e} + ${Unicode.pi}${Unicode.i}`
      )
    })
  })

  describe('of real numbers', () => {
    it('renders numbers', () => {
      expectMarkup(real(1024), '.constant.real', '1024')
    })
  
    it('renders e', () => {
      expectMarkup(real(Math.E), '.constant.real', Unicode.e)
    })
  
    it('renders pi', () => {
      expectMarkup(real(Math.PI), '.constant.real', Unicode.pi)
    })
  
    it('renders explicit infinity', () => {
      expectMarkup(real(Infinity), '.constant.real', Unicode.infinity)
    })  
  })

  it('renders variables', () => {
    expectMarkup(variable('x'), '.variable', 'x')
  })

  describe('of additions', () => {
    it('renders positive children as an addition', () => {
      expectMarkup(add(variable('x'), real(1)), '.binary.addition', 'x+1')
    })

    it('renders a negative right child as a subtraction', () => {
      expectMarkup(subtract(variable('x'), real(1)), '.binary.subtraction', `x${Unicode.minus}1`)
    })

    it('renders a negative left child as a reordered subtraction', () => {
      expectMarkup(add(negate(variable('x')), real(1)), '.binary.subtraction', `1${Unicode.minus}x`)
    })

    it('maintains order of two negative children, but renders as subtraction', () => {
      expectMarkup(subtract(negate(variable('x')), real(1)), '.binary.negation', `${Unicode.minus}(x+1)`)
    })
  })

  describe('of multiplications', () => {
    it('renders two non-reciprocals as a multiplication', () => {
      expectMarkup(multiply(variable('x'), real(2)), '.binary.multiplication', `2${Unicode.multiplication}x`)
    })

    it('renders a right-child reciprocal as a division', () => {
      expectMarkup(divide(variable('x'), variable('y')), '.binary.division', `x${Unicode.division}y`)
    })

    it('renders a left-child reciprocal as a division', () => {
      expectMarkup(multiply(reciprocal(variable('x')), real(2)), '.binary.division', `2${Unicode.division}x`)
    })

    it('renders a product of reciprocals as a division', () => {
      expectMarkup(
        multiply(reciprocal(variable('x')), raise(variable('y'), real(-2))),
        '.binary.division',
        `1${Unicode.division}(x${Unicode.multiplication}y^2)`
      )
    })

    it('renders negations', () => {
      expectMarkup(negate(variable('x')), '.binary.negation', `${Unicode.minus}x`)
      expectMarkup(negate(real(1)), '.constant.real', `-1`)
    })

    it('renders negated reciprocals', () => {
      expectMarkup(divide(real(-1), variable('x')), '.binary.division', `-1${Unicode.division}x`)
    })
  })

  describe('of exponentiations', () => {
    it('renders exponents', () => {
      expectMarkup(square(variable('x')), '.binary.exponentiation', 'x^2')
    })  
  })

  describe('of logarithmic functions', () => {
    it('renders binary logarithms', () => {
      expectMarkup(lb(variable('x')), '.functional.logarithmic', 'lb(x)')
    })

    it('renders natural logarithms', () => {
      expectMarkup(ln(variable('x')), '.functional.logarithmic', 'ln(x)')
    })

    it('renders common logarithms', () => {
      expectMarkup(lg(variable('x')), '.functional.logarithmic', 'lg(x)')
    })  

    it('renders logarithms of an arbitrary base', () => {
      expectMarkup(
        log(variable('y'), variable('x')), 
        '.functional.logarithmic', 
        'logy(x)'
      )
    })
  })

  describe('of unary functions', () => {
    it('renders trigonometric functions', () => {
      expectMarkup(cos(variable('x')), '.functional.trigonometric', 'cos(x)')
      expectMarkup(sin(variable('x')), '.functional.trigonometric', 'sin(x)')
      expectMarkup(tan(variable('x')), '.functional.trigonometric', 'tan(x)')
      expectMarkup(sec(variable('x')), '.functional.trigonometric', 'sec(x)')
      expectMarkup(csc(variable('x')), '.functional.trigonometric', 'csc(x)')
      expectMarkup(cot(variable('x')), '.functional.trigonometric', 'cot(x)')
    })
  
    it('renders arcus functions', () => {
      expectMarkup(acos(variable('x')), '.functional.arcus', 'acos(x)')
      expectMarkup(asin(variable('x')), '.functional.arcus', 'asin(x)')
      expectMarkup(atan(variable('x')), '.functional.arcus', 'atan(x)')
      expectMarkup(asec(variable('x')), '.functional.arcus', 'asec(x)')
      expectMarkup(acsc(variable('x')), '.functional.arcus', 'acsc(x)')
      expectMarkup(acot(variable('x')), '.functional.arcus', 'acot(x)')
    })
  
    it('renders hyperbolic functions', () => {
      expectMarkup(cosh(variable('x')), '.functional.hyperbolic', 'cosh(x)')
      expectMarkup(sinh(variable('x')), '.functional.hyperbolic', 'sinh(x)')
      expectMarkup(tanh(variable('x')), '.functional.hyperbolic', 'tanh(x)')
      expectMarkup(sech(variable('x')), '.functional.hyperbolic', 'sech(x)')
      expectMarkup(csch(variable('x')), '.functional.hyperbolic', 'csch(x)')
      expectMarkup(coth(variable('x')), '.functional.hyperbolic', 'coth(x)')
    })
  
    it('renders area hyperbolic functions', () => {
      expectMarkup(acosh(variable('x')), '.functional.areaHyperbolic', 'acosh(x)')
      expectMarkup(asinh(variable('x')), '.functional.areaHyperbolic', 'asinh(x)')
      expectMarkup(atanh(variable('x')), '.functional.areaHyperbolic', 'atanh(x)')
      expectMarkup(asech(variable('x')), '.functional.areaHyperbolic', 'asech(x)')
      expectMarkup(acsch(variable('x')), '.functional.areaHyperbolic', 'acsch(x)')
      expectMarkup(acoth(variable('x')), '.functional.areaHyperbolic', 'acoth(x)')
    })

    it('renders factorials', () => {
      expectMarkup(factorial(variable('x')), '.factorial', 'x!')
      expectMarkup(factorial(add(variable('x'), real(10))), '.factorial', '(x+10)!')
    })  

    it('renders gamma', () => {
      expectMarkup(gamma(variable('x')), '.functional.unary', `${Unicode.gamma}(x)`)
    })
  
    it.todo('renders polygamma') //, () => {
    //   expectMarkup(
    //     `${Unicode.digamma}(x)`, '.functional.polygamma',
    //     `${Unicode.digamma}0(x)`
    //   )
    // })
  
    it('renders absolute values', () => {
      expectMarkup(abs(variable('x')), '.functional.unary', 'abs(x)')
    })  
  })

  describe('of mixed operations', () => {
    it('renders binary operator expressions', () => {
      expectMarkup(
        subtract(
          add(variable('x'), real(1)),
          divide(
            multiply(variable('y'), real(2)),
            variable('z')
          )
        ),
        '.binary', 
        `x+1${Unicode.minus}(2${Unicode.multiplication}y)${Unicode.division}z`
      )
    })
  
    it('renders parentheses when needed to disambiguate', () => {
      expectMarkup(
        multiply(variable('x'), subtract(variable('y'), real(1))), '.binary', 
        `x${Unicode.multiplication}(y${Unicode.minus}1)`
      )
      expectMarkup(
        divide(add(real(1), variable('x')), variable('y')), '.binary', 
        `(x+1)${Unicode.division}y`
      )
      expectMarkup(
        square(add(real(2), variable('x'))), '.binary', 
        `(x+2)^2`
      )
    })

    it('renders nested functions', () => {
      expectMarkup(cos(lg(variable('x'))), '.functional.trigonometric', 'cos(lg(x))')
      expectMarkup(lg(cos(variable('x'))), '.functional.logarithmic', 'lg(cos(x))')
    })  
  })
})
