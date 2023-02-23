import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { implies } from './implication'
import { nand, $nand } from './alternativeDenial'

describe('$nand', () => {
  it('generates an AlternativeDenial for a pair of TreeNode inputs', () => {
    expect(
      $nand(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.nand,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('nand', () => {
  it('returns false when given two true things', () => {
    expectToEqualWithSnapshot(
      nand(boolean(true), boolean(true)),
      boolean(false)
    )
  })

  it('returns true if the left argument is false', () => {
    expectToEqualWithSnapshot(
      nand(boolean(false), boolean(true)),
      boolean(true)
    )
  })

  it('returns true if the right argument is false', () => {
    expectToEqualWithSnapshot(
      nand(boolean(true), boolean(false)),
      boolean(true)
    )
  })

  it('returns true if both arguments are false', () => {
    expectToEqualWithSnapshot(
      nand(boolean(false), boolean(false)),
      boolean(true)
    )
  })

  it('returns the complement of left operand if the right is true', () => {
    expectToEqualWithSnapshot(
      nand(variable('x'), boolean(true)),
      not(variable('x'))
    )
  })

  it('returns the right operand if the left is true', () => {
    expectToEqualWithSnapshot(
      nand(boolean(true), variable('x')),
      not(variable('x'))
    )
  })

  it('returns true if the right operand is false', () => {
    expectToEqualWithSnapshot(
      nand(variable('x'), boolean(false)),
      boolean(true)
    )
  })

  it('returns true if the left operand is false', () => {
    expectToEqualWithSnapshot(
      nand(boolean(false), variable('x')),
      boolean(true)
    )
  })

  it('returns the complement of the left operand if left equivalent to right', () => {
    expectToEqualWithSnapshot(
      nand(variable('x'), variable('x')),
      not(variable('x'))
    )
  })

  it('returns an implication if the right operand is a nand of the left', () => {
    expectToEqualWithSnapshot(
      nand(variable('x'), nand(variable('x'), variable('y'))),
      implies(variable('x'), variable('y'))
    )
    expectToEqualWithSnapshot(
      nand(variable('x'), nand(variable('y'), variable('x'))),
      implies(variable('x'), variable('y'))
    )
  })

  it('returns a disjunction of mutually complemented operands', () => {
    expectToEqualWithSnapshot(
      nand(not(variable('x')), not(variable('y'))),
      or(variable('x'), variable('y'))
    )
  })

  it('returns true if the right operand is the complement of the left', () => {
    expectToEqualWithSnapshot(
      nand(variable('x'), not(variable('x'))),
      boolean(true)
    )
  })

  it('returns true if the left operand is the complement of the right', () => {
    expectToEqualWithSnapshot(
      nand(not(variable('x')), variable('x')),
      boolean(true)
    )
  })

  it('returns a AlternativeDenial on variable input', () => {
    expectToEqualWithSnapshot(
      nand(variable('x'), variable('y')),
      $nand(variable('x'), variable('y'))[0]
    )
  })
})
