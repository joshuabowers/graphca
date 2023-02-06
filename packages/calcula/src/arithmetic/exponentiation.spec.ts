import { unit } from '../monads/writer'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { multiply } from './multiplication'
import { raise, reciprocal, square, sqrt, $raise } from './exponentiation'
import { log, lb, ln, lg } from '../functions/logarithmic'
import { Unicode } from '../Unicode'
import { 
  expectCloseTo, expectWriterTreeNode,
  realOps, variableOps, raiseOps, logOps, complexOps, multiplyOps
} from '../utility/expectations'

describe('raise', () => {
  it('computes the value of a real raised to a real', () => {
    expectCloseTo(raise(real(2), real(3)), real(8), 10)
  })

  it('calculates the value of raising one complex to another', () => {
    expectCloseTo(raise(complex([0, 1]), complex([0, 1])), complex([0.20787957635076, 0]), 10)
  })

  it('calculates the value of raising a real to a complex number', () => {
    expectCloseTo(raise(real(-2), complex([3, 4])), complex([0.000026020793185, -0.000010062701000]), 10)
  })

  it('calculates the value of raising a complex number to a real', () => {
    expectCloseTo(raise(complex([2, 3]), real(5)), complex([122, -597]), 10)
  })

  it('calculates the complex square root', () => {
    expectCloseTo(
      raise(complex([2, 3]), real(0.5)), 
      complex([1.67414922803554, 0.89597747612983]), 
      10
    )
  })

  it('returns 0 when the base is 0', () => {
    expectWriterTreeNode(
      raise(real(0), variable('x')),
      real(0)
    )(
      ...raiseOps(
        'powers of 0',
        realOps('0'),
        variableOps('x'),
        realOps('0')
      )
    )
  })

  it('returns 1 when the exponent is 0', () => {
    expectWriterTreeNode(
      raise(variable('x'), real(0)),
      real(1)
    )(
      ...raiseOps(
        'exponent of 0',
        variableOps('x'),
        realOps('0'),
        realOps('1')
      )
    )
  })

  it('returns 1 when the base is 1', () => {
    expectWriterTreeNode(
      raise(real(1), variable('x')),
      real(1)
    )(
      ...raiseOps(
        'powers of 1',
        realOps('1'),
        variableOps('x'),
        realOps('1')
      )
    )
  })

  it('returns the base whenever the exponent is 1', () => {
    expectWriterTreeNode(
      raise(variable('x'), real(1)),
      variable('x')
    )(
      ...raiseOps(
        'exponent of 1',
        variableOps('x'),
        realOps('1'),
        variableOps('x')
      )
    )
  })

  it('returns the sub-expression of an lb if base 2', () => {
    expectWriterTreeNode(
      raise(real(2), lb(variable('x'))),
      variable('x')
    )(
      ...raiseOps(
        'inverse function cancellation',
        realOps('2'),
        logOps(
          'created logarithm',
          realOps('2'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })

  it('returns the sub-expression of an ln if base e', () => {
    expectWriterTreeNode(
      raise(real(Math.E), ln(variable('x'))),
      variable('x')
    )(
      ...raiseOps(
        'inverse function cancellation',
        realOps(Unicode.e),
        logOps(
          'created logarithm',
          realOps(Unicode.e),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
      // [Unicode.e, Unicode.e, 'given primitive'],
      // [Unicode.e, Unicode.e, 'given primitive'],
      // ['x', 'x', 'given variable'],
      // [`log(${Unicode.e}, x)`, `log(${Unicode.e},x)`, 'logarithm'],
      // [`${Unicode.e} ^ log(${Unicode.e},x)`, 'x', 'inverse function cancellation']
    )
  })

  it('returns the sub-expression of an lg if base 10', () => {
    expectWriterTreeNode(
      raise(real(10), lg(variable('x'))),
      variable('x')
    )(
      ...raiseOps(
        'inverse function cancellation',
        realOps('10'),
        logOps(
          'created logarithm',
          realOps('10'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })
  
  it('returns the value of a logarithm if raising similar base to it', () => {
    const i = `0+1${Unicode.i}`
    expectWriterTreeNode(
      raise(complex([0, 1]), log(complex([0, 1]), variable('x'))),
      variable('x')
    )(
      ...raiseOps(
        'inverse function cancellation',
        complexOps('0', '1'),
        logOps(
          'created logarithm',
          complexOps('0', '1'),
          variableOps('x'),
          []
        ),
        variableOps('x')
      )
    )
  })

  it('multiplies the exponent of a base exponential against the exponent', () => {
    expectWriterTreeNode(
      raise(raise(variable('x'), variable('y')), variable('z')),
      raise(variable('x'), multiply(variable('y'), variable('z')))
    )(
      ...raiseOps(
        'exponential product',
        raiseOps(
          'created exponentiation',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        variableOps('z'),
        raiseOps(
          'created exponentiation',
          variableOps('x'),
          multiplyOps(
            'created multiplication',
            variableOps('y'),
            variableOps('z'),
            []
          ),
          []
        )
      )
    )
  })

  it('converts a base multiplication into a product of exponentiations', () => {
    expectWriterTreeNode(
      raise(multiply(variable('x'), variable('y')), variable('z')),
      multiply(
        raise(variable('x'), variable('z')),
        raise(variable('y'), variable('z'))
      )
    )(
      ...raiseOps(
        'exponential distribution',
        multiplyOps(
          'created multiplication',
          variableOps('x'),
          variableOps('y'),
          []
        ),
        variableOps('z'),
        multiplyOps(
          'created multiplication',
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            variableOps('z'),
            []
          ),
          raiseOps(
            'created exponentiation',
            variableOps('y'),
            variableOps('z'),
            []
          ),
          []
        )
      )
    )
  })
  
  it('creates an Exponentiation when given non-constants', () => {
    expectWriterTreeNode(
      raise(variable('x'), real(3)),
      $raise(variable('x'), real(3))[0]
    )(
      ...raiseOps(
        'created exponentiation',
        variableOps('x'),
        realOps('3'),
        []
      )
    )
  })
})

describe('reciprocal', () => {
  it('raises its argument to the power of -1', () => {
    expectWriterTreeNode(
      reciprocal(variable('x')),
      raise(variable('x'), real(-1))
    )(
      ...raiseOps(
        'created exponentiation',
        variableOps('x'),
        realOps('-1'),
        []
      )
    )
  })

  it('raises complex 1 to -1 correctly', () => {
    expectWriterTreeNode(
      reciprocal(complex([1, 0])),
      complex([1, 0])
    )(
      ...raiseOps(
        'complex exponentiation',
        complexOps('1', '0'),
        [
          ...realOps('-1'),
          [`-1+0${Unicode.i}`, 'cast to Complex from Real']
        ],
        complexOps('1', '0')
      )
    )
  })

  it('calculates a complex reciprocal correctly', () => {
    expectCloseTo(reciprocal(complex([1, 1])), complex([0.5, -0.5]), 10)
  })

  it('calculates a reciprocal of complex 0 correctly', () => {
    expectCloseTo(reciprocal(complex([0, 0])), complex([Infinity, 0]), 10)
  })
})

describe('square', () => {
  it('raises its argument to the power of 2', () => {
    expectWriterTreeNode(
      square(variable('x')),
      raise(variable('x'), real(2))
    )(
      ...raiseOps(
        'created exponentiation',
        variableOps('x'),
        realOps('2'),
        []
      )
    )
  })

  it('calculates the proper square of a complex number', () => {
    expectCloseTo(square(complex([1, 1])), complex([0, 2]), 10)
  })
})

describe('sqrt', () => {
  it('raises its argument to the power of 0.5', () => {
    expectWriterTreeNode(
      sqrt(variable('x')),
      raise(variable('x'), real(0.5))
    )(
      ...raiseOps(
        'created exponentiation',
        variableOps('x'),
        realOps('0.5'),
        []
      )
    )
  })

  it('calculates the proper sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex([1, 1])), complex([1.098684113467, 0.455089860562]), 10)
  })

  it('calculates the complex sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex([3, 1])), complex([1.755317301824, 0.284848784593]), 10)
  })
})
