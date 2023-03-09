import { real, complex, boolean } from '../primitives'
import { variable } from '../variable';
import { add } from './addition';
import { multiply } from './multiplication';
import { raise } from './exponentiation';
import { ln } from '../functions';

import { degree, subDegree } from "./degree";

describe('subDegree', () => {
  it('is the raw value of a real', () => {
    expect(subDegree(real(5))).toEqual(5)
  })

  it('is the length of a complex', () => {
    expect(subDegree(complex(1, 2))).toEqual(Math.hypot(1, 2))
  })

  it('is Infinity for variables', () => {
    expect(subDegree(variable('x'))).toEqual(Infinity)
  })
})

describe('degree', () => {
  it('is -Infinity for 0 values', () => {
    expect(degree(real(0))).toEqual(-Infinity)
    expect(degree(complex(0, 0))).toEqual(-Infinity)
    expect(degree(boolean(false))).toEqual(-Infinity)
  })

  it('is 0 for a real node', () => {
    expect(degree(real(1))).toEqual(0)
  })

  it('is 0 for complex numbers', () => {
    expect(degree(complex(1, 1))).toEqual(0)
  })

  it('is 0 for true booleans', () => {
    expect(degree(boolean(true))).toEqual(0)
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
    expect(
      degree(multiply(variable('y'), raise(variable('x'), real(4))))
    ).toEqual(5)
  })

  it('is the max of the two sides of an addition', () => {
    expect(
      degree(add(variable('y'), raise(variable('x'), real(3))))
    ).toEqual(3)
  })
})
