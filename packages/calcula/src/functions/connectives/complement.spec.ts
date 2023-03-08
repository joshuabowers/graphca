import { unit } from '../../monads/writer'
import { expectToEqualWithSnapshot } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
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

describe('$not', () => {
  it('generates a Complement for a TreeNode input', () => {
    expect(
      $not(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.connective, species: Species.not,
      expression: unit(variable('x').value)
    })
  })
})

describe('not', () => {
  it('yields false for non-zero real inputs', () => {
    expectToEqualWithSnapshot(
      not(real(5)),
      boolean(false)
    )
  })

  it('yields true for a real value of zero', () => {
    expectToEqualWithSnapshot(
      not(real(0)),
      boolean(true)
    )
  })

  it('yields false for non-zero complex inputs', () => {
    expectToEqualWithSnapshot(
      not(complex(1, 0)),
      boolean(false)
    )
  })

  it('yields true for complex 0', () => {
    expectToEqualWithSnapshot(
      not(complex(0, 0)),
      boolean(true)
    )
  })

  it('yields false for a true input', () => {
    expectToEqualWithSnapshot(
      not(boolean(true)),
      boolean(false)
    )
  })

  it('yields true for a false input', () => {
    expectToEqualWithSnapshot(
      not(boolean(false)),
      boolean(true)
    )
  })

  it('yields a logical complement for variable input', () => {
    expectToEqualWithSnapshot(
      not(variable('x')),
      $not(variable('x'))[0]
    )
  })

  it('rewrites double negations as the inner expression', () => {
    expectToEqualWithSnapshot(
      not(not(variable('x'))),
      variable('x')
    )
  })

  it('returns an alternative denial when given a conjunction', () => {
    expectToEqualWithSnapshot(
      not(and(variable('x'), variable('y'))),
      nand(variable('x'), variable('y'))
    )
  })

  it('returns a conjunction if given an alternative denial', () => {
    expectToEqualWithSnapshot(
      not(nand(variable('x'), variable('y'))),
      and(variable('x'), variable('y'))
    )
  })

  it('returns a joint denial if given a disjunction', () => {
    expectToEqualWithSnapshot(
      not(or(variable('x'), variable('y'))),
      nor(variable('x'), variable('y'))
    )
  })

  it('returns a disjunction if given a joint denial', () => {
    expectToEqualWithSnapshot(
      not(nor(variable('x'), variable('y'))),
      or(variable('x'), variable('y'))
    )
  })

  it('returns a biconditional if given an exclusive disjunction', () => {
    expectToEqualWithSnapshot(
      not(xor(variable('x'), variable('y'))),
      xnor(variable('x'), variable('y'))
    )
  })

  it('returns a conjunction if given an implication', () => {
    expectToEqualWithSnapshot(
      not(implies(variable('x'), variable('y'))),
      and(variable('x'), not(variable('y')))
    )
  })

  it('returns an exclusive disjunction if given a biconditional', () => {
    expectToEqualWithSnapshot(
      not(xnor(variable('x'), variable('y'))),
      xor(variable('x'), variable('y'))
    )
  })

  it('returns a conjunction if given a converse implication', () => {
    expectToEqualWithSnapshot(
      not(converse(variable('x'), variable('y'))),
      and(not(variable('x')), variable('y'))
    )
  })
})
