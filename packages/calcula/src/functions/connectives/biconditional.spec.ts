import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { xnor, $xnor } from './biconditional'

describe('$xnor', () => {
  it('generates a Biconditional for a pair of TreeNode inputs', () => {
    expect(
      $xnor(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.xnor,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('xnor', () => {
  it('returns true when given two true things', () => {
    expectToEqualWithSnapshot(
      xnor(boolean(true), boolean(true)),
      boolean(true)
    )
  })

  it('returns false if the left argument is false', () => {
    expectToEqualWithSnapshot(
      xnor(boolean(false), boolean(true)),
      boolean(false)
    )
  })

  it('returns false if the right argument is false', () => {
    expectToEqualWithSnapshot(
      xnor(boolean(true), boolean(false)),
      boolean(false)
    )
  })

  it('returns true if both arguments are false', () => {
    expectToEqualWithSnapshot(
      xnor(boolean(false), boolean(false)),
      boolean(true)
    )
  })

  it('returns the right operand if the left is true', () => {
    expectToEqualWithSnapshot(
      xnor(boolean(true), variable('x')),
      variable('x')
    )
  })

  it('returns the left operand if the right is true', () => {
    expectToEqualWithSnapshot(
      xnor(variable('x'), boolean(true)),
      variable('x')
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectToEqualWithSnapshot(
      xnor(boolean(false), variable('x')),
      not(variable('x'))
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectToEqualWithSnapshot(
      xnor(variable('x'), boolean(false)),
      not(variable('x'))
    )
  })

  it('returns true if the operands are equal', () => {
    expectToEqualWithSnapshot(
      xnor(variable('x'), variable('x')),
      boolean(true)
    )
  })

  it('returns a Biconditional on variable input', () => {
    expectToEqualWithSnapshot(
      xnor(variable('x'), variable('y')),
      $xnor(variable('x'), variable('y'))[0]
    )
  })
})
