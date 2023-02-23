import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { xor, $xor } from './exclusiveDisjunction'

describe('$xor', () => {
  it('generates a Exclusive Disjunction for a pair of TreeNode inputs', () => {
    expect(
      $xor(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.xor,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('xor', () => {
  it('returns false when given two true things', () => {
    expectToEqualWithSnapshot(
      xor(boolean(true), boolean(true)),
      boolean(false)
    )
  })

  it('returns true if the left argument is false', () => {
    expectToEqualWithSnapshot(
      xor(boolean(false), boolean(true)),
      boolean(true)
    )
  })

  it('returns true if the right argument is false', () => {
    expectToEqualWithSnapshot(
      xor(boolean(true), boolean(false)),
      boolean(true)
    )
  })

  it('returns false if both arguments are false', () => {
    expectToEqualWithSnapshot(
      xor(boolean(false), boolean(false)),
      boolean(false)
    )
  })

  it('returns the right operand if the left is false', () => {
    expectToEqualWithSnapshot(
      xor(boolean(false), variable('x')),
      variable('x')
    )
  })

  it('returns the left operand if the right is false', () => {
    expectToEqualWithSnapshot(
      xor(variable('x'), boolean(false)),
      variable('x')
    )
  })

  it('returns the complement of the right if the left is true', () => {
    expectToEqualWithSnapshot(
      xor(boolean(true), variable('x')),
      not(variable('x'))
    )
  })

  it('returns the complement of the left if the right is true', () => {
    expectToEqualWithSnapshot(
      xor(variable('x'), boolean(true)),
      not(variable('x'))
    )
  })

  it('returns false if the left and right operands are equal', () => {
    expectToEqualWithSnapshot(
      xor(variable('x'), variable('x')),
      boolean(false)
    )
  })

  it('returns a ExclusiveDisjunction on variable input', () => {
    expectToEqualWithSnapshot(
      xor(variable('x'), variable('y')),
      $xor(variable('x'), variable('y'))[0]
    )
  })  
})
