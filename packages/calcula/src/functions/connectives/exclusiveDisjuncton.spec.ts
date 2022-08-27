import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { ExclusiveDisjunction, xor } from './exclusiveDisjunction'

describe('xor', () => {
  it('returns false when given two true things', () => {
    expect(xor(boolean(true), boolean(true))).toEqual(boolean(false))
  })

  it('returns true if the left argument is false', () => {
    expect(xor(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the right argument is false', () => {
    expect(xor(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns false if both arguments are false', () => {
    expect(xor(boolean(false), boolean(false))).toEqual(boolean(false))
  })

  it('returns the right operand if the left is false', () => {
    expect(xor(boolean(false), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is false', () => {
    expect(xor(variable('x'), boolean(false))).toEqual(variable('x'))
  })

  it('returns the complement of the right if the left is true', () => {
    expect(xor(boolean(true), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns the complement of the left if the right is true', () => {
    expect(xor(variable('x'), boolean(true))).toEqual(not(variable('x')))
  })

  it('returns false if the left and right operands are equal', () => {
    expect(xor(variable('x'), variable('x'))).toEqual(boolean(false))
  })

  it('returns a ExclusiveDisjunction on variable input', () => {
    expectWriter(xor(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.xor,
        left: variable('x'), right: variable('y')
      } as ExclusiveDisjunction,
      [[variable('x').value, variable('y').value], 'exclusive disjunction']
    )
  })  
})
