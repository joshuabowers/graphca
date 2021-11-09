import React from 'react';
import { shallow, mount, render } from 'enzyme';

import { MathSymbols, Unicode } from '../../MathSymbols';
import { parser } from '../../parser';
import { componentVisitor } from '.';
import { Complex } from '../../fields/Complex';

const apply = (input: string): JSX.Element => parser.value(input, {visit: componentVisitor}) as unknown as JSX.Element
const expectMarkup = (input: string, className: string, expected?: string) => {
  const output = apply(input);
  expect(shallow(output).is(className)).toBe(true);
  expect(shallow(output).text()).toEqual(expected ?? input);
}

describe('componentVisitor', () => {
  describe('complex numbers', () => {
    it('renders the singleton imaginary', () => {
      expectMarkup(Unicode.i, '.complex')
    })

    it('renders multiplicative imaginaries', () => {
      expectMarkup(`3${Unicode.i}`, '.complex', new Complex(0, 3).toString())
    })
  })

  it('renders numbers', () => {
    expectMarkup('1024', '.number')
  })

  it('renders e', () => {
    expectMarkup(Unicode.e, '.number')
  })

  it('renders i', () => {
    expectMarkup(Unicode.i, '.complex')
  })

  it('renders pi', () => {
    expectMarkup(Unicode.pi, '.number')
  })

  it('renders explicit infinity', () => {
    expectMarkup(Unicode.infinity, '.number')
  })

  it('renders binary operator expressions', () => {
    expectMarkup('1 + 2', '.binaryOp')
    expectMarkup('2 - 3', '.binaryOp', `2 ${Unicode.minus} 3`)
    expectMarkup('3 * 4', '.binaryOp', `3 ${Unicode.multiplication} 4`)
    expectMarkup('4 / 5', '.binaryOp', `4 ${Unicode.division} 5`)
    expectMarkup(
      '1 + 2 - 3 * 4 / 5', 
      '.binaryOp', 
      `1 + 2 ${Unicode.minus} 3 ${Unicode.multiplication} 4 ${Unicode.division} 5`
    )
  })

  it('renders variables', () => {
    expectMarkup('x', '.variable')
  })

  it('renders negations', () => {
    expectMarkup('-x', '.negation', `${Unicode.minus}x`)
    expectMarkup('-1', '.negation', `${Unicode.minus}1`)
  })

  it('renders exponents', () => {
    expectMarkup('x^2', '.exponent')
  })

  it('renders trigonometric functions', () => {
    expectMarkup('cos(x)', '.functional.trigonometric')
    expectMarkup('sin(x)', '.functional.trigonometric')
    expectMarkup('tan(x)', '.functional.trigonometric')
  })

  it('renders arcus functions', () => {
    expectMarkup('acos(x)', '.functional.arcus')
    expectMarkup('asin(x)', '.functional.arcus')
    expectMarkup('atan(x)', '.functional.arcus')
  })

  it('renders hyperbolic functions', () => {
    expectMarkup('cosh(x)', '.functional.hyperbolic')
    expectMarkup('sinh(x)', '.functional.hyperbolic')
    expectMarkup('tanh(x)', '.functional.hyperbolic')
  })

  it('renders area hyperbolic functions', () => {
    expectMarkup('acosh(x)', '.functional.arHyperbolic')
    expectMarkup('asinh(x)', '.functional.arHyperbolic')
    expectMarkup('atanh(x)', '.functional.arHyperbolic')
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
    expectMarkup(`${Unicode.digamma}(x)`, '.functional.digamma')
  })

  it('renders absolute values', () => {
    expectMarkup('abs(x)', '.functional.absolute')
  })

  it('renders factorials', () => {
    expectMarkup('x!', '.factorial')
  })
})