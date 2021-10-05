import React from 'react';
import { shallow, mount, render } from 'enzyme';

import { MathSymbols, Unicode } from '../../MathSymbols';
import { parser } from '../../parser';
import { componentVisitor } from '.';

const apply = (input: string) => parser.value(input, {visit: componentVisitor})
const expectMarkup = (input: string, className: string, expected?: string) => {
  const output = apply(input);
  expect(shallow(output).is(className)).toBe(true);
  expect(shallow(output).text()).toEqual(expected ?? input);
}

describe('componentVisitor', () => {
  it('renders numbers', () => {
    expectMarkup('1024', '.number')
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

  it('renders logarithmic functions', () => {
    expectMarkup('lg(x)', '.functional.logarithmic')
    expectMarkup('ln(x)', '.functional.logarithmic')
    expectMarkup('log(x)', '.functional.logarithmic')
  })

  it('renders nested functions', () => {
    expectMarkup('cos(log(x))', '.functional.trigonometric')
    expectMarkup('log(cos(x))', '.functional.logarithmic')
  })

  it('renders factorials', () => {
    expectMarkup('x!', '.factorial')
  })
})