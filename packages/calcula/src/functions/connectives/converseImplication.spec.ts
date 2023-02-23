import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { converse, $converse } from './converseImplication'

describe('$converse', () => {
  it('generates a ConverseImplication for a pair of TreeNode inputs', () => {
    expect(
      $converse(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.converse,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('converse', () => {
  it('returns true when given two true things', () => {
    expectToEqualWithSnapshot(
      converse(boolean(true), boolean(true)),
      boolean(true)
    )
  })

  it('returns false if the left argument is false', () => {
    expectToEqualWithSnapshot(
      converse(boolean(false), boolean(true)),
      boolean(false)
    )
  })

  it('returns true if the right argument is false', () => {
    expectToEqualWithSnapshot(
      converse(boolean(true), boolean(false)),
      boolean(true)
    )
  })

  it('returns true if both arguments are false', () => {
    expectToEqualWithSnapshot(
      converse(boolean(false), boolean(false)),
      boolean(true)
    )
  })

  it('returns true if the left operand is true', () => {
    expectToEqualWithSnapshot(
      converse(boolean(true), variable('x')),
      boolean(true)
    )
  })

  it('returns the left operand if the right is true', () => {
    expectToEqualWithSnapshot(
      converse(variable('x'), boolean(true)),
      variable('x')
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectToEqualWithSnapshot(
      converse(boolean(false), variable('x')),
      not(variable('x'))
    )
  })

  it('returns true if the right operand is false', () => {
    expectToEqualWithSnapshot(
      converse(variable('x'), boolean(false)),
      boolean(true)
    )
  })

  it('returns a ConverseImplication on variable input', () => {
    expectToEqualWithSnapshot(
      converse(variable('x'), variable('y')),
      $converse(variable('x'), variable('y'))[0]
    )
  })
})
