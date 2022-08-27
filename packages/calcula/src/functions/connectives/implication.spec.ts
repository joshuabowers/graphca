import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { Implication, implies } from './implication'

describe('implies', () => {
  it('returns true when given two true things', () => {
    expect(implies(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left argument is false', () => {
    expect(implies(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the right argument is false', () => {
    expect(implies(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns true if both arguments are false', () => {
    expect(implies(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the right operand if the left is true', () => {
    expect(implies(boolean(true), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is true', () => {
    expect(implies(variable('x'), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left operand is false', () => {
    expect(implies(boolean(false), variable('x'))).toEqual(boolean(true))
  })

  it('returns the complement of the left if the right is false', () => {
    expect(implies(variable('x'), boolean(false))).toEqual(not(variable('x')))
  })
  
  it('returns an Implication on variable input', () => {
    expectWriter(implies(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.implies,
        left: variable('x'), right: variable('y')
      } as Implication,
      [[variable('x').value, variable('y').value], 'implication']
    )
  })
})
