import { unit } from '../monads/writer'
import { 
  expectCloseTo, expectWriterTreeNode,
  realOps, complexOps, variableOps, logOps, raiseOps
} from '../utility/expectations'
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
      ...logOps(
        'real logarithm',
        realOps('16'),
        realOps('256'),
        realOps('2')
      )
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
      $log(variable('x'), variable('y'))[0]
    )(
      ...logOps(
        'created logarithm',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })

  it('returns the exponent of a similarly based exponential', () => {
    expectWriterTreeNode(
      log(real(16), raise(real(16), variable('x'))),
      variable('x')
    )(
      ...logOps(
        'inverse operation cancellation',
        realOps('16'),
        raiseOps(
          'created exponentiation',
          realOps('16'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })
})

describe('lb', () => {
  it('calculates the base 2 logarithm of a real', () => {
    expectWriterTreeNode(
      lb(real(1024)),
      real(10)
    )(
      ...logOps(
        'real logarithm',
        realOps('2'),
        realOps('1024'),
        realOps('10')
      )
    )
  })

  it('returns the exponent of a binary exponential', () => {
    expectWriterTreeNode(
      lb(raise(real(2), variable('x'))),
      variable('x')
    )(
      ...logOps(
        'inverse operation cancellation',
        realOps('2'),
        raiseOps(
          'created exponentiation',
          realOps('2'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })
})

describe('ln', () => {
  it('calculates the base e logarithm of complex 0', () => {
    expectWriterTreeNode(
      ln(complex([0, 0])),
      complex([-Infinity, 0])
    )(
      ...logOps(
        'complex logarithm',
        [
          ...realOps(Unicode.e),
          [`${Unicode.e}+0${Unicode.i}`, 'cast to Complex from Real']
        ],
        complexOps('0','0'),
        complexOps(`-${Unicode.infinity}`, '0')
      )
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
      ...logOps(
        'inverse operation cancellation',
        realOps(Unicode.e),
        raiseOps(
          'created exponentiation',
          realOps(Unicode.e),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
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
      ...logOps(
        'inverse operation cancellation',
        realOps('10'),
        raiseOps(
          'created exponentiation',
          realOps('10'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })
})
