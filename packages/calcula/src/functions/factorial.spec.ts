import { unit } from '../monads/writer';
import { 
  expectToEqualWithSnapshot, expectCloseTo
} from '../utility/expectations'
import { Clades, Species } from '../utility/tree';
import { ComplexInfinity } from '../primitives/complex';
import { real, complex } from '../primitives';
import { variable } from '../variable';
import { factorial, $factorial } from "./factorial";
import { gamma } from './gamma'

describe('$factorial', () => {
  it('generates a Factorial for a TreeNode input', () => {
    expect(
      $factorial(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: undefined, species: Species.factorial,
      expression: unit(variable('x').value)
    })
  })
})

describe('factorial', () => {
  it('returns 1 for an input of 0', () => {
    expectToEqualWithSnapshot(
      factorial(real(0)),
      real(1)
    )
  })

  it('returns the factorial for positive integers', () => {
    expectToEqualWithSnapshot(
      factorial(real(2)),
      real(2)
    )
  })

  it('returns complex 1 for an input of complex 0', () => {
    expectToEqualWithSnapshot(
      factorial(complex([0, 0])),
      complex([1, 0])
    )
  })

  it('returns the factorial for a integer complex', () => {
    expectToEqualWithSnapshot(
      factorial(complex([2, 0])),
      complex([2, 0])
    )
  })

  it('returns complex infinity for non-positive integer reals', () => {
    expectToEqualWithSnapshot(
      factorial(real(-5)),
      ComplexInfinity
    )
  })

  it('returns a shifted gamma for non-integer reals', () => {
    expectCloseTo(factorial(real(5.5)), gamma(real(6.5)), 10)
  })

  it('returns a shifted gamma for non-integer complex numbers', () => {
    expectCloseTo(factorial(complex([1, 1])), gamma(complex([2, 1])), 10)
  })

  it('returns a Factorial node for unbound variables', () => {
    expectToEqualWithSnapshot(
      factorial(variable('x')),
      $factorial(variable('x'))[0]
    )
  })
})
