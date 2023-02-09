import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  realOps, complexOps, booleanOps, variableOps, orOps, notOps, andOps,
  impliesOps, converseOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'
import { converse } from './converseImplication'
import { or, $or } from './disjunction'

describe('$or', () => {
  it('generates a Disjunction for a pair of TreeNode inputs', () => {
    expect(
      $or(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.or,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('or', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      or(boolean(true), boolean(true)),
      boolean(true)
    )(
      ...orOps(
        'disjunctive annihilator',
        booleanOps('true'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns true if the left argument is true', () => {
    expectWriterTreeNode(
      or(boolean(true), boolean(false)),
      boolean(true)
    )(
      ...orOps(
        'disjunctive identity',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns true if the right argument is true', () => {
    expectWriterTreeNode(
      or(boolean(false), boolean(true)),
      boolean(true)
    )(
      ...orOps(
        'disjunctive identity',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriterTreeNode(
      or(boolean(false), boolean(false)),
      boolean(false)
    )(
      ...orOps(
        'disjunctive identity',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriterTreeNode(
      or(real(5), real(0)),
      boolean(true)
    )(
      ...orOps(
        'real disjunction',
        realOps('5'),
        realOps('0'),
        booleanOps('true')
      )
    )
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expectWriterTreeNode(
      or(complex([5, 0]), complex([0, 0])),
      boolean(true)
    )(
      ...orOps(
        'complex disjunction',
        complexOps('5', '0'),
        complexOps('0', '0'),
        booleanOps('true')
      )
    )
  })

  it('returns the left operand if the right is false', () => {
    expectWriterTreeNode(
      or(variable('x'), boolean(false)),
      variable('x')
    )(
      ...orOps(
        'disjunctive identity',
        variableOps('x'),
        booleanOps('false'),
        variableOps('x')
      )
    )
  })

  it('returns the right operand if the left is false', () => {
    expectWriterTreeNode(
      or(boolean(false), variable('x')),
      variable('x')
    )(
      ...orOps(
        'disjunctive identity',
        booleanOps('false'),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns true if the right operand is true', () => {
    expectWriterTreeNode(
      or(variable('x'), boolean(true)),
      boolean(true)
    )(
      ...orOps(
        'disjunctive annihilator',
        variableOps('x'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns true if the left operand is true', () => {
    expectWriterTreeNode(
      or(boolean(true), variable('x')),
      boolean(true)
    )(
      ...orOps(
        'disjunctive annihilator',
        booleanOps('true'),
        variableOps('x'),
        booleanOps('true')
      )
    )
  })

  it('returns the left operand if left is equivalent to right', () => {
    expectWriterTreeNode(
      or(variable('x'), variable('x')),
      variable('x')
    )(
      ...orOps(
        'disjunctive idempotency',
        variableOps('x'),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns the left operand if the right is a left-child Conjunction of the left', () => {
    expectWriterTreeNode(
      or(variable('x'), and(variable('x'), variable('y'))),
      variable('x')
    )(
      ...orOps(
        'disjunctive absorption',
        variableOps('x'),
        andOps(
          'created conjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        variableOps('x')
      )
    )
  })

  it('returns the left operand if the right is a right-child Conjunction of the left', () => {
    expectWriterTreeNode(
      or(variable('x'), and(variable('y'), variable('x'))),
      variable('x')
    )(
      ...orOps(
        'disjunctive absorption',
        variableOps('x'),
        andOps(
          'created conjunction',
          variableOps('y'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })

  it('returns the right operand if the left is a left-child Conjunction of the right', () => {
    expectWriterTreeNode(
      or(and(variable('x'), variable('y')), variable('x')),
      variable('x')
    )(
      ...orOps(
        'disjunctive absorption',
        andOps(
          'created conjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns the right operand if the left is a right-child Conjunction of the right', () => {
    expectWriterTreeNode(
      or(and(variable('y'), variable('x')), variable('x')),
      variable('x')
    )(
      ...orOps(
        'disjunctive absorption',
        andOps(
          'created conjunction',
          variableOps('y'),
          variableOps('x'),
          []
        ),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns true if the right operand is the negation of the left', () => {
    expectWriterTreeNode(
      or(variable('x'), not(variable('x'))),
      boolean(true)
    )(
      ...orOps(
        'disjunctive complementation',
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

  it('returns true if the left operand is the negation of the right', () => {
    expectWriterTreeNode(
      or(not(variable('x')), variable('x')),
      boolean(true)
    )(
      ...orOps(
        'disjunctive complementation',
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

  it('returns an implication if the left operand is a complement', () => {
    expectWriterTreeNode(
      or(not(variable('x')), variable('y')),
      implies(variable('x'), variable('y'))
    )(
      ...orOps(
        'disjunctive implication',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        variableOps('y'),
        impliesOps(
          'created implication',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a converse if the right operand is a complement', () => {
    expectWriterTreeNode(
      or(variable('x'), not(variable('y'))),
      converse(variable('x'), variable('y'))
    )(
      ...orOps(
        'disjunctive converse implication',
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('y'),
          []
        ),
        converseOps(
          'created converse implication',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a Disjunction on variable input', () => {
    expectWriterTreeNode(
      or(variable('x'), variable('y')),
      $or(variable('x'), variable('y'))[0]
    )(
      ...orOps(
        'created disjunction',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
