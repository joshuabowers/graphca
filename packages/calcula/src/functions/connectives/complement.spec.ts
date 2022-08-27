import { expectWriter } from '../../utility/expectations'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not, $not } from './complement'
import { and } from './conjunction'
import { or } from './disjunction'
import { xor } from './exclusiveDisjunction'
import { implies } from './implication'
import { nand } from './alternativeDenial'
import { nor } from './jointDenial'
import { xnor } from './biconditional'
import { converse } from './converseImplication'

describe('not', () => {
  it('yields false for non-zero real inputs', () => {
    expectWriter(
      not(real(5))
    )(
      boolean(false),
      [real(5), 'real complement']
    )
  })

  it('yields true for a real value of zero', () => {
    expectWriter(
      not(real(0))
    )(
      boolean(true),
      [real(0), 'real complement']
    )
  })

  it('yields false for non-zero complex inputs', () => {
    expectWriter(
      not(complex([1, 0]))
    )(
      boolean(false),
      [complex([1, 0]), 'complex complement']
    )
  })

  it('yields true for complex 0', () => {
    expectWriter(
      not(complex([0, 0]))
    )(
      boolean(true),
      [complex([0, 0]), 'complex complement']
    )
  })

  it('yields false for a true input', () => {
    expectWriter(
      not(boolean(true))
    )(
      boolean(false),
      [boolean(true), 'boolean complement']
    )
  })

  it('yields true for a false input', () => {
    expectWriter(
      not(boolean(false))
    )(
      boolean(true),
      [boolean(false), 'boolean complement']
    )
  })

  it('yields a logical complement for variable input', () => {
    expectWriter(
      not(variable('x'))
    )(
      $not(variable('x'))[0],
      [variable('x'), 'complement']
    )
  })

  it('rewrites double negations as the inner expression', () => {
    expectWriter(
      not(not(variable('x')))
    )(
      variable('x'),
      [variable('x'), 'complement'],
      [not(variable('x')), 'double complement']
    )
  })

  it('returns an alternative denial when given a conjunction', () => {
    expectWriter(
      not(and(variable('x'), variable('y')))
    )(
      nand(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'conjunction'],
      [and(variable('x'), variable('y')), 'complement of conjunction'],
      [[variable('x'), variable('y')], 'alternative denial']
    )
  })

  it('returns a conjunction if given an alternative denial', () => {
    expectWriter(
      not(nand(variable('x'), variable('y')))
    )(
      and(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'alternative denial'],
      [nand(variable('x'), variable('y')), 'complement of alternative denial'],
      [[variable('x'), variable('y')], 'conjunction']
    )
  })

  it('returns a joint denial if given a disjunction', () => {
    expectWriter(
      not(or(variable('x'), variable('y')))
    )(
      nor(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'disjunction'],
      [or(variable('x'), variable('y')), 'complement of disjunction'],
      [[variable('x'), variable('y')], 'joint denial']
    )
  })

  it('returns a disjunction if given a joint denial', () => {
    expectWriter(
      not(nor(variable('x'), variable('y')))
    )(
      or(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'joint denial'],
      [nor(variable('x'), variable('y')), 'complement of joint denial'],
      [[variable('x'), variable('y')], 'disjunction']
    )
  })

  it('returns a biconditional if given an exclusive disjunction', () => {
    expectWriter(
      not(xor(variable('x'), variable('y')))
    )(
      xnor(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'exclusive disjunction'],
      [xor(variable('x'), variable('y')), 'complement of exclusive disjunction'],
      [[variable('x'), variable('y')], 'biconditional']
    )
  })

  it('returns a conjunction if given an implication', () => {
    expectWriter(
      not(implies(variable('x'), variable('y')))
    )(
      and(variable('x'), not(variable('y'))),
      [[variable('x'), variable('y')], 'implication'],
      [implies(variable('x'), variable('y')), 'complement of implication'],
      [variable('y'), 'complement'],
      [[variable('x'), not(variable('y'))], 'conjunction']
    )
  })

  it('returns an exclusive disjunction if given a biconditional', () => {
    expectWriter(
      not(xnor(variable('x'), variable('y')))
    )(
      xor(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'biconditional'],
      [xnor(variable('x'), variable('y')), 'complement of biconditional'],
      [[variable('x'), variable('y')], 'exclusive disjunction']
    )
  })

  it('returns a conjunction if given a converse implication', () => {
    expectWriter(
      not(converse(variable('x'), variable('y')))
    )(
      and(not(variable('x')), variable('y')),
      [[variable('x'), variable('y')], 'converse implication'],
      [converse(variable('x'), variable('y')), 'complement of converse implication'],
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('y')], 'conjunction']
    )
  })
})
