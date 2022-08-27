import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { Biconditional, xnor } from './biconditional'

describe('xnor', () => {
  it('returns true when given two true things', () => {
    expect(xnor(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the left argument is false', () => {
    expect(xnor(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the right argument is false', () => {
    expect(xnor(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns true if both arguments are false', () => {
    expect(xnor(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the right operand if the left is true', () => {
    expect(xnor(boolean(true), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is true', () => {
    expect(xnor(variable('x'), boolean(true))).toEqual(variable('x'))
  })

  it('returns the complement of the right if the left is false', () => {
    expect(xnor(boolean(false), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns the complement of the left if the right is false', () => {
    expect(xnor(variable('x'), boolean(false))).toEqual(not(variable('x')))
  })

  it('returns true if the operands are equal', () => {
    expect(xnor(variable('x'), variable('x'))).toEqual(boolean(true))
  })

  it('returns a Biconditional on variable input', () => {
    expectWriter(xnor(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.xnor,
        left: variable('x'), right: variable('y')
      } as Biconditional,
      [[variable('x').value, variable('y').value], 'biconditional']
    )
  })
})
