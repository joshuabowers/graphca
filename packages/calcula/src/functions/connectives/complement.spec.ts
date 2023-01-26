import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
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
import { Unicode } from '../../Unicode'

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
      ['5', '5', 'given primitive'],
      [
        `${Unicode.not}(5)`,
        'false',
        'real complement'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('yields true for a real value of zero', () => {
    expectWriterTreeNode(
      not(real(0)),
      boolean(true)
    )(
      ['0', '0', 'given primitive'],
      [
        `${Unicode.not}(0)`,
        'true',
        'real complement'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('yields false for non-zero complex inputs', () => {
    expectWriterTreeNode(
      not(complex([1, 0])),
      boolean(false)
    )(
      [`1+0${Unicode.i}`, `1+0${Unicode.i}`, 'given primitive'],
      [
        `${Unicode.not}(1+0${Unicode.i})`,
        'false',
        'complex complement'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('yields true for complex 0', () => {
    expectWriterTreeNode(
      not(complex([0, 0])),
      boolean(true)
    )(
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive'],
      [
        `${Unicode.not}(0+0${Unicode.i})`,
        'true',
        'complex complement'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('yields false for a true input', () => {
    expectWriterTreeNode(
      not(boolean(true)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      [
        `${Unicode.not}(true)`,
        'false',
        'boolean complement'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('yields true for a false input', () => {
    expectWriterTreeNode(
      not(boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      [
        `${Unicode.not}(false)`,
        'true',
        'boolean complement'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('yields a logical complement for variable input', () => {
    expectWriterTreeNode(
      not(variable('x')),
      $not(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('rewrites double negations as the inner expression', () => {
    expectWriterTreeNode(
      not(not(variable('x'))),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      [
        `${Unicode.not}(${Unicode.not}(x))`,
        'x',
        'double complement'
      ]
    )
  })

  it('returns an alternative denial when given a conjunction', () => {
    expectWriterTreeNode(
      not(and(variable('x'), variable('y'))),
      nand(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.and} y`,
        `(x${Unicode.and}y)`,
        'conjunction'
      ],
      [
        `${Unicode.not}((x${Unicode.and}y))`,
        `x ${Unicode.nand} y`,
        'complement of conjunction'
      ],
      [
        `x ${Unicode.nand} y`,
        `(x${Unicode.nand}y)`,
        'alternative denial'
      ]
    )
  })

  it('returns a conjunction if given an alternative denial', () => {
    expectWriterTreeNode(
      not(nand(variable('x'), variable('y'))),
      and(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.nand} y`,
        `(x${Unicode.nand}y)`,
        'alternative denial'
      ],
      [
        `${Unicode.not}((x${Unicode.nand}y))`,
        `x ${Unicode.and} y`,
        'complement of alternative denial'
      ],
      [
        `x ${Unicode.and} y`,
        `(x${Unicode.and}y)`,
        'conjunction'
      ]
    )
  })

  it('returns a joint denial if given a disjunction', () => {
    expectWriterTreeNode(
      not(or(variable('x'), variable('y'))),
      nor(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.or} y`,
        `(x${Unicode.or}y)`,
        'disjunction'
      ],
      [
        `${Unicode.not}((x${Unicode.or}y))`,
        `x ${Unicode.nor} y`,
        'complement of disjunction'
      ],
      [
        `x ${Unicode.nor} y`,
        `(x${Unicode.nor}y)`,
        'joint denial'
      ]
    )
  })

  it('returns a disjunction if given a joint denial', () => {
    expectWriterTreeNode(
      not(nor(variable('x'), variable('y'))),
      or(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.nor} y`,
        `(x${Unicode.nor}y)`,
        'joint denial'
      ],
      [
        `${Unicode.not}((x${Unicode.nor}y))`,
        `x ${Unicode.or} y`,
        'complement of joint denial'
      ],
      [
        `x ${Unicode.or} y`,
        `(x${Unicode.or}y)`,
        'disjunction'
      ]
    )
  })

  it('returns a biconditional if given an exclusive disjunction', () => {
    expectWriterTreeNode(
      not(xor(variable('x'), variable('y'))),
      xnor(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.xor} y`,
        `(x${Unicode.xor}y)`,
        'exclusive disjunction'
      ],
      [
        `${Unicode.not}((x${Unicode.xor}y))`,
        `x ${Unicode.xnor} y`,
        'complement of exclusive disjunction'
      ],
      [
        `x ${Unicode.xnor} y`,
        `(x${Unicode.xnor}y)`,
        'biconditional'
      ]
    )
  })

  it('returns a conjunction if given an implication', () => {
    expectWriterTreeNode(
      not(implies(variable('x'), variable('y'))),
      and(variable('x'), not(variable('y')))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.implies} y`,
        `(x${Unicode.implies}y)`,
        'implication'
      ],
      [
        `${Unicode.not}((x${Unicode.implies}y))`,
        `x ${Unicode.and} ${Unicode.not}(y)`,
        'complement of implication'
      ],
      [
        `${Unicode.not}(y)`,
        `${Unicode.not}(y)`,
        'complement'
      ],
      [
        `x ${Unicode.and} ${Unicode.not}(y)`,
        `(x${Unicode.and}${Unicode.not}(y))`,
        'conjunction'
      ]
    )
  })

  it('returns an exclusive disjunction if given a biconditional', () => {
    expectWriterTreeNode(
      not(xnor(variable('x'), variable('y'))),
      xor(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.xnor} y`,
        `(x${Unicode.xnor}y)`,
        'biconditional'
      ],
      [
        `${Unicode.not}((x${Unicode.xnor}y))`,
        `x ${Unicode.xor} y`,
        'complement of biconditional'
      ],
      [
        `x ${Unicode.xor} y`,
        `(x${Unicode.xor}y)`,
        'exclusive disjunction'
      ]
    )
  })

  it('returns a conjunction if given a converse implication', () => {
    expectWriterTreeNode(
      not(converse(variable('x'), variable('y'))),
      and(not(variable('x')), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.converse} y`,
        `(x${Unicode.converse}y)`,
        'converse implication'
      ],
      [
        `${Unicode.not}((x${Unicode.converse}y))`,
        `${Unicode.not}(x) ${Unicode.and} y`,
        'complement of converse implication'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      [
        `${Unicode.not}(x) ${Unicode.and} y`,
        `(${Unicode.not}(x)${Unicode.and}y)`,
        'conjunction'
      ]
    )
  })
})
