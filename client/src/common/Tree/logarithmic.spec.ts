import { expectCloseTo } from './expectations'
import { Logarithm, log, lb, ln, lg } from './logarithmic'
import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { raise } from './exponentiation'

describe('log', () => {
  it('calculates the real log of a real value', () => {
    expect(log(real(16), real(256))).toEqual(real(2))
  })

  it('calculates the complex log of a complex value', () => {
    expectCloseTo(log(complex(0, 1), complex(1, 2)), complex(0.7048327646991, -0.5122999987267), 10)
  })

  it('calculates a complex log of a real value', () => {
    expectCloseTo(log(complex(0, 1), real(10)), complex(0, -1.465871197758), 10)
  })

  it('calculates a real log of a complex value', () => {
    expectCloseTo(log(real(10), complex(0, 1)), complex(0, 0.6821881769209), 10)
  })

  it('returns an expression for unbound subtrees', () => {
    expect(log(variable('x'), variable('y'))).toEqual(new Logarithm(variable('x'), variable('y')))
  })

  it('returns the exponent of a similarly based exponential', () => {
    expect(log(real(16), raise(real(16), variable('x')))).toEqual(variable('x'))
  })
})

describe('lb', () => {
  it('calculates the base 2 logarithm of a real', () => {
    expect(lb(real(1024))).toEqual(real(10))
  })

  it('returns the exponent of a binary exponential', () => {
    expect(lb(raise(real(2), variable('x')))).toEqual(variable('x'))
  })
})

describe('ln', () => {
  it('calculates the base e logarithm of complex 0', () => {
    expect(ln(complex(0, 0))).toEqual(complex(-Infinity, 0))
  })

  it('calculates the natural logarithm of a complex', () => {
    expectCloseTo(ln(complex(3.79890743995, 2.1117859405)), complex(1.4693517444, 0.50735630322), 10)
  })

  it('returns the exponent of a natural exponential', () => {
    expect(ln(raise(real(Math.E), variable('x')))).toEqual(variable('x'))
  })
})

describe('lg', () => {
  it('calculates the base 10 logarithm of a real', () => {
    expectCloseTo(lg(real(1000)), real(3), 10)
  })

  it('returns the exponent of a common exponential', () => {
    expect(lg(raise(real(10), variable('x')))).toEqual(variable('x'))
  })
})
