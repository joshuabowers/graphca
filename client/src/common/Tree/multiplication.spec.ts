import { expectCloseTo } from './expectations'
import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { multiply, negate, double, divide } from './multiplication'
import { raise, reciprocal, square } from './exponentiation'
import { Multiplication } from './Expression'

describe('multiply', () => {
  it('reorders a real right multiplicand to the left', () => {
    expect(multiply(variable('x'), real(5))).toEqual(multiply(real(5), variable('x')))
  })

  it('reorders a complex right to left unless left real', () => {
    expect(multiply(variable('x'), complex(1, 2))).toEqual(
      multiply(complex(1, 2), variable('x'))
    )
  })

  it('is NaN if 0 and Infinity', () => {
    expect(multiply(real(0), real(Infinity))).toEqual(real(NaN))
  })

  it('is real 0 if left is real 0', () => {
    expect(multiply(real(0), variable('x'))).toEqual(real(0))
  })

  it('is real 0 if right is real 0', () => {
    expect(multiply(variable('x'), real(0))).toEqual(real(0))
  })

  it('is infinity if left is infinity', () => {
    expect(multiply(real(Infinity), variable('x'))).toEqual(real(Infinity))
  })

  it('is infinity if right is infinity', () => {
    expect(multiply(variable('x'), real(Infinity))).toEqual(real(Infinity))
  })

  it('is negative infinity if left is negative infinity', () => {
    expect(multiply(real(-Infinity), variable('x'))).toEqual(real(-Infinity))
  })

  it('is negative infinity if right is negative infinity', () => {
    expect(multiply(variable('x'), real(-Infinity))).toEqual(real(-Infinity))
  })

  it('is the right if left is 1', () => {
    expect(multiply(variable('x'), real(1))).toEqual(variable('x'))
  })

  it('is the left if right is 1', () => {
    expect(multiply(real(1), variable('x'))).toEqual(variable('x'))
  })

  it('multiplies two reals together', () => {
    expect(multiply(real(2), real(3))).toEqual(real(6))
  })

  it('multiplies two complex numbers together', () => {
    expect(multiply(complex(2, 3), complex(3, 4))).toEqual(complex(-6, 17))
  })

  it('multiplies reals and complexes', () => {
    expect(multiply(complex(2, 3), real(5))).toEqual(complex(10, 15))
  })

  it('squares left if right is equal', () => {
    expect(multiply(variable('x'), variable('x'))).toEqual(square(variable('x')))
  })

  it('adds to the power when multiplying by the base from the left', () => {
    expect(multiply(variable('x'), square(variable('x')))).toEqual(
      raise(variable('x'), real(3))
    )
  })

  it('adds to the power when multiplying by the base from the right', () => {
    expect(multiply(square(variable('x')), variable('x'))).toEqual(
      raise(variable('x'), real(3))
    )
  })

  it('combines equivalent based powers together', () => {
    expect(
      multiply(square(variable('x')), raise(variable('x'), real(3)))
    ).toEqual(
      raise(variable('x'), real(5))
    )
  })

  it('multiplies complex infinity against complex 1 correctly', () => {
    expect(multiply(complex(-Infinity, 0), complex(1, 0))).toEqual(complex(-Infinity, 0))
  })

  it('multiplies a complex wrapped real by a pure imaginary correctly', () => {
    expect(multiply(complex(Infinity, 0), complex(0, 3))).toEqual(complex(0, Infinity))
  })

  it('multiplies a pure imaginary by a complex wrapped real correctly', () => {
    expect(multiply(complex(0, 3), complex(Infinity, 0))).toEqual(complex(0, Infinity))
  })

  it('multiplies two complexes together correctly', () => {
    expectCloseTo(
      multiply(complex(1.098684113467, 0.455089860562), complex(1.755317301824, 0.284848784593)), 
      complex(1.79890743995, 1.11178594050), 
      10
    )
  })

  it('creates a Multiplication for unhandled edge cases', () => {
    expect(multiply(real(2), variable('x'))).toEqual(
      new Multiplication(real(2), variable('x'))
    )
  })
})

describe(negate, () => {
  it('results in a real with negative value, when real', () => {
    expect(negate(real(1))).toEqual(real(-1))
  })

  it('results in a multiplication node with -1 as the left', () => {
    expect(negate(variable('x'))).toEqual(multiply(real(-1), variable('x')))
  })
})

describe(double, () => {
  it('results in a real with 2 times the value, when real', () => {
    expect(double(real(2))).toEqual(real(4))
  })

  it('results in a multiplication node with 2 as the left', () => {
    expect(double(variable('x'))).toEqual(multiply(real(2), variable('x')))
  })
})

describe('divide', () => {
  it('results in a division of the two real arguments', () => {
    expect(divide(real(10), real(5))).toEqual(real(2))
  })

  it('is the multiplication of the numerator by the reciprocal of the denominator', () => {
    expect(divide(real(2), variable('x'))).toEqual(
      multiply(real(2), reciprocal(variable('x')))
    )
  })

  it('handles division by zero correctly', () => {
    expect(divide(variable('x'), real(0))).toEqual(real(Infinity))
  })

  it('properly calculates real / complex division', () => {
    expectCloseTo(divide(real(1), complex(1, 2)), complex(0.2, -0.4), 10)
  })

  it('properly handles dividing complex 0 by another complex', () => {
    expectCloseTo(divide(complex(0, 0), complex(0, 2)), complex(0, 0), 10)
  })

  it('properly handles dividing a complex by complex 0', () => {
    expectCloseTo(divide(complex(0, 2), complex(0, 0)), complex(0, Infinity), 10)
  })

  it('properly divides a complex value by complex 1', () => {
    expect(divide(complex(2, 0), complex(1, 0))).toEqual(complex(2, 0))
  })

  it('properly divides complex negative infinity by complex 1', () => {
    expect(divide(complex(-Infinity, 0), complex(1, 0))).toEqual(complex(-Infinity, 0))
  })
})
