import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { Implication, implies } from './implication'

describe('implies', () => {
  it('returns true when given two true things', () => {
    expectWriter(
      implies(boolean(true), boolean(true))
    )(
      boolean(true),
      [[boolean(true), boolean(true)], 'implicative identity']
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriter(
      implies(boolean(false), boolean(true))
    )(
      boolean(true),
      [[boolean(false), boolean(true)], 'implicative annihilator']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriter(
      implies(boolean(true), boolean(false))
    )(
      boolean(false),
      [[boolean(true), boolean(false)], 'implicative identity']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriter(
      implies(boolean(false), boolean(false))
    )(
      boolean(true),
      [[boolean(false), boolean(false)], 'implicative annihilator']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriter(
      implies(boolean(true), variable('x'))
    )(
      variable('x'),
      [[boolean(true), variable('x')], 'implicative identity']
    )
  })

  it('returns true if the right operand is true', () => {
    expectWriter(
      implies(variable('x'), boolean(true))
    )(
      boolean(true),
      [[variable('x'), boolean((true))], 'implicative annihilator']
    )
  })

  it('returns true if the left operand is false', () => {
    expectWriter(
      implies(boolean(false), variable('x'))
    )(
      boolean(true),
      [[boolean(false), variable('x')], 'implicative annihilator']
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectWriter(
      implies(variable('x'), boolean(false))
    )(
      not(variable('x')),
      [[variable('x'), boolean(false)], 'implicative complementation'],
      [variable('x'), 'complement']
    )
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
