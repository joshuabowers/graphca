import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { JointDenial, nor } from './jointDenial'

describe('nor', () => {
  it('returns false when given two true things', () => {
    expectWriter(
      nor(boolean(true), boolean(true))
    )(
      boolean(false),
      [[boolean(true), boolean(true)], 'joint denial annihilator']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriter(
      nor(boolean(false), boolean(true))
    )(
      boolean(false),
      [[boolean(false), boolean(true)], 'joint denial annihilator']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriter(
      nor(boolean(true), boolean(false))
    )(
      boolean(false),
      [[boolean(true), boolean(false)], 'joint denial annihilator']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriter(
      nor(boolean(false), boolean(false))
    )(
      boolean(true),
      [[boolean(false), boolean(false)], 'joint denial complementation'],
      [boolean(false), 'boolean complement']
    )
  })

  it('returns the complement of the left operand if the right is false', () => {
    expectWriter(
      nor(variable('x'), boolean(false))
    )(
      not(variable('x')),
      [[variable('x'), boolean(false)], 'joint denial complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns the complement of the right operand if the left is false', () => {
    expectWriter(
      nor(boolean(false), variable('x'))
    )(
      not(variable('x')),
      [[boolean(false), variable('x')], 'joint denial complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns false if the right operand is true', () => {
    expectWriter(
      nor(variable('x'), boolean(true))
    )(
      boolean(false),
      [[variable('x'), boolean(true)], 'joint denial annihilator']
    )
  })

  it('returns false if the left operand is true', () => {
    expectWriter(
      nor(boolean(true), variable('x'))
    )(
      boolean(false),
      [[boolean(true), variable('x')], 'joint denial annihilator']
    )
  })

  it('returns the complement of the left operand if left is equivalent to right', () => {
    expectWriter(
      nor(variable('x'), variable('x'))
    )(
      not(variable('x')),
      [[variable('x'), variable('x')], 'joint denial complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns a conjunction of mutually complemented operands', () => {
    expectWriter(
      nor(not(variable('x')), not(variable('y')))
    )(
      and(variable('x'), variable('y')),
      [variable('x'), 'complement'],
      [variable('y'), 'complement'],
      [[not(variable('x')), not(variable('y'))], 'De Morgan'],
      [[variable('x'), variable('y')], 'conjunction']
    )
  })

  it('returns false if the right operand is the complement of the left', () => {
    expectWriter(
      nor(variable('x'), not(variable('x')))
    )(
      boolean(false),
      [variable('x'), 'complement'],
      [[variable('x'), not(variable('x'))], 'joint denial annihilator']
    )
  })

  it('returns false if the left operand is the complement of the right', () => {
    expectWriter(
      nor(not(variable('x')), variable('x'))
    )(
      boolean(false),
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('x')], 'joint denial annihilator']
    )
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
