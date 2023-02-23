import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'
import { converse } from './converseImplication'
import { or, $or } from './disjunction'

describe('$or', () => {
  it('generates a Disjunction for a pair of TreeNode inputs', () => {
    expect(
      $or(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.or,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('or', () => {
  it('returns true when given two true things', () => {
    expectToEqualWithSnapshot(
      or(boolean(true), boolean(true)),
      boolean(true)
    )
  })

  it('returns true if the left argument is true', () => {
    expectToEqualWithSnapshot(
      or(boolean(true), boolean(false)),
      boolean(true)
    )
  })

  it('returns true if the right argument is true', () => {
    expectToEqualWithSnapshot(
      or(boolean(false), boolean(true)),
      boolean(true)
    )
  })

  it('returns false if both arguments are false', () => {
    expectToEqualWithSnapshot(
      or(boolean(false), boolean(false)),
      boolean(false)
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectToEqualWithSnapshot(
      or(real(5), real(0)),
      boolean(true)
    )
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expectToEqualWithSnapshot(
      or(complex([5, 0]), complex([0, 0])),
      boolean(true)
    )
  })

  it('returns the left operand if the right is false', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), boolean(false)),
      variable('x')
    )
  })

  it('returns the right operand if the left is false', () => {
    expectToEqualWithSnapshot(
      or(boolean(false), variable('x')),
      variable('x')
    )
  })

  it('returns true if the right operand is true', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), boolean(true)),
      boolean(true)
    )
  })

  it('returns true if the left operand is true', () => {
    expectToEqualWithSnapshot(
      or(boolean(true), variable('x')),
      boolean(true)
    )
  })

  it('returns the left operand if left is equivalent to right', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), variable('x')),
      variable('x')
    )
  })

  it('returns the left operand if the right is a left-child Conjunction of the left', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), and(variable('x'), variable('y'))),
      variable('x')
    )
  })

  it('returns the left operand if the right is a right-child Conjunction of the left', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), and(variable('y'), variable('x'))),
      variable('x')
    )
  })

  it('returns the right operand if the left is a left-child Conjunction of the right', () => {
    expectToEqualWithSnapshot(
      or(and(variable('x'), variable('y')), variable('x')),
      variable('x')
    )
  })

  it('returns the right operand if the left is a right-child Conjunction of the right', () => {
    expectToEqualWithSnapshot(
      or(and(variable('y'), variable('x')), variable('x')),
      variable('x')
    )
  })

  it('returns true if the right operand is the negation of the left', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), not(variable('x'))),
      boolean(true)
    )
  })

  it('returns true if the left operand is the negation of the right', () => {
    expectToEqualWithSnapshot(
      or(not(variable('x')), variable('x')),
      boolean(true)
    )
  })

  it('returns an implication if the left operand is a complement', () => {
    expectToEqualWithSnapshot(
      or(not(variable('x')), variable('y')),
      implies(variable('x'), variable('y'))
    )
  })

  it('returns a converse if the right operand is a complement', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), not(variable('y'))),
      converse(variable('x'), variable('y'))
    )
  })

  it('returns a Disjunction on variable input', () => {
    expectToEqualWithSnapshot(
      or(variable('x'), variable('y')),
      $or(variable('x'), variable('y'))[0]
    )
  })
})
