import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { ConverseImplication, converse } from './converseImplication'

describe('converse', () => {
  it('returns true when given two true things', () => {
    expect(converse(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the left argument is false', () => {
    expect(converse(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns true if the right argument is false', () => {
    expect(converse(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if both arguments are false', () => {
    expect(converse(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if the left operand is true', () => {
    expect(converse(boolean(true), variable('x'))).toEqual(boolean(true))
  })

  it('returns the left operand if the right is true', () => {
    expect(converse(variable('x'), boolean(true))).toEqual(variable('x'))
  })

  it('returns the complement of the right if the left is false', () => {
    expect(converse(boolean(false), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns true if the right operand is false', () => {
    expect(converse(variable('x'), boolean(false))).toEqual(boolean(true))
  })

  it('returns a ConverseImplication on variable input', () => {
    expectWriter(converse(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.converse,
        left: variable('x'), right: variable('y')
      } as ConverseImplication,
      [[variable('x').value, variable('y').value], 'converse implication']
    )
  })
})
