import { expectCloseTo, expectWriter } from '../utility/expectations'
import { Clades, Species } from '../utility/tree';
import { ComplexInfinity } from '../primitives/complex';
import { real, complex } from '../primitives';
import { variable } from '../variable';
import { factorial, $factorial } from "./factorial";
import { gamma } from './gamma'

describe('$factorial', () => {
  it('returns an Action<Factorial> without logic', () => {
    expect($factorial(variable('x'))).toEqual([
      {
        clade: Clades.unary, genus: undefined, species: Species.factorial,
        expression: variable('x')
      },
      'factorial'
    ])
  })
})

describe('factorial', () => {
  it('returns 1 for an input of 0', () => {
    expectWriter(
      factorial(real(0))
    )(
      real(1).value,
      [real(0).value, 'degenerate case']
    )
  })

  it('returns the factorial for positive integers', () => {
    expectWriter(
      factorial(real(5))
    )(
      real(120).value,
      [[real(5).value, real(-1).value], 'real addition'],
      [[real(4).value, real(-1).value], 'real addition'],
      [[real(3).value, real(-1).value], 'real addition'],
      [[real(2).value, real(-1).value], 'real addition'],
      [[real(1).value, real(-1).value], 'real addition'],
      [real(0).value, 'degenerate case'],
      [[real(1).value, real(1).value], 'multiplicative identity'],
      [real(1).value, 'real factorial'],
      [[real(2).value, real(1).value], 'real multiplication'],
      [real(2).value, 'real factorial'],
      [[real(3).value, real(2).value], 'real multiplication'],
      [real(3).value, 'real factorial'],
      [[real(4).value, real(6).value], 'real multiplication'],
      [real(4).value, 'real factorial'],
      [[real(5).value, real(24).value], 'real multiplication'],
      [real(5).value, 'real factorial']
    )
  })

  it('returns complex 1 for an input of complex 0', () => {
    expectWriter(
      factorial(complex([0, 0]))
    )(
      complex([1, 0]).value,
      [complex([0, 0]).value, 'degenerate case']
    )
  })

  it('returns the factorial for a integer complex', () => {
    expectWriter(
      factorial(complex([5, 0]))
    )(
      complex([120, 0]).value,
      [[complex([5, 0]).value, complex([-1, 0]).value], 'complex addition'],
      [[complex([4, 0]).value, complex([-1, 0]).value], 'complex addition'],
      [[complex([3, 0]).value, complex([-1, 0]).value], 'complex addition'],
      [[complex([2, 0]).value, complex([-1, 0]).value], 'complex addition'],
      [[complex([1, 0]).value, complex([-1, 0]).value], 'complex addition'],
      [complex([0, 0]).value, 'degenerate case'],
      [[complex([1, 0]).value, complex([1, 0]).value], 'complex multiplication'],
      [complex([1, 0]).value, 'complex factorial'],
      [[complex([2, 0]).value, complex([1, 0]).value], 'complex multiplication'],
      [complex([2, 0]).value, 'complex factorial'],
      [[complex([3, 0]).value, complex([2, 0]).value], 'complex multiplication'],
      [complex([3, 0]).value, 'complex factorial'],
      [[complex([4, 0]).value, complex([6, 0]).value], 'complex multiplication'],
      [complex([4, 0]).value, 'complex factorial'],
      [[complex([5, 0]).value, complex([24, 0]).value], 'complex multiplication'],
      [complex([5, 0]).value, 'complex factorial']
    )
  })

  it('returns complex infinity for non-positive integer reals', () => {
    expectWriter(
      factorial(real(-5))
    )(
      ComplexInfinity.value,
      [real(-5).value, 'singularity']
    )
  })

  it('returns a shifted gamma for non-integer reals', () => {
    expectCloseTo(factorial(real(5.5)), gamma(real(6.5)), 10)
  })

  it('returns a shifted gamma for non-integer complex numbers', () => {
    expectCloseTo(factorial(complex([1, 1])), gamma(complex([2, 1])), 10)
  })

  it('returns a Factorial node for unbound variables', () => {
    expectWriter(
      factorial(variable('x'))
    )(
      $factorial(variable('x'))[0],
      [variable('x').value, 'factorial']
    )
  })
})
