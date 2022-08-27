import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { JointDenial, nor } from './jointDenial'

describe('nor', () => {
  it('returns false when given two true things', () => {
    expect(nor(boolean(true), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the left argument is false', () => {
    expect(nor(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the right argument is false', () => {
    expect(nor(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns true if both arguments are false', () => {
    expect(nor(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the complement of the left operand if the right is false', () => {
    expect(nor(variable('x'), boolean(false))).toEqual(not(variable('x')))
  })

  it('returns the complement of the right operand if the left is false', () => {
    expect(nor(boolean(false), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns false if the right operand is true', () => {
    expect(nor(variable('x'), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the left operand is true', () => {
    expect(nor(boolean(true), variable('x'))).toEqual(boolean(false))
  })

  it('returns the complement of the left operand if left is equivalent to right', () => {
    expect(nor(variable('x'), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns a conjunction of mutually complemented operands', () => {
    expect(
      nor(not(variable('x')), not(variable('y')))
    ).toEqual(and(variable('x'), variable('y')))
  })

  it('returns false if the right operand is the complement of the left', () => {
    expect(nor(variable('x'), not(variable('x')))).toEqual(boolean(false))
  })

  it('returns false if the left operand is the complement of the right', () => {
    expect(nor(not(variable('x')), variable('x'))).toEqual(boolean(false))
  })

  it('returns a JointDenial on variable input', () => {
    expectWriter(nor(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.nor,
        left: variable('x'), right: variable('y')
      } as JointDenial,
      [[variable('x').value, variable('y').value], 'joint denial']
    )
  })
})
