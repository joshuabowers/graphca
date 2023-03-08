import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { and, $and } from './conjunction'

describe('$and', () => {
  it('generates a Conjunction for a pair of TreeNode inputs', () => {
    expect(
      $and(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.and,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('and', () => {
  it('returns true when given two true things', () => {
    expectToEqualWithSnapshot(
      and(boolean(true), boolean(true)),
      boolean(true)
    )
  })

  it('returns false if the left argument is false', () => {
    expectToEqualWithSnapshot(
      and(boolean(false), boolean(true)),
      boolean(false)
    )
  })

  it('returns false if the right argument is false', () => {
    expectToEqualWithSnapshot(
      and(boolean(true), boolean(false)),
      boolean(false)
    )
  })

  it('returns false if both arguments are false', () => {
    expectToEqualWithSnapshot(
      and(boolean(false), boolean(false)),
      boolean(false)
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectToEqualWithSnapshot(
      and(real(5), real(0)),
      boolean(false)
    )
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expectToEqualWithSnapshot(
      and(complex(5,0), complex(0,0)),
      boolean(false)
    )
  })

  it('returns the left operand if the right is true', () => {
    expectToEqualWithSnapshot(
      and(variable('x'), boolean(true)),
      variable('x')
    )
  })

  it('returns the right operand if the left is true', () => {
    expectToEqualWithSnapshot(
      and(boolean(true), variable('x')),
      variable('x')
    )
  })

  it('returns the false if the right operand is false', () => {
    expectToEqualWithSnapshot(
      and(variable('x'), boolean(false)),
      boolean(false)
    )
  })

  it('returns false if the left operand is false', () => {
    expectToEqualWithSnapshot(
      and(boolean(false), variable('x')),
      boolean(false)
    )
  })

  it('returns the left operand if left equivalent to right', () => {
    expectToEqualWithSnapshot(
      and(variable('x'), variable('x')),
      variable('x')
    )
  })

  // See (e.g.): https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
  // x | y | x or y | x and (x or y) | x and x | x and y | (x and x) or (x and y)
  // ----------------------------------------------------------------------------
  // F | F | F      | F              | F       | F       | F 
  // F | T | T      | F              | F       | F       | F
  // T | F | T      | T              | T       | F       | T
  // T | T | T      | T              | T       | T       | T
  it('returns the left operand if the right is a Disjunction of the left', () => {
    expectToEqualWithSnapshot(
      and(variable('x'), or(variable('x'), variable('y'))),
      variable('x')
    )
    expectToEqualWithSnapshot(
      and(variable('x'), or(variable('y'), variable('x'))),
      variable('x')
    )
  })

  it('returns the right operand if the left is a Disjunction of the right', () => {
    expectToEqualWithSnapshot(
      and(or(variable('x'), variable('y')), variable('x')),
      variable('x')
    )
    expectToEqualWithSnapshot(
      and(or(variable('y'), variable('x')), variable('x')),
      variable('x')
    )
  })

  it('returns false if the right operand is the negation of the left', () => {
    expectToEqualWithSnapshot(
      and(variable('x'), not(variable('x'))),
      boolean(false)
    )
  })

  it('returns false if the left operand is the negation of the right', () => {
    expectToEqualWithSnapshot(
      and(not(variable('x')), variable('x')),
      boolean(false)
    )
  })

  it('returns a Conjunction on variable input', () => {
    expectToEqualWithSnapshot(
      and(variable('x'), variable('y')),
      $and(variable('x'), variable('y'))[0]
    )
  })
})
