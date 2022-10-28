import { unit } from '../monads/writer'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { raise } from '../arithmetic'
import { log, lb, ln, lg, $log } from './logarithmic'
import { Unicode } from '../Unicode'

describe('$log', () => {
  it('generates a Logarithm from two TreeNode parameters', () => {
    expect(
      $log(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.logarithmic, species: Species.log,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('log', () => {
  it('calculates the real log of a real value', () => {
    expectWriterTreeNode(
      log(real(16), real(256)),
      real(2)
    )(
      ['16', '16', 'given primitive'],
      ['256', '256', 'given primitive'],
      ['log(16, 256)', '2', 'real logarithm'],
      ['2', '2', 'given primitive']
    )
  })

  it('calculates the complex log of a complex value', () => {
    expectCloseTo(log(complex([0, 1]), complex([1, 2])), complex([0.7048327646991, -0.5122999987267]), 10)
  })

  it('calculates a complex log of a real value', () => {
    expectCloseTo(log(complex([0, 1]), real(10)), complex([0, -1.465871197758]), 10)
  })

  it('calculates a real log of a complex value', () => {
    expectCloseTo(log(real(10), complex([0, 1])), complex([0, 0.6821881769209]), 10)
  })

  it('returns an expression for unbound subtrees', () => {
    expectWriterTreeNode(
      log(variable('x'), variable('y')),
      $log(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['log(x, y)', 'log(x,y)', 'logarithm']
    )
  })

  it('returns the exponent of a similarly based exponential', () => {
    expectWriterTreeNode(
      log(real(16), raise(real(16), variable('x'))),
      variable('x')
    )(
      ['16', '16', 'given primitive'],
      ['16', '16', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['16 ^ x', '(16^x)', 'exponentiation'],
      ['log(16, (16^x))', 'x', 'inverse operation cancellation']
    )
  })
})

describe('lb', () => {
  it('calculates the base 2 logarithm of a real', () => {
    expectWriterTreeNode(
      lb(real(1024)),
      real(10)
    )(
      ['2', '2', 'given primitive'],
      ['1024', '1024', 'given primitive'],
      ['log(2, 1024)', '10', 'real logarithm'],
      ['10', '10', 'given primitive']
    )
  })

  it('returns the exponent of a binary exponential', () => {
    expectWriterTreeNode(
      lb(raise(real(2), variable('x'))),
      variable('x')
    )(
      ['2', '2', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['2 ^ x', '(2^x)', 'exponentiation'],
      ['log(2, (2^x))', 'x', 'inverse operation cancellation']
    )
  })
})

describe('ln', () => {
  it('calculates the base e logarithm of complex 0', () => {
    const cni = `-${Unicode.infinity}+0${Unicode.i}`
    expectWriterTreeNode(
      ln(complex([0, 0])),
      complex([-Infinity, 0])
    )(
      [Unicode.e, Unicode.e, 'given primitive'],
      [Unicode.e, `${Unicode.e}+0${Unicode.i}`, 'cast to Complex from Real'],
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive'],
      [
        `log(${Unicode.e}+0${Unicode.i}, 0+0${Unicode.i})`, 
        cni,
        'complex logarithm'
      ],
      [cni, cni, 'given primitive']
    )
  })

  it('calculates the natural logarithm of a complex', () => {
    expectCloseTo(ln(complex([3.79890743995, 2.1117859405])), complex([1.4693517444, 0.50735630322]), 10)
  })

  it('returns the exponent of a natural exponential', () => {
    expectWriterTreeNode(
      ln(raise(real(Math.E), variable('x'))),
      variable('x')
    )(
      [Unicode.e, Unicode.e, 'given primitive'],
      [Unicode.e, Unicode.e, 'given primitive'],
      ['x', 'x', 'given variable'],
      [`${Unicode.e} ^ x`, `(${Unicode.e}^x)`, 'exponentiation'],
      [`log(${Unicode.e}, (${Unicode.e}^x))`, 'x', 'inverse operation cancellation']
    )
  })
})

describe('lg', () => {
  it('calculates the base 10 logarithm of a real', () => {
    expectCloseTo(lg(real(1000)), real(3), 10)
  })

  it('returns the exponent of a common exponential', () => {
    expectWriterTreeNode(
      lg(raise(real(10), variable('x'))),
      variable('x')
    )(
      ['10', '10', 'given primitive'],
      ['10', '10', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['10 ^ x', '(10^x)', 'exponentiation'],
      ['log(10, (10^x))', 'x', 'inverse operation cancellation']
    )
  })
})
