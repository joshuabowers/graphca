import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'
import { converse } from './converseImplication'
import { Disjunction, or } from './disjunction'

describe('or', () => {
  it('returns true when given two true things', () => {
    expect(or(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left argument is true', () => {
    expect(or(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if the right argument is true', () => {
    expect(or(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if both arguments are false', () => {
    expect(or(boolean(false), boolean(false))).toEqual(boolean(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(or(real(5), real(0))).toEqual(boolean(true))
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expect(or(complex([5,0]), complex([0,0]))).toEqual(boolean(true))
  })

  it('returns the left operand if the right is false', () => {
    expect(or(variable('x'), boolean(false))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is false', () => {
    expect(or(boolean(false), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is true', () => {
    expect(or(variable('x'), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left operand is true', () => {
    expect(or(boolean(true), variable('x'))).toEqual(boolean(true))
  })

  it('returns the left operand if left is equivalent to right', () => {
    expect(or(variable('x'), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is a Conjunction of the left', () => {
    expect(or(variable('x'), and(variable('x'), variable('y')))).toEqual(variable('x'))
    expect(or(variable('x'), and(variable('y'), variable('x')))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is a Conjunction of the right', () => {
    expect(or(and(variable('x'), variable('y')), variable('x'))).toEqual(variable('x'))
    expect(or(and(variable('y'), variable('x')), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is the negation of the left', () => {
    expect(or(variable('x'), not(variable('x')))).toEqual(boolean(true))
  })

  it('returns true if the left operand is the negation of the right', () => {
    expect(or(not(variable('x')), variable('x'))).toEqual(boolean(true))
  })

  it('returns an implication if the left operand is a complement', () => {
    expect(
      or(not(variable('x')), variable('y'))
    ).toEqual(implies(variable('x'), variable('y')))
  })

  it('returns a converse if the right operand is a complement', () => {
    expect(
      or(variable('x'), not(variable('y')))
    ).toEqual(converse(variable('x'), variable('y')))
  })

  it('returns a Disjunction on variable input', () => {
    expectWriter(or(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.or,
        left: variable('x'), right: variable('y')
      } as Disjunction,
      [[variable('x').value, variable('y').value], 'disjunction']
    )
  })
})
