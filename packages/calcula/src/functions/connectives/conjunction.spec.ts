import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { Conjunction, and } from './conjunction'

describe('and', () => {
  it('returns true when given two true things', () => {
    expectWriter(
      and(boolean(true), boolean(true))
    )(
      boolean(true),
      [[boolean(true), boolean(true)], 'conjunctive identity']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriter(
      and(boolean(false), boolean(true))
    )(
      boolean(false),
      [[boolean(false), boolean(true)], 'conjunctive identity']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriter(
      and(boolean(true), boolean(false))
    )(
      boolean(false),
      [[boolean(true), boolean(false)], 'conjunctive identity']
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriter(
      and(boolean(false), boolean(false))
    )(
      boolean(false),
      [[boolean(false), boolean(false)], 'conjunctive annihilator']
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriter(
      and(real(5), real(0))
    )(
      boolean(false),
      [[real(5), real(0)], 'real conjunction']
    )
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expectWriter(
      and(complex([5,0]), complex([0,0]))
    )(
      boolean(false),
      [[complex([5, 0]), complex([0, 0])], 'complex conjunction']
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriter(
      and(variable('x'), boolean(true))
    )(
      variable('x'),
      [[variable('x'), boolean(true)], 'conjunctive identity']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriter(
      and(boolean(true), variable('x'))
    )(
      variable('x'),
      [[boolean(true), variable('x')], 'conjunctive identity']
    )
  })

  it('returns the false if the right operand is false', () => {
    expectWriter(
      and(variable('x'), boolean(false))
    )(
      boolean(false),
      [[variable('x'), boolean(false)], 'conjunctive annihilator']
    )
  })

  it('returns false if the left operand is false', () => {
    expectWriter(
      and(boolean(false), variable('x'))
    )(
      boolean(false),
      [[boolean(false), variable('x')], 'conjunctive annihilator']
    )
  })

  it('returns the left operand if left equivalent to right', () => {
    expectWriter(
      and(variable('x'), variable('x'))
    )(
      variable('x'),
      [[variable('x'), variable('x')], 'conjunctive idempotency']
    )
  })

  // See (e.g.): https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
  // x | y | x or y | x and (x or y) | x and x | x and y | (x and x) or (x and y)
  // ----------------------------------------------------------------------------
  // F | F | F      | F              | F       | F       | F 
  // F | T | T      | F              | F       | F       | F
  // T | F | T      | T              | T       | F       | T
  // T | T | T      | T              | T       | T       | T
  it('returns the left operand if the right is a Disjunction of the left', () => {
    expectWriter(
      and(variable('x'), or(variable('x'), variable('y')))
    )(
      variable('x'),
      [[variable('x'), variable('y')], 'disjunction'],
      [[variable('x'), or(variable('x'), variable('y'))], 'conjunctive absorption']
    )
    expectWriter(
      and(variable('x'), or(variable('y'), variable('x')))
    )(
      variable('x'),
      [[variable('y'), variable('x')], 'disjunction'],
      [[variable('x'), or(variable('y'), variable('x'))], 'conjunctive absorption']
    )
  })

  it('returns the right operand if the left is a Disjunction of the right', () => {
    expectWriter(
      and(or(variable('x'), variable('y')), variable('x'))
    )(
      variable('x'),
      [[variable('x'), variable('y')], 'disjunction'],
      [[or(variable('x'), variable('y')), variable('x')], 'conjunctive absorption']
    )
    expectWriter(
      and(or(variable('y'), variable('x')), variable('x'))
    )(
      variable('x'),
      [[variable('y'), variable('x')], 'disjunction'],
      [[or(variable('y'), variable('x')), variable('x')], 'conjunctive absorption']
    )
  })

  it('returns false if the right operand is the negation of the left', () => {
    expectWriter(
      and(variable('x'), not(variable('x')))
    )(
      boolean(false),
      [variable('x'), 'complement'],
      [[variable('x'), not(variable('x'))], 'contradiction']
    )
  })

  it('returns false if the left operand is the negation of the right', () => {
    expectWriter(
      and(not(variable('x')), variable('x'))
    )(
      boolean(false),
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('x')], 'contradiction']
    )
  })

  it('returns a Conjunction on variable input', () => {
    expectWriter(and(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.and,
        left: variable('x'), right: variable('y')
      } as Conjunction,
      [[variable('x').value, variable('y').value], 'conjunction']
    )
  })
})
