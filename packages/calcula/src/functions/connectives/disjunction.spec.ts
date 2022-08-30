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
    expectWriter(
      or(boolean(true), boolean(true))
    )(
      boolean(true),
      [[boolean(true), boolean(true)], 'disjunctive annihilator']
    )
  })

  it('returns true if the left argument is true', () => {
    expectWriter(
      or(boolean(true), boolean(false))
    )(
      boolean(true),
      [[boolean(true), boolean(false)], 'disjunctive identity']
    )
  })

  it('returns true if the right argument is true', () => {
    expectWriter(
      or(boolean(false), boolean(true))
    )(
      boolean(true),
      [[boolean(false), boolean(true)], 'disjunctive identity']
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriter(
      or(boolean(false), boolean(false))
    )(
      boolean(false),
      [[boolean(false), boolean(false)], 'disjunctive identity']
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriter(
      or(real(5), real(0))
    )(
      boolean(true),
      [[real(5), real(0)], 'real disjunction']
    )
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expectWriter(
      or(complex([5,0]), complex([0,0]))
    )(
      boolean(true),
      [[complex([5, 0]), complex([0, 0])], 'complex disjunction']
    )
  })

  it('returns the left operand if the right is false', () => {
    expectWriter(
      or(variable('x'), boolean(false))
    )(
      variable('x'),
      [[variable('x'), boolean(false)], 'disjunctive identity']
    )
  })

  it('returns the right operand if the left is false', () => {
    expectWriter(
      or(boolean(false), variable('x'))
    )(
      variable('x'),
      [[boolean(false), variable('x')], 'disjunctive identity']
    )
  })

  it('returns true if the right operand is true', () => {
    expectWriter(
      or(variable('x'), boolean(true))
    )(
      boolean(true),
      [[variable('x'), boolean(true)], 'disjunctive annihilator']
    )
  })

  it('returns true if the left operand is true', () => {
    expectWriter(
      or(boolean(true), variable('x'))
    )(
      boolean(true),
      [[boolean(true), variable('x')], 'disjunctive annihilator']
    )
  })

  it('returns the left operand if left is equivalent to right', () => {
    expectWriter(
      or(variable('x'), variable('x'))
    )(
      variable('x'),
      [[variable('x'), variable('x')], 'disjunctive idempotency']
    )
  })

  it('returns the left operand if the right is a Conjunction of the left', () => {
    expectWriter(
      or(variable('x'), and(variable('x'), variable('y')))
    )(
      variable('x'),
      [[variable('x'), variable('y')], 'conjunction'],
      [[variable('x'), and(variable('x'), variable('y'))], 'disjunctive absorption']
    )
    expectWriter(
      or(variable('x'), and(variable('y'), variable('x')))
    )(
      variable('x'),
      [[variable('y'), variable('x')], 'conjunction'],
      [[variable('x'), and(variable('y'), variable('x'))], 'disjunctive absorption']
    )
  })

  it('returns the right operand if the left is a Conjunction of the right', () => {
    expectWriter(
      or(and(variable('x'), variable('y')), variable('x'))
    )(
      variable('x'),
      [[variable('x'), variable('y')], 'conjunction'],
      [[and(variable('x'), variable('y')), variable('x')], 'disjunctive absorption']
    )
    expectWriter(
      or(and(variable('y'), variable('x')), variable('x'))
    )(
      variable('x'),
      [[variable('y'), variable('x')], 'conjunction'],
      [[and(variable('y'), variable('x')), variable('x')], 'disjunctive absorption']
    )
  })

  it('returns true if the right operand is the negation of the left', () => {
    expectWriter(
      or(variable('x'), not(variable('x')))
    )(
      boolean(true),
      [variable('x'), 'complement'],
      [[variable('x'), not(variable('x'))], 'disjunctive complementation']
    )
  })

  it('returns true if the left operand is the negation of the right', () => {
    expectWriter(
      or(not(variable('x')), variable('x'))
    )(
      boolean(true),
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('x')], 'disjunctive complementation']
    )
  })

  it('returns an implication if the left operand is a complement', () => {
    expectWriter(
      or(not(variable('x')), variable('y'))
    )(
      implies(variable('x'), variable('y')),
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('y')], 'disjunctive implication'],
      [[variable('x'), variable('y')], 'implication']
    )
  })

  it('returns a converse if the right operand is a complement', () => {
    expectWriter(
      or(variable('x'), not(variable('y')))
    )(
      converse(variable('x'), variable('y')),
      [variable('y'), 'complement'],
      [[variable('x'), not(variable('y'))], 'disjunctive converse implication'],
      [[variable('x'), variable('y')], 'converse implication']
    )
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
