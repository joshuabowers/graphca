import { unit } from '../monads/writer'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { multiply } from './multiplication'
import { raise, reciprocal, square, sqrt, $raise } from './exponentiation'
import { log, lb, ln, lg } from '../functions/logarithmic'
import { Unicode } from '../Unicode'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'

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
      ['0', '0', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['0 ^ x', '0', 'powers of 0'],
      ['0', '0', 'given primitive']
    )
  })

  it('returns 1 when the exponent is 0', () => {
    expectWriterTreeNode(
      raise(variable('x'), real(0)),
      real(1)
    )(
      ['x', 'x', 'given variable'],
      ['0', '0', 'given primitive'],
      ['x ^ 0', '1', 'exponent of 0'],
      ['1', '1', 'given primitive']
    )
  })

  it('returns 1 when the base is 1', () => {
    expectWriterTreeNode(
      raise(real(1), variable('x')),
      real(1)
    )(
      ['1', '1', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['1 ^ x', '1', 'powers of 1'],
      ['1', '1', 'given primitive']
    )
  })

  it('returns the base whenever the exponent is 1', () => {
    expectWriterTreeNode(
      raise(variable('x'), real(1)),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['1', '1', 'given primitive'],
      ['x ^ 1', 'x', 'exponent of 1']
    )
  })

  it('returns the sub-expression of an lb if base 2', () => {
    expectWriterTreeNode(
      raise(real(2), lb(variable('x'))),
      variable('x')
    )(
      ['2', '2', 'given primitive'], // Exponent base
      ['2', '2', 'given primitive'], // Logarithm base
      ['x', 'x', 'given variable'],
      ['log(2, x)', 'log(2,x)', 'logarithm'],
      ['2 ^ log(2,x)', 'x', 'inverse function cancellation']
    )
  })

  it('returns the sub-expression of an ln if base e', () => {
    expectWriterTreeNode(
      raise(real(Math.E), ln(variable('x'))),
      variable('x')
    )(
      [Unicode.e, Unicode.e, 'given primitive'],
      [Unicode.e, Unicode.e, 'given primitive'],
      ['x', 'x', 'given variable'],
      [`log(${Unicode.e}, x)`, `log(${Unicode.e},x)`, 'logarithm'],
      [`${Unicode.e} ^ log(${Unicode.e},x)`, 'x', 'inverse function cancellation']
    )
  })

  it('returns the sub-expression of an lg if base 10', () => {
    expectWriterTreeNode(
      raise(real(10), lg(variable('x'))),
      variable('x')
    )(
      ['10', '10', 'given primitive'],
      ['10', '10', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['log(10, x)', 'log(10,x)', 'logarithm'],
      ['10 ^ log(10,x)', 'x', 'inverse function cancellation']
    )
  })
  
  it('returns the value of a logarithm if raising similar base to it', () => {
    const i = `0+1${Unicode.i}`
    expectWriterTreeNode(
      raise(complex([0, 1]), log(complex([0, 1]), variable('x'))),
      variable('x')
    )(
      [i, i, 'given primitive'],
      [i, i, 'given primitive'],
      ['x', 'x', 'given variable'],
      [`log(${i}, x)`, `log(${i},x)`, 'logarithm'],
      [`${i} ^ log(${i},x)`, 'x', 'inverse function cancellation']
    )
  })

  it('multiplies the exponent of a base exponential against the exponent', () => {
    expectWriterTreeNode(
      raise(raise(variable('x'), variable('y')), variable('z')),
      raise(variable('x'), multiply(variable('y'), variable('z')))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x ^ y', '(x^y)', 'exponentiation'],
      ['z', 'z', 'given variable'],
      ['(x^y) ^ z', 'x^(y * z)', 'exponential product'],
      ['y * z', '(y*z)', 'multiplication'],
      ['x ^ (y*z)', '(x^(y*z))', 'exponentiation']
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
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x * y', '(x*y)', 'multiplication'],
      ['z', 'z', 'given variable'],
      ['(x*y) ^ z', '(x^z) * (y^z)', 'exponential distribution'],
      ['x ^ z', '(x^z)', 'exponentiation'],
      ['y ^ z', '(y^z)', 'exponentiation'],
      ['(x^z) * (y^z)', '((x^z)*(y^z))', 'multiplication']
    )
  })
  
  it('creates an Exponentiation when given non-constants', () => {
    expectWriterTreeNode(
      raise(variable('x'), real(3)),
      $raise(unit(variable('x').value), unit(real(3).value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['3', '3', 'given primitive'],
      ['x ^ 3', '(x^3)', 'exponentiation']
    )
  })
})

describe('reciprocal', () => {
  it('raises its argument to the power of -1', () => {
    expectWriterTreeNode(
      reciprocal(variable('x')),
      raise(variable('x'), real(-1))
    )(
      ['x', 'x', 'given variable'],
      ['-1', '-1', 'given primitive'],
      ['x ^ -1', '(x^-1)', 'exponentiation']
    )
  })

  it('raises complex 1 to -1 correctly', () => {
    const c1 = `1+0${Unicode.i}`
    expectWriterTreeNode(
      reciprocal(complex([1, 0])),
      complex([1, 0])
    )(
      [c1, c1, 'given primitive'],
      ['-1', '-1', 'given primitive'],
      ['-1', `-1+0${Unicode.i}`, 'cast to Complex from Real'],
      [`${c1} ^ -1+0${Unicode.i}`, c1, 'complex exponentiation'],
      [c1, c1, 'given primitive']
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
      ['x', 'x', 'given variable'],
      ['2', '2', 'given primitive'],
      ['x ^ 2', '(x^2)', 'exponentiation']
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
      ['x', 'x', 'given variable'],
      ['0.5', '0.5', 'given primitive'],
      ['x ^ 0.5', '(x^0.5)', 'exponentiation']
    )
  })

  it('calculates the proper sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex([1, 1])), complex([1.098684113467, 0.455089860562]), 10)
  })

  it('calculates the complex sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex([3, 1])), complex([1.755317301824, 0.284848784593]), 10)
  })
})
