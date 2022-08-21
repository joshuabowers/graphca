import { expectCloseTo } from './expectations'
import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { 
  Multiplication, multiply, negate, double, divide, 
  exponentialCollect, collectFromProducts, canFormExponential
} from './multiplication'
import { raise, reciprocal, square } from './exponentiation'

describe('canFormExponential', () => {
  it('is true for equivalent things', () => {
    expect(canFormExponential(variable('x'), variable('x'))).toBeTruthy()
  })

  it('is false for non-equitable things', () => {
    expect(canFormExponential(variable('y'), variable('x'))).toBeFalsy()
  })

  it('is true if a thing is multiplied by a product of itself', () => {
    expect(canFormExponential(variable('x'), multiply(variable('y'), variable('x'))))
  })

  it('is true if an exponential is multiplied by a multiplication of its base', () => {
    expect(canFormExponential(square(variable('x')), double(variable('x'))))
  })

  it('is true if two products multiplied together have similar terms', () => {
    expect(
      canFormExponential(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('z'))
      )
    ).toBeTruthy()
  })

  it('is true for two products dividing each other with similar terms', () => {
    expect(
      canFormExponential(
        multiply(variable('x'), variable('y')),
        reciprocal(multiply(variable('x'), variable('z')))
      )
    ).toBeTruthy()
  })
})

describe('exponentialCollect', () => {
  it('squares equivalent things', () => {
    expect(exponentialCollect(variable('x'), variable('x'))).toEqual(
      square(variable('x'))
    )
  })

  it('creates a new exponential from a nested multiplication', () => {
    expect(
      exponentialCollect(variable('x'), multiply(variable('y'), variable('x')))
    ).toEqual(multiply(variable('y'), square(variable('x'))))
  })

  it('collects an exponential across a multiplication', () => {
    expect(
      exponentialCollect(square(variable('x')), double(variable('x')))
    ).toEqual(multiply(real(2), raise(variable('x'), real(3))))
  })
})

describe('collectsFromProducts', () => {
  it('squares equivalent things', () => {
    expect(
      collectFromProducts(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('y'))
      )
    ).toEqual(multiply(square(variable('x')), square(variable('y'))))
  })

  it('collects like terms across multiplications', () => {
    expect(
      collectFromProducts(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('z'))
      )
    ).toEqual(
      multiply(
        square(variable('x')),
        multiply(variable('y'), variable('z'))
      )
    )
  })
})

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

  it('simplifies a constant multiplied against a multiplication with a constant', () => {
    expect(multiply(real(5), multiply(variable('x'), complex(1, 1)))).toEqual(
      multiply(complex(5, 5), variable('x'))
    )
  })

  it('isEa_A2xEa: combines nested multiplications involving similar exponentiations', () => {
    expect(
      multiply(
        square(variable('x')), 
        multiply(
          variable('y'), 
          raise(variable('x'), real(3))
        )
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(5)))
    )
  })

  it('isEa_EaxA2: combines nested multiplications involving similar exponentiations', () => {
    expect(
      multiply(
        square(variable('x')), 
        multiply(
          raise(variable('x'), real(3)),
          variable('y')
        )
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(5)))
    )
  })

  it('isA2xEa_Ea: combines nested multiplications involving similar exponentiations', () => {
    expect(
      multiply(
        multiply(
          variable('y'), 
          raise(variable('x'), real(3))
        ),
        square(variable('x'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(5)))
    )
  })

  it('isEaxA2_Ea: combines nested multiplications involving similar exponentiations', () => {
    expect(
      multiply(
        multiply(
          raise(variable('x'), real(3)),
          variable('y')
        ),
        square(variable('x'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(5)))
    )
  })

  it('isA1_A1xA2: combines nested multiplications involving similar terms', () => {
    expect(
      multiply(
        variable('x'),
        multiply(variable('x'), variable('y'))
      )
    ).toEqual(
      multiply(variable('y'), square(variable('x')))
    )
  })

  it('isA1_A2xA1: combines nested multiplications involving similar terms', () => {
    expect(
      multiply(
        variable('x'),
        multiply(variable('y'), variable('x'))
      )
    ).toEqual(
      multiply(variable('y'), square(variable('x')))
    )
  })

  it('isA1xA2_A1: combines nested multiplications involving similar terms', () => {
    expect(
      multiply(
        multiply(variable('x'), variable('y')),
        variable('x')
      )
    ).toEqual(
      multiply(variable('y'), square(variable('x')))
    )
  })

  it('isA2xA1_A1: combines nested multiplications involving similar terms', () => {
    expect(
      multiply(
        multiply(variable('y'), variable('x')),
        variable('x')
      )
    ).toEqual(
      multiply(variable('y'), square(variable('x')))
    )    
  })

  it('isA1_A2xEa1: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        variable('x'),
        multiply(variable('y'), square(variable('x')))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  it('isA1_Ea1xA2: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        variable('x'),
        multiply(square(variable('x')), variable('y'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  it('isA2xEa1_A1: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        multiply(variable('y'), square(variable('x'))),
        variable('x')
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  it('isEa1xA2_A1: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        multiply(square(variable('x')), variable('y')),
        variable('x')
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  // isEa1_A1xA2
  it('isEa1_A1xA2: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        square(variable('x')),
        multiply(variable('x'), variable('y'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  // isEa1_A2xA1
  it('isEa1_A2xA1: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        square(variable('x')),
        multiply(variable('y'), variable('x'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  // isA1xA2_Ea1
  it('isA1xA2_Ea1: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        multiply(variable('x'), variable('y')),
        square(variable('x'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
    )
  })

  // isA2xA1_Ea1
  it('isA2xA1_Ea1: adds to an exponential across nested multiplications', () => {
    expect(
      multiply(
        multiply(variable('y'), variable('x')),
        square(variable('x'))
      )
    ).toEqual(
      multiply(variable('y'), raise(variable('x'), real(3)))
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

  it('a: cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')), 
        multiply(variable('z'), variable('y'))
      )
    ).toEqual(divide(variable('x'), variable('z')))
  })

  it('b; cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('z'))
      )
    ).toEqual(divide(variable('y'), variable('z')))
  })

  it('c: cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('y'), variable('z'))
      )
    ).toEqual(divide(variable('x'), variable('z')))
  })

  it('d: cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('z'), variable('x'))
      )
    ).toEqual(divide(variable('y'), variable('z')))
  })
})
