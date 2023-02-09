import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  booleanOps, variableOps,
  notOps, nandOps, impliesOps, orOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { implies } from './implication'
import { nand, $nand } from './alternativeDenial'
import { Unicode } from '../../Unicode'

describe('$nand', () => {
  it('generates an AlternativeDenial for a pair of TreeNode inputs', () => {
    expect(
      $nand(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.nand,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('nand', () => {
  it('returns false when given two true things', () => {
    expectWriterTreeNode(
      nand(boolean(true), boolean(true)),
      boolean(false)
    )(
      ...nandOps(
        'alternative deniable complementation',
        booleanOps('true'),
        booleanOps('true'),
        notOps(
          'boolean complement',
          booleanOps('true'),
          booleanOps('false')
        )
      )
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriterTreeNode(
      nand(boolean(false), boolean(true)),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable complementation',
        booleanOps('false'),
        booleanOps('true'),
        notOps(
          'boolean complement',
          booleanOps('false'),
          booleanOps('true')
        )
      )
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriterTreeNode(
      nand(boolean(true), boolean(false)),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable complementation',
        booleanOps('true'),
        booleanOps('false'),
        notOps(
          'boolean complement',
          booleanOps('false'),
          booleanOps('true')
        )
      )
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      nand(boolean(false), boolean(false)),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable annihilator',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns the complement of left operand if the right is true', () => {
    expectWriterTreeNode(
      nand(variable('x'), boolean(true)),
      not(variable('x'))
    )(
      ...nandOps(
        'alternative deniable complementation',
        variableOps('x'),
        booleanOps('true'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      nand(boolean(true), variable('x')),
      not(variable('x'))
    )(
      ...nandOps(
        'alternative deniable complementation',
        booleanOps('true'),
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns true if the right operand is false', () => {
    expectWriterTreeNode(
      nand(variable('x'), boolean(false)),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable annihilator',
        variableOps('x'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns true if the left operand is false', () => {
    expectWriterTreeNode(
      nand(boolean(false), variable('x')),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable annihilator',
        booleanOps('false'),
        variableOps('x'),
        booleanOps('true')
      )
    )
  })

  it('returns the complement of the left operand if left equivalent to right', () => {
    expectWriterTreeNode(
      nand(variable('x'), variable('x')),
      not(variable('x'))
    )(
      ...nandOps(
        'alternative deniable complementation',
        variableOps('x'),
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns an implication if the right operand is a nand of the left', () => {
    expectWriterTreeNode(
      nand(variable('x'), nand(variable('x'), variable('y'))),
      implies(variable('x'), variable('y'))
    )(
      ...nandOps(
        'alternative deniable implication',
        variableOps('x'),
        nandOps(
          'created alternative denial',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        impliesOps(
          'created implication',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
    expectWriterTreeNode(
      nand(variable('x'), nand(variable('y'), variable('x'))),
      implies(variable('x'), variable('y'))
    )(
      ...nandOps(
        'alternative deniable implication',
        variableOps('x'),
        nandOps(
          'created alternative denial',
          variableOps('y'),
          variableOps('x'),
          []
        ),
        impliesOps(
          'created implication',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a disjunction of mutually complemented operands', () => {
    expectWriterTreeNode(
      nand(not(variable('x')), not(variable('y'))),
      or(variable('x'), variable('y'))
    )(
      ...nandOps(
        'De Morgan',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        notOps(
          'created complement',
          variableOps('y'),
          []
        ),
        orOps(
          'created disjunction',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns true if the right operand is the complement of the left', () => {
    expectWriterTreeNode(
      nand(variable('x'), not(variable('x'))),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable annihilator',
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        booleanOps('true')
      )
    )
  })

  it('returns true if the left operand is the complement of the right', () => {
    expectWriterTreeNode(
      nand(not(variable('x')), variable('x')),
      boolean(true)
    )(
      ...nandOps(
        'alternative deniable annihilator',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        variableOps('x'),
        booleanOps('true')
      )
    )
  })

  it('returns a AlternativeDenial on variable input', () => {
    expectWriterTreeNode(
      nand(variable('x'), variable('y')),
      $nand(variable('x'), variable('y'))[0]
    )(
      ...nandOps(
        'created alternative denial',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
