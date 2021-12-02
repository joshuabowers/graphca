import { real } from "./real";
import { complex } from "./complex";
import { variable } from "./variable";
import { add } from './addition';
import { multiply } from "./multiplication";
import { raise } from "./exponentiation";
import { ln } from "./logarithmic";

import { degree } from "./degree";

describe('degree', () => {
  it('is 0 for a real node', () => {
    expect(degree(real(1))).toEqual(0)
  })

  it('is 0 for complex numbers', () => {
    expect(degree(complex(1, 1))).toEqual(0)
  })

  it('is 1 for a variable', () => {
    expect(degree(variable('x'))).toEqual(1)
  })

  it('is the power of an exponentiation', () => {
    expect(degree(raise(variable('x'), real(3)))).toEqual(3)
  })

  it('is infinity for an exponential function', () => {
    expect(degree(raise(real(2), variable('x')))).toEqual(Infinity)
  })

  it('is 0 for logarithms', () => {
    expect(degree(ln(variable('x')))).toEqual(0)
  })

  it('is the sum of powers of all multiplicands', () => {
    expect(degree(multiply(variable('y'), raise(variable('x'), real(4))))).toEqual(5)
  })

  it('is the max of the two sides of an addition', () => {
    expect(degree(add(variable('y'), raise(variable('x'), real(3))))).toEqual(3)
  })
})
