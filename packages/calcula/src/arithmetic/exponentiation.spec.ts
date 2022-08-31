import { real, complex } from '../primitives'
import { variable } from '../variable'
import { multiply } from './multiplication'
import { raise, reciprocal, square, sqrt, $raise } from './exponentiation'
import { log, lb, ln, lg } from '../functions/logarithmic'
import { expectCloseTo, expectWriter } from '../utility/expectations'

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
    expectWriter(
      raise(real(0), variable('x'))
    )(
      real(0),
      [[real(0), variable('x')], 'powers of 0']
    )
  })

  it('returns 1 when the exponent is 0', () => {
    expectWriter(
      raise(variable('x'), real(0))
    )(
      real(1),
      [[variable('x'), real(0)], 'exponent of 0']
    )
  })

  it('returns 1 when the base is 1', () => {
    expectWriter(
      raise(real(1), variable('x'))
    )(
      real(1),
      [[real(1), variable('x')], 'powers of 1']
    )
  })

  it('returns the base whenever the exponent is 1', () => {
    expectWriter(
      raise(variable('x'), real(1))
    )(
      variable('x'),
      [[variable('x'), real(1)], 'exponent of 1']
    )
  })

  it('returns the sub-expression of an lb if base 2', () => {
    expectWriter(
      raise(real(2), lb(variable('x')))
    )(
      variable('x'),
      [[real(2), variable('x')], 'logarithm'],
      [[real(2), lb(variable('x'))], 'inverse function cancellation']
    )
  })

  it('returns the sub-expression of an ln if base e', () => {
    expectWriter(
      raise(real(Math.E), ln(variable('x')))
    )(
      variable('x'),
      [[real(Math.E), variable('x')], 'logarithm'],
      [[real(Math.E), ln(variable('x'))], 'inverse function cancellation']
    )
  })

  it('returns the sub-expression of an lg if base 10', () => {
    expectWriter(
      raise(real(10), lg(variable('x')))
    )(
      variable('x'),
      [[real(10), variable('x')], 'logarithm'],
      [[real(10), lg(variable('x'))], 'inverse function cancellation']
    )
  })
  
  it('returns the value of a logarithm if raising similar base to it', () => {
    expectWriter(
      raise(complex([0, 1]), log(complex([0, 1]), variable('x')))
    )(
      variable('x'),
      [[complex([0, 1]), variable('x')], 'logarithm'],
      [[complex([0, 1]), log(complex([0, 1]), variable('x'))], 'inverse function cancellation']
    )
  })

  it('multiplies the exponent of a base exponential against the exponent', () => {
    expectWriter(
      raise(raise(variable('x'), variable('y')), variable('z'))
    )(
      raise(variable('x'), multiply(variable('y'), variable('z'))),
      [[variable('x'), variable('y')], 'exponentiation'],
      [[raise(variable('x'), variable('y')), variable('z')], 'exponential product'],
      [[variable('y'), variable('z')], 'multiplication'],
      [[variable('x'), multiply(variable('y'), variable('z'))], 'exponentiation']
    )
  })

  it('converts a base multiplication into a product of exponentiations', () => {
    expectWriter(
      raise(multiply(variable('x'), variable('y')), variable('z'))
    )(
      multiply(
        raise(variable('x'), variable('z')), 
        raise(variable('y'), variable('z'))
      ),
      [[variable('x'), variable('y')], 'multiplication'],
      [[multiply(variable('x'), variable('y')), variable('z')], 'exponential distribution'],
      [[variable('x'), variable('z')], 'exponentiation'],
      [[variable('y'), variable('z')], 'exponentiation'],
      [
        [raise(variable('x'), variable('z')), raise(variable('y'), variable('z'))],
        'multiplication'
      ]
    )
  })
  
  it('creates an Exponentiation when given non-constants', () => {
    expectWriter(
      raise(variable('x'), real(3))
    )(
      $raise(variable('x'), real(3))[0],
      [[variable('x'), real(3)], 'exponentiation']
    )
  })
})

describe('reciprocal', () => {
  it('raises its argument to the power of -1', () => {
    expectWriter(
      reciprocal(variable('x'))
    )(
      raise(variable('x'), real(-1)),
      [[variable('x'), real(-1)], 'exponentiation']
    )
  })

  it('raises complex 1 to -1 correctly', () => {
    expectWriter(
      reciprocal(complex([1, 0]))
    )(
      complex([1, 0]),
      [real(-1), 'cast to complex'],
      [[complex([1, 0]), complex([-1, 0])], 'complex exponentiation']
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
    expectWriter(
      square(variable('x'))
    )(
      raise(variable('x'), real(2)),
      [[variable('x'), real(2)], 'exponentiation']
    )
  })

  it('calculates the proper square of a complex number', () => {
    expectCloseTo(square(complex([1, 1])), complex([0, 2]), 10)
  })
})

describe('sqrt', () => {
  it('raises its argument to the power of 0.5', () => {
    expectWriter(
      sqrt(variable('x'))
    )(
      raise(variable('x'), real(0.5)),
      [[variable('x'), real(0.5)], 'exponentiation']
    )
  })

  it('calculates the proper sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex([1, 1])), complex([1.098684113467, 0.455089860562]), 10)
  })

  it('calculates the complex sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex([3, 1])), complex([1.755317301824, 0.284848784593]), 10)
  })
})
