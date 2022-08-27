import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { Biconditional, xnor } from './biconditional'

describe('xnor', () => {
  it('returns true when given two true things', () => {
    expectWriter(
      xnor(boolean(true), boolean(true))
    )(
      boolean(true),
      [[boolean(true), boolean(true)], 'biconditional identity']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriter(
      xnor(boolean(false), boolean(true))
    )(
      boolean(false),
      [[boolean(false), boolean(true)], 'biconditional identity']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriter(
      xnor(boolean(true), boolean(false))
    )(
      boolean(false),
      [[boolean(true), boolean(false)], 'biconditional identity']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriter(
      xnor(boolean(false), boolean(false))
    )(
      boolean(true),
      [[boolean(false), boolean(false)], 'biconditional complementation'],
      [boolean(false), 'boolean complement']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriter(
      xnor(boolean(true), variable('x'))
    )(
      variable('x'),
      [[boolean(true), variable('x')], 'biconditional identity']
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriter(
      xnor(variable('x'), boolean(true))
    )(
      variable('x'),
      [[variable('x'), boolean(true)], 'biconditional identity']
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectWriter(
      xnor(boolean(false), variable('x'))
    )(
      not(variable('x')),
      [[boolean(false), variable('x')], 'biconditional complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectWriter(
      xnor(variable('x'), boolean(false))
    )(
      not(variable('x')),
      [[variable('x'), boolean(false)], 'biconditional complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns true if the operands are equal', () => {
    expectWriter(
      xnor(variable('x'), variable('x'))
    )(
      boolean(true),
      [[variable('x'), variable('x')], 'biconditional annihilator']
    )
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
