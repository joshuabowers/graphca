import { Unicode } from '../../MathSymbols'
import { complex } from '../../Tree'
import { treeParser } from '../../treeParser'
import { Componentization } from '.'
import { shallow } from 'enzyme'

const expectMarkup = (input: string, className: string, expected?: string) => {
  const parsed = treeParser.value(input);
  const output = parsed.accept(new Componentization())
  expect(shallow(output).is(className)).toBe(true);
  expect(shallow(output).text()).toEqual(expected ?? input);
}

describe(Componentization, () => {
  describe('complex numbers', () => {
    it('renders the singleton imaginary', () => {
      expectMarkup(Unicode.i, '.constant.complex')
    })

    it('renders multiplicative imaginaries', () => {
      expectMarkup(`3${Unicode.i}`, '.constant.complex', complex(0, 3).toString())
    })
  })

  it('renders numbers', () => {
    expectMarkup('1024', '.constant.real')
  })

  it('renders e', () => {
    expectMarkup(Unicode.e, '.constant.real')
  })

  it('renders i', () => {
    expectMarkup(Unicode.i, '.constant.complex')
  })

  it('renders pi', () => {
    expectMarkup(Unicode.pi, '.constant.real')
  })

  it('renders explicit infinity', () => {
    expectMarkup(Unicode.infinity, '.constant.real')
  })

  it('renders binary operator expressions', () => {
    expectMarkup('1 + 2', '.binary.addition')
    expectMarkup('2 - 3', '.binary.subtraction', `2 ${Unicode.minus} 3`)
    expectMarkup('3 * 4', '.binary.multiplication', `3 ${Unicode.multiplication} 4`)
    expectMarkup('4 / 5', '.binary.division', `4 ${Unicode.division} 5`)
    expectMarkup(
      '1 + 2 - 3 * 4 / 5', 
      '.binary', 
      `1 + 2 ${Unicode.minus} 3 ${Unicode.multiplication} 4 ${Unicode.division} 5`
    )
  })

  it('renders parentheses when needed to disambiguate', () => {
    expectMarkup('2 * (1 - 3)', '.binary', `2 ${Unicode.multiplication} (1 ${Unicode.minus} 3)`)
    expectMarkup('(1 + 3) / 2', '.binary', `(1 + 3) ${Unicode.division} 2`)
    expectMarkup('(2 * x) ^ 2', '.binary', `(2 ${Unicode.multiplication} x) ^ 2`)
  })

  it('renders variables', () => {
    expectMarkup('x', '.variable')
  })

  it('renders negations', () => {
    expectMarkup('-x', '.negation', `${Unicode.minus}x`)
    expectMarkup('-1', '.negation', `${Unicode.minus}1`)
  })

  it('renders exponents', () => {
    expectMarkup('x ^ 2', '.binary.exponentiation')
  })

  it('renders trigonometric functions', () => {
    expectMarkup('cos(x)', '.functional.trigonometric')
    expectMarkup('sin(x)', '.functional.trigonometric')
    expectMarkup('tan(x)', '.functional.trigonometric')
    expectMarkup('sec(x)', '.functional.trigonometric')
    expectMarkup('csc(x)', '.functional.trigonometric')
    expectMarkup('cot(x)', '.functional.trigonometric')
  })

  it('renders arcus functions', () => {
    expectMarkup('acos(x)', '.functional.arcus')
    expectMarkup('asin(x)', '.functional.arcus')
    expectMarkup('atan(x)', '.functional.arcus')
    expectMarkup('asec(x)', '.functional.arcus')
    expectMarkup('acsc(x)', '.functional.arcus')
    expectMarkup('acot(x)', '.functional.arcus')
  })

  it('renders hyperbolic functions', () => {
    expectMarkup('cosh(x)', '.functional.hyperbolic')
    expectMarkup('sinh(x)', '.functional.hyperbolic')
    expectMarkup('tanh(x)', '.functional.hyperbolic')
    expectMarkup('sech(x)', '.functional.hyperbolic')
    expectMarkup('csch(x)', '.functional.hyperbolic')
    expectMarkup('coth(x)', '.functional.hyperbolic')
  })

  it('renders area hyperbolic functions', () => {
    expectMarkup('acosh(x)', '.functional.areaHyperbolic')
    expectMarkup('asinh(x)', '.functional.areaHyperbolic')
    expectMarkup('atanh(x)', '.functional.areaHyperbolic')
    expectMarkup('asech(x)', '.functional.areaHyperbolic')
    expectMarkup('acsch(x)', '.functional.areaHyperbolic')
    expectMarkup('acoth(x)', '.functional.areaHyperbolic')
  })

  it('renders logarithmic functions', () => {
    expectMarkup('lb(x)', '.functional.logarithmic')
    expectMarkup('ln(x)', '.functional.logarithmic')
    expectMarkup('lg(x)', '.functional.logarithmic')
  })

  it('renders nested functions', () => {
    expectMarkup('cos(lg(x))', '.functional.trigonometric')
    expectMarkup('lg(cos(x))', '.functional.logarithmic')
  })

  it('renders gamma', () => {
    expectMarkup(`${Unicode.gamma}(x)`, '.functional.gamma')
  })

  it('renders digamma', () => {
    expectMarkup(
      `${Unicode.digamma}(x)`, '.functional.polygamma',
      `${Unicode.digamma}0(x)`
    )
  })

  it('renders absolute values', () => {
    expectMarkup('abs(x)', '.functional.absolute')
  })

  it('renders factorials', () => {
    expectMarkup('x!', '.factorial')
    expectMarkup('(x + 10)!', '.factorial')
  })
})