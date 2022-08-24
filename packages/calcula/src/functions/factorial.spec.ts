import { expectWriter } from '../utility/expectations'
import { Clades, Species } from '../utility/tree';
import { ComplexInfinity } from '../primitives/complex';
import { real, complex } from '../primitives';
import { variable } from '../variable';
import { Factorial, factorial } from "./factorial";
import { gamma } from './gamma'

describe('factorial', () => {
  it('returns 1 for an input of 0', () => {
    expect(factorial(real(0))).toEqual(real(1))
  })

  it('returns the factorial for positive integers', () => {
    expect(factorial(real(5))).toEqual(real(120))
  })

  it('returns complex 1 for an input of complex 0', () => {
    expect(factorial(complex([0, 0]))).toEqual(complex([1, 0]))
  })

  it('returns the factorial for a integer complex', () => {
    expect(factorial(complex([5, 0]))).toEqual(complex([120, 0]))
  })

  it('returns complex infinity for non-positive integer reals', () => {
    expect(factorial(real(-5))).toEqual(ComplexInfinity)
  })

  it('returns a shifted gamma for non-integer reals', () => {
    expect(factorial(real(5.5))).toEqual(gamma(real(6.5)))
  })

  it('returns a shifted gamma for non-integer complex numbers', () => {
    expect(factorial(complex([1, 1]))).toEqual(gamma(complex([2, 1])))
  })

  it('returns a Factorial node for unbound variables', () => {
    // expect(factorial(variable('x'))).toEqual(new Factorial(variable('x')))
    expectWriter(factorial(variable('x')))(
      {
        clade: Clades.unary, genus: undefined, species: Species.factorial,
        expression: variable('x')
      } as Factorial
    ),
    [variable('x').value, 'real factorial']
  })
})
