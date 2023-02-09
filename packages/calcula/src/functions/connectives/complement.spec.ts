import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  realOps, complexOps, booleanOps, notOps, andOps, orOps, xorOps,
  impliesOps, nandOps, norOps, xnorOps, converseOps, variableOps
} from '../../utility/expectations'
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
    expectWriterTreeNode(
      not(real(5)),
      boolean(false)
    )(
      ...notOps(
        'real complement',
        realOps('5'),
        booleanOps('false')
      )
    )
  })

  it('yields true for a real value of zero', () => {
    expectWriterTreeNode(
      not(real(0)),
      boolean(true)
    )(
      ...notOps(
        'real complement',
        realOps('0'),
        booleanOps('true')
      )
    )
  })

  it('yields false for non-zero complex inputs', () => {
    expectWriterTreeNode(
      not(complex([1, 0])),
      boolean(false)
    )(
      ...notOps(
        'complex complement',
        complexOps('1', '0'),
        booleanOps('false')
      )
    )
  })

  it('yields true for complex 0', () => {
    expectWriterTreeNode(
      not(complex([0, 0])),
      boolean(true)
    )(
      ...notOps(
        'complex complement',
        complexOps('0', '0'),
        booleanOps('true')
      )
    )
  })

  it('yields false for a true input', () => {
    expectWriterTreeNode(
      not(boolean(true)),
      boolean(false)
    )(
      ...notOps(
        'boolean complement',
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('yields true for a false input', () => {
    expectWriterTreeNode(
      not(boolean(false)),
      boolean(true)
    )(
      ...notOps(
        'boolean complement', 
        booleanOps('false'),
        booleanOps('true')
      ) 
    )
  })

  it('yields a logical complement for variable input', () => {
    expectWriterTreeNode(
      not(variable('x')),
      $not(variable('x'))[0]
    )(
      ...notOps(
        'created complement',
        variableOps('x'),
        []
      )
    )
  })

  it('rewrites double negations as the inner expression', () => {
    expectWriterTreeNode(
      not(not(variable('x'))),
      variable('x')
    )(
      ...notOps(
        'double complement',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })

  it('returns an alternative denial when given a conjunction', () => {
    expectWriterTreeNode(
      not(and(variable('x'), variable('y'))),
      nand(variable('x'), variable('y'))
    )(
      ...notOps(
        'complement of conjunction',
        andOps(
          'created conjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        nandOps(
          'created alternative denial',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a conjunction if given an alternative denial', () => {
    expectWriterTreeNode(
      not(nand(variable('x'), variable('y'))),
      and(variable('x'), variable('y'))
    )(
      ...notOps(
        'complement of alternative denial',
        nandOps(
          'created alternative denial',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        andOps(
          'created conjunction',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a joint denial if given a disjunction', () => {
    expectWriterTreeNode(
      not(or(variable('x'), variable('y'))),
      nor(variable('x'), variable('y'))
    )(
      ...notOps(
        'complement of disjunction',
        orOps(
          'created disjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        norOps(
          'created joint denial',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a disjunction if given a joint denial', () => {
    expectWriterTreeNode(
      not(nor(variable('x'), variable('y'))),
      or(variable('x'), variable('y'))
    )(
      ...notOps(
        'complement of joint denial',
        norOps(
          'created joint denial',
          variableOps('x'),
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

  it('returns a biconditional if given an exclusive disjunction', () => {
    expectWriterTreeNode(
      not(xor(variable('x'), variable('y'))),
      xnor(variable('x'), variable('y'))
    )(
      ...notOps(
        'complement of exclusive disjunction',
        xorOps(
          'created exclusive disjunction',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        xnorOps(
          'created biconditional',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a conjunction if given an implication', () => {
    expectWriterTreeNode(
      not(implies(variable('x'), variable('y'))),
      and(variable('x'), not(variable('y')))
    )(
      ...notOps(
        'complement of implication',
        impliesOps(
          'created implication',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        andOps(
          'created conjunction',
          variableOps('x'),
          notOps(
            'created complement',
            variableOps('y'),
            []
          ),
          []
        )
      )
    )
  })

  it('returns an exclusive disjunction if given a biconditional', () => {
    expectWriterTreeNode(
      not(xnor(variable('x'), variable('y'))),
      xor(variable('x'), variable('y'))
    )(
      ...notOps(
        'complement of biconditional',
        xnorOps(
          'created biconditional',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        xorOps(
          'created exclusive disjunction',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns a conjunction if given a converse implication', () => {
    expectWriterTreeNode(
      not(converse(variable('x'), variable('y'))),
      and(not(variable('x')), variable('y'))
    )(
      ...notOps(
        'complement of converse implication',
        converseOps(
          'created converse implication',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        andOps(
          'created conjunction',
          notOps(
            'created complement',
            variableOps('x'),
            []
          ),
          variableOps('y'),
          []
        )
      )
    )
  })
})
