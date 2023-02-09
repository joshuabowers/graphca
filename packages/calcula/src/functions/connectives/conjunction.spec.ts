import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  realOps, complexOps, booleanOps, variableOps,
  andOps, orOps, notOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { and, $and } from './conjunction'

describe('$and', () => {
  it('generates a Conjunction for a pair of TreeNode inputs', () => {
    expect(
      $and(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.and,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('and', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      and(boolean(true), boolean(true)),
      boolean(true)
    )(
      ...andOps(
        'conjunctive identity',
        booleanOps('true'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      and(boolean(false), boolean(true)),
      boolean(false)
    )(
      ...andOps(
        'conjunctive identity',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      and(boolean(true), boolean(false)),
      boolean(false)
    )(
      ...andOps(
        'conjunctive identity',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriterTreeNode(
      and(boolean(false), boolean(false)),
      boolean(false)
    )(
      ...andOps(
        'conjunctive annihilator',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriterTreeNode(
      and(real(5), real(0)),
      boolean(false)
    )(
      ...andOps(
        'real conjunction',
        realOps('5'),
        realOps('0'),
        booleanOps('false')
      )
    )
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expectWriterTreeNode(
      and(complex([5,0]), complex([0,0])),
      boolean(false)
    )(
      ...andOps(
        'complex conjunction',
        complexOps('5', '0'),
        complexOps('0', '0'),
        booleanOps('false')
      )
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriterTreeNode(
      and(variable('x'), boolean(true)),
      variable('x')
    )(
      ...andOps(
        'conjunctive identity',
        variableOps('x'),
        booleanOps('true'),
        variableOps('x')
      )
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      and(boolean(true), variable('x')),
      variable('x')
    )(
      ...andOps(
        'conjunctive identity',
        booleanOps('true'),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns the false if the right operand is false', () => {
    expectWriterTreeNode(
      and(variable('x'), boolean(false)),
      boolean(false)
    )(
      ...andOps(
        'conjunctive annihilator',
        variableOps('x'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns false if the left operand is false', () => {
    expectWriterTreeNode(
      and(boolean(false), variable('x')),
      boolean(false)
    )(
      ...andOps(
        'conjunctive annihilator',
        booleanOps('false'),
        variableOps('x'),
        booleanOps('false')
      )
    )
  })

  it('returns the left operand if left equivalent to right', () => {
    expectWriterTreeNode(
      and(variable('x'), variable('x')),
      variable('x')
    )(
      ...andOps(
        'conjunctive idempotency',
        variableOps('x'),
        variableOps('x'),
        variableOps('x')
      )
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
    expectWriterTreeNode(
      and(variable('x'), or(variable('x'), variable('y'))),
      variable('x')
    )(
      ...andOps(
        'conjunctive absorption',
        variableOps('x'),
        orOps(
          'created disjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        variableOps('x')
      )
    )
    expectWriterTreeNode(
      and(variable('x'), or(variable('y'), variable('x'))),
      variable('x')
    )(
      ...andOps(
        'conjunctive absorption',
        variableOps('x'),
        orOps(
          'created disjunction',
          variableOps('y'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })

  it('returns the right operand if the left is a Disjunction of the right', () => {
    expectWriterTreeNode(
      and(or(variable('x'), variable('y')), variable('x')),
      variable('x')
    )(
      ...andOps(
        'conjunctive absorption',
        orOps(
          'created disjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        variableOps('x'),
        variableOps('x')
      )
    )
    expectWriterTreeNode(
      and(or(variable('y'), variable('x')), variable('x')),
      variable('x')
    )(
      ...andOps(
        'conjunctive absorption',
        orOps(
          'created disjunction',
          variableOps('y'),
          variableOps('x'),
          []
        ),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns false if the right operand is the negation of the left', () => {
    expectWriterTreeNode(
      and(variable('x'), not(variable('x'))),
      boolean(false)
    )(
      ...andOps(
        'conjunctive contradiction',
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        booleanOps('false')
      )
    )
  })

  it('returns false if the left operand is the negation of the right', () => {
    expectWriterTreeNode(
      and(not(variable('x')), variable('x')),
      boolean(false)
    )(
      ...andOps(
        'conjunctive contradiction',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        variableOps('x'),
        booleanOps('false')
      )
    )
  })

  it('returns a Conjunction on variable input', () => {
    expectWriterTreeNode(
      and(variable('x'), variable('y')),
      $and(variable('x'), variable('y'))[0]
    )(
      ...andOps(
        'created conjunction',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
