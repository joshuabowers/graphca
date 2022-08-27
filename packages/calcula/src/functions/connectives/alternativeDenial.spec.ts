import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { implies } from './implication'
import { AlternativeDenial, nand } from './alternativeDenial'

describe('nand', () => {
  it('returns false when given two true things', () => {
    expect(nand(boolean(true), boolean(true))).toEqual(boolean(false))
  })

  it('returns true if the left argument is false', () => {
    expect(nand(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the right argument is false', () => {
    expect(nand(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if both arguments are false', () => {
    expect(nand(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the complement of left operand if the right is true', () => {
    expect(nand(variable('x'), boolean(true))).toEqual(not(variable('x')))
  })

  it('returns the right operand if the left is true', () => {
    expect(nand(boolean(true), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns the true if the right operand is false', () => {
    expect(nand(variable('x'), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if the left operand is false', () => {
    expect(nand(boolean(false), variable('x'))).toEqual(boolean(true))
  })

  it('returns the complement of the left operand if left equivalent to right', () => {
    expect(nand(variable('x'), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns an implication if the right operand is a nand of the left', () => {
    expect(
      nand(variable('x'), nand(variable('x'), variable('y')))
    ).toEqual(implies(variable('x'), variable('y')))
    expect(
      nand(variable('x'), nand(variable('y'), variable('x')))
    ).toEqual(implies(variable('x'), variable('y')))
  })

  it('returns a disjunction of mutually complemented operands', () => {
    expect(
      nand(not(variable('x')), not(variable('y')))
    ).toEqual(or(variable('x'), variable('y')))
  })

  it('returns true if the right operand is the complement of the left', () => {
    expect(nand(variable('x'), not(variable('x')))).toEqual(boolean(true))
  })

  it('returns true if the left operand is the complement of the right', () => {
    expect(nand(not(variable('x')), variable('x'))).toEqual(boolean(true))
  })

  it('returns a AlternativeDenial on variable input', () => {
    expectWriter(nand(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.nand,
        left: variable('x'), right: variable('y')
      } as AlternativeDenial,
      [[variable('x').value, variable('y').value], 'alternative denial']
    )
  })
})
