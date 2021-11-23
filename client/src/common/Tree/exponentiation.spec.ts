import { expectCloseTo } from './expectations'
import { Exponentiation } from './Expression'
import { raise, reciprocal, square, sqrt } from './exponentiation'
import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { multiply } from './multiplication'
import { log, lb, ln, lg } from './logarithmic'

describe('raise', () => {
  it('computes the value of a real raised to a real', () => {
    expectCloseTo(raise(real(2), real(3)), real(8), 10)
  })

  it('calculates the value of raising one complex to another', () => {
    expectCloseTo(raise(complex(0, 1), complex(0, 1)), complex(0.20787957635076, 0), 10)
  })

  it('calculates the value of raising a real to a complex number', () => {
    expectCloseTo(raise(real(-2), complex(3, 4)), complex(0.000026020793185, -0.000010062701000), 10)
  })

  it('calculates the value of raising a complex number to a real', () => {
    expectCloseTo(raise(complex(2, 3), real(5)), complex(122, -597), 10)
  })

  it('calculates the complex square root', () => {
    expectCloseTo(raise(complex(2, 3), real(0.5)), complex(1.67414922803554, 0.89597747612983), 10)
  })

  it('returns 0 when the base is 0', () => {
    expect(raise(real(0), variable('x'))).toEqual(real(0))
  })

  it('returns 1 when the exponent is 0', () => {
    expect(raise(variable('x'), real(0))).toEqual(real(1))
  })

  it('returns 1 when the base is 1', () => {
    expect(raise(real(1), variable('x'))).toEqual(real(1))
  })

  it('returns the base whenever the exponent is 1', () => {
    expect(raise(variable('x'), real(1))).toEqual(variable('x'))
  })

  it('returns the sub-expression of an lb if base 2', () => {
    expect(raise(real(2), lb(variable('x')))).toEqual(variable('x'))
  })

  it('returns the sub-expression of an ln if base e', () => {
    expect(raise(real(Math.E), ln(variable('x')))).toEqual(variable('x'))
  })

  it('returns the sub-expression of an lg if base 10', () => {
    expect(raise(real(10), lg(variable('x')))).toEqual(variable('x'))
  })
  
  it('returns the value of a logarithm if raising similar base to it', () => {
    expect(raise(complex(0, 1), log(complex(0, 1), variable('x')))).toEqual(variable('x'))
  })

  it('multiplies the exponent of a base exponential against the exponent', () => {
    expect(
      raise(raise(variable('x'), variable('y')), variable('z'))
    ).toEqual(raise(variable('x'), multiply(variable('y'), variable('z'))))
  })
  
  it('creates an Exponentiation when given non-constants', () => {
    expect(raise(variable('x'), real(3))).toEqual(new Exponentiation(variable('x'), real(3)))
  })
})

describe('reciprocal', () => {
  it('raises its argument to the power of -1', () => {
    expect(reciprocal(variable('x'))).toEqual(raise(variable('x'), real(-1)))
  })
})

describe('square', () => {
  it('raises its argument to the power of 2', () => {
    expect(square(variable('x'))).toEqual(raise(variable('x'), real(2)))
  })
})

describe('sqrt', () => {
  it('raises its argument to the power of 0.5', () => {
    expect(sqrt(variable('x'))).toEqual(raise(variable('x'), real(0.5)))
  })
})
