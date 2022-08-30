import { expectWriter } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { implies } from './implication'
import { AlternativeDenial, nand } from './alternativeDenial'

describe('nand', () => {
  it('returns false when given two true things', () => {
    expectWriter(
      nand(boolean(true), boolean(true))
    )(
      boolean(false),
      [[boolean(true), boolean(true)], 'alternative deniable complementation'],
      [boolean(true), 'boolean complement']
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriter(
      nand(boolean(false), boolean(true))
    )(
      boolean(true),
      [[boolean(false), boolean(true)], 'alternative deniable complementation'],
      [boolean(false), 'boolean complement']
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriter(
      nand(boolean(true), boolean(false))
    )(
      boolean(true),
      [[boolean(true), boolean(false)], 'alternative deniable complementation'],
      [boolean(false), 'boolean complement']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriter(
      nand(boolean(false), boolean(false))
    )(
      boolean(true),
      [[boolean(false), boolean(false)], 'alternative deniable annihilator']
    )
  })

  it('returns the complement of left operand if the right is true', () => {
    expectWriter(
      nand(variable('x'), boolean(true))
    )(
      not(variable('x')),
      [[variable('x'), boolean(true)], 'alternative deniable complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriter(
      nand(boolean(true), variable('x'))
    )(
      not(variable('x')),
      [[boolean(true), variable('x')], 'alternative deniable complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns the true if the right operand is false', () => {
    expectWriter(
      nand(variable('x'), boolean(false))
    )(
      boolean(true),
      [[variable('x'), boolean(false)], 'alternative deniable annihilator']
    )
  })

  it('returns true if the left operand is false', () => {
    expectWriter(
      nand(boolean(false), variable('x'))
    )(
      boolean(true),
      [[boolean(false), variable('x')], 'alternative deniable annihilator']
    )
  })

  it('returns the complement of the left operand if left equivalent to right', () => {
    expectWriter(
      nand(variable('x'), variable('x'))
    )(
      not(variable('x')),
      [[variable('x'), variable('x')], 'alternative deniable complementation'],
      [variable('x'), 'complement']
    )
  })

  it('returns an implication if the right operand is a nand of the left', () => {
    expectWriter(
      nand(variable('x'), nand(variable('x'), variable('y')))
    )(
      implies(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'alternative denial'],
      [[variable('x'), nand(variable('x'), variable('y'))], 'alternative deniable implication'],
      [[variable('x'), variable('y')], 'implication']
    )
    expectWriter(
      nand(variable('x'), nand(variable('y'), variable('x')))
    )(
      implies(variable('x'), variable('y')),
      [[variable('y'), variable('x')], 'alternative denial'],
      [[variable('x'), nand(variable('y'), variable('x'))], 'alternative deniable implication'],
      [[variable('x'), variable('y')], 'implication']
    )
  })

  it('returns a disjunction of mutually complemented operands', () => {
    expectWriter(
      nand(not(variable('x')), not(variable('y')))
    )(
      or(variable('x'), variable('y')),
      [variable('x'), 'complement'],
      [variable('y'), 'complement'],
      [[not(variable('x')), not(variable('y'))], 'De Morgan'],
      [[variable('x'), variable('y')], 'disjunction']
    )
  })

  it('returns true if the right operand is the complement of the left', () => {
    expectWriter(
      nand(variable('x'), not(variable('x')))
    )(
      boolean(true),
      [variable('x'), 'complement'],
      [[variable('x'), not(variable('x'))], 'alternative deniable annihilator']
    )
  })

  it('returns true if the left operand is the complement of the right', () => {
    expectWriter(
      nand(not(variable('x')), variable('x'))
    )(
      boolean(true),
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('x')], 'alternative deniable annihilator']
    )
  })

  it('returns a AlternativeDenial on variable input', () => {
    expectWriter(nand(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.nand,
        left: variable('x'), right: variable('y')
      } as AlternativeDenial,
      [[variable('x').value, variable('y').value], 'alternative denial']
    )
  })
})
