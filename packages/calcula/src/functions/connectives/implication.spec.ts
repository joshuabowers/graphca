import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { implies, $implies } from './implication'

describe('$implies', () => {
  it('generates a Implication for a pair of TreeNode inputs', () => {
    expect(
      $implies(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.implies,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('implies', () => {
  it('returns true when given two true things', () => {
    expectToEqualWithSnapshot(
      implies(boolean(true), boolean(true)),
      boolean(true)
    )
  })

  it('returns true if the left argument is false', () => {
    expectToEqualWithSnapshot(
      implies(boolean(false), boolean(true)),
      boolean(true)
    )
  })

  it('returns false if the right argument is false', () => {
    expectToEqualWithSnapshot(
      implies(boolean(true), boolean(false)),
      boolean(false)
    )
  })

  it('returns true if both arguments are false', () => {
    expectToEqualWithSnapshot(
      implies(boolean(false), boolean(false)),
      boolean(true)
    )
  })

  it('returns the right operand if the left is true', () => {
    expectToEqualWithSnapshot(
      implies(boolean(true), variable('x')),
      variable('x')
    )
  })

  it('returns true if the right operand is true', () => {
    expectToEqualWithSnapshot(
      implies(variable('x'), boolean(true)),
      boolean(true)
    )
  })

  it('returns true if the left operand is false', () => {
    expectToEqualWithSnapshot(
      implies(boolean(false), variable('x')),
      boolean(true)
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectToEqualWithSnapshot(
      implies(variable('x'), boolean(false)),
      not(variable('x'))
    )
  })
  
  it('returns an Implication on variable input', () => {
    expectToEqualWithSnapshot(
      implies(variable('x'), variable('y')),
      $implies(variable('x'), variable('y'))[0]
    )
  })
})
