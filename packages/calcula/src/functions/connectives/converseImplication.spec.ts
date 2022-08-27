import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { ConverseImplication, converse } from './converseImplication'

describe('converse', () => {
  it('returns true when given two true things', () => {
    expectWriter(
      converse(boolean(true), boolean(true))
    )(
      boolean(true),
      [[boolean(true), boolean(true)], 'converse implication annihilator']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriter(
      converse(boolean(false), boolean(true))
    )(
      boolean(false),
      [[boolean(false), boolean(true)], 'converse implication identity']
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriter(
      converse(boolean(true), boolean(false))
    )(
      boolean(true),
      [[boolean(true), boolean(false)], 'converse implication annihilator']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriter(
      converse(boolean(false), boolean(false))
    )(
      boolean(true),
      [[boolean(false), boolean(false)], 'converse implication complementation'],
      [boolean(false), 'boolean complement']
    )
  })

  it('returns true if the left operand is true', () => {
    expectWriter(
      converse(boolean(true), variable('x'))
    )(
      boolean(true),
      [[boolean(true), variable('x')], 'converse implication annihilator']
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriter(
      converse(variable('x'), boolean(true))
    )(
      variable('x'),
      [[variable('x'), boolean(true)], 'converse implication identity']
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectWriter(
      converse(boolean(false), variable('x'))
    )(
      not(variable('x')),
      [[boolean(false), variable('x')], 'converse implication complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns true if the right operand is false', () => {
    expectWriter(
      converse(variable('x'), boolean(false))
    )(
      boolean(true),
      [[variable('x'), boolean(false)], 'converse implication annihilator']
    )
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
