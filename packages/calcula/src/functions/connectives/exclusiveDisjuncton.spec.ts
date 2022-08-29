import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { ExclusiveDisjunction, xor } from './exclusiveDisjunction'

describe('xor', () => {
  it('returns false when given two true things', () => {
    expectWriter(
      xor(boolean(true), boolean(true))
    )(
      boolean(false),
      [[boolean(true), boolean(true)], 'exclusive disjunctive complementation'],
      [boolean(true), 'boolean complement']
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriter(
      xor(boolean(false), boolean(true))
    )(
      boolean(true),
      [[boolean(false), boolean(true)], 'exclusive disjunctive identity']
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriter(
      xor(boolean(true), boolean(false))
    )(
      boolean(true),
      [[boolean(true), boolean(false)], 'exclusive disjunctive identity']
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriter(
      xor(boolean(false), boolean(false))
    )(
      boolean(false),
      [[boolean(false), boolean(false)], 'exclusive disjunctive identity']
    )
  })

  it('returns the right operand if the left is false', () => {
    expectWriter(
      xor(boolean(false), variable('x'))
    )(
      variable('x'),
      [[boolean(false), variable('x')], 'exclusive disjunctive identity']
    )
  })

  it('returns the left operand if the right is false', () => {
    expectWriter(
      xor(variable('x'), boolean(false))
    )(
      variable('x'),
      [[variable('x'), boolean(false)], 'exclusive disjunctive identity']
    )
  })

  it('returns the complement of the right if the left is true', () => {
    expectWriter(
      xor(boolean(true), variable('x'))
    )(
      not(variable('x')),
      [[boolean(true), variable('x')], 'exclusive disjunctive complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns the complement of the left if the right is true', () => {
    expectWriter(
      xor(variable('x'), boolean(true))
    )(
      not(variable('x')),
      [[variable('x'), boolean(true)], 'exclusive disjunctive complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns false if the left and right operands are equal', () => {
    expectWriter(
      xor(variable('x'), variable('x'))
    )(
      boolean(false),
      [[variable('x'), variable('x')], 'exclusive disjunctive annihilator']
    )
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
