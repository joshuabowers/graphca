import { expectCloseTo } from './expectations'
import { raise, reciprocal, square, sqrt } from './exponentiation'
import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { Exponentiation } from './Expression'

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

  it('creates an Exponentiation when given non-constants', () => {
    expect(raise(variable('x'), real(3))).toEqual(new Exponentiation(variable('x'), real(3)))
  })
})

describe('reciprocal', () => {

})

describe('square', () => {

})

describe('sqrt', () => {

})
