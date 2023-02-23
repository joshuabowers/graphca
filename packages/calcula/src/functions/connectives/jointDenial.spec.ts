import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { nor, $nor } from './jointDenial'

describe('$nor', () => {
  it('generates a Joint Denial for a pair of TreeNode inputs', () => {
    expect(
      $nor(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.nor,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('nor', () => {
  it('returns false when given two true things', () => {
    expectToEqualWithSnapshot(
      nor(boolean(true), boolean(true)),
      boolean(false)
    )
  })

  it('returns false if the left argument is false', () => {
    expectToEqualWithSnapshot(
      nor(boolean(false), boolean(true)),
      boolean(false)
    )
  })

  it('returns false if the right argument is false', () => {
    expectToEqualWithSnapshot(
      nor(boolean(true), boolean(false)),
      boolean(false)
    )
  })

  it('returns true if both arguments are false', () => {
    expectToEqualWithSnapshot(
      nor(boolean(false), boolean(false)),
      boolean(true)
    )
  })

  it('returns the complement of the left operand if the right is false', () => {
    expectToEqualWithSnapshot(
      nor(variable('x'), boolean(false)),
      not(variable('x'))
    )
  })

  it('returns the complement of the right operand if the left is false', () => {
    expectToEqualWithSnapshot(
      nor(boolean(false), variable('x')),
      not(variable('x'))
    )
  })

  it('returns false if the right operand is true', () => {
    expectToEqualWithSnapshot(
      nor(variable('x'), boolean(true)),
      boolean(false)
    )
  })

  it('returns false if the left operand is true', () => {
    expectToEqualWithSnapshot(
      nor(boolean(true), variable('x')),
      boolean(false)
    )
  })

  it('returns the complement of the left operand if left is equivalent to right', () => {
    expectToEqualWithSnapshot(
      nor(variable('x'), variable('x')),
      not(variable('x'))
    )
  })

  it('returns a conjunction of mutually complemented operands', () => {
    expectToEqualWithSnapshot(
      nor(not(variable('x')), not(variable('y'))),
      and(variable('x'), variable('y'))
    )
  })

  it('returns false if the right operand is the complement of the left', () => {
    expectToEqualWithSnapshot(
      nor(variable('x'), not(variable('x'))),
      boolean(false)
    )
  })

  it('returns false if the left operand is the complement of the right', () => {
    expectToEqualWithSnapshot(
      nor(not(variable('x')), variable('x')),
      boolean(false)
    )
  })

  it('returns a JointDenial on variable input', () => {
    expectToEqualWithSnapshot(
      nor(variable('x'), variable('y')),
      $nor(variable('x'), variable('y'))[0]
    )
  })
})
