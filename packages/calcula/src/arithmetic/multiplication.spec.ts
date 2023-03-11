import { isWriter, unit } from '../monads/writer'
import { expectToEqualWithSnapshot } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { ComplexInfinity } from '../primitives/complex'
import { real, complex, nan } from '../primitives'
import { variable } from '../variable'
import { $multiply, multiply, negate, double, divide } from './multiplication'
import { raise, square, reciprocal } from './exponentiation'

describe('$multiply', () => {
  it('generates a Multiplication for a pair of TreeNode inputs', () => {
    const actual = $multiply(unit(variable('x').value), unit(variable('y').value))[0]
    expect(
      isWriter(actual) ? actual.value : actual
    ).toEqual({
      clade: Clades.multiary, genus: Genera.arithmetic, species: Species.multiply,
      operands: [unit(variable('x').value), unit(variable('y').value)]
    })
  })
})

describe('multiply', () => {
  describe('when given two primitives', () => {
    it('is the product of two reals', () => {
      expectToEqualWithSnapshot(
        multiply(real(2), real(3)),
        real(6)
      )
    })

    it('is the product of two complexes', () => {
      expectToEqualWithSnapshot(
        multiply(complex(2,3), complex(3,4)),
        complex(-6,17)
      )
    })

    it('is the product of mixed inputs', () => {
      expectToEqualWithSnapshot(
        multiply(complex(2,3), real(5)),
        complex(10,15)
      )
    })

    it('multiplies complex infinity against complex 1 correctly', () => {
      expectToEqualWithSnapshot(
        multiply(ComplexInfinity, complex(1,0)),
        complex(Infinity, 0)
      )
    })

    it('multiplies a complex wrapped real by a pure imaginary correctly', () => {
      expectToEqualWithSnapshot(
        multiply(complex(Infinity, 0), complex(0, 3)),
        complex(0, Infinity)
      )
    })

    it('multiplies a pure imaginary by a complex wrapped real correctly', () => {
      expectToEqualWithSnapshot(
        multiply(complex(0, 3), complex(Infinity, 0)),
        complex(0, Infinity)
      )
    })
  })

  describe('when given a primitive and a not primitive', () => {
    it('reorders a real right multiplicand to the left', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), real(5)),
        $multiply(real(5), variable('x'))[0]
      )
    })

    it('reorder a complex right multiplicand to the left', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), complex(0, 1)),
        $multiply(complex(0, 1), variable('x'))[0]
      )
    })
  })

  describe('when dealing with 0, 1, or (+/-)Infinity', () => {
    it('is NaN if given 0 and Infinity', () => {
      expectToEqualWithSnapshot(
        multiply(real(0), real(Infinity)),
        nan
      )
    })

    it('is real 0 if the left is real 0', () => {
      expectToEqualWithSnapshot(
        multiply(real(0), variable('x')),
        real(0)
      )
    })

    it('is real 0 if the right is real 0', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), real(0)),
        real(0)
      )
    })

    it('is infinity if left is infinity', () => {
      expectToEqualWithSnapshot(
        multiply(real(Infinity), variable('x')),
        real(Infinity)
      )
    })

    it('is infinity if right is infinity', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), real(Infinity)),
        real(Infinity)
      )
    })

    it('is negative infinity if left is negative infinity', () => {
      expectToEqualWithSnapshot(
        multiply(real(-Infinity), variable('x')),
        real(-Infinity)
      )
    })

    it('is negative infinity if right is negative infinity', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), real(-Infinity)),
        real(-Infinity)
      )
    })

    it('is the right if the left is 1', () => {
      expectToEqualWithSnapshot(
        multiply(real(1), variable('x')),
        variable('x')
      )
    })

    it('is the left if the right is 1', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), real(1)),
        variable('x')
      )
    })
  })

  describe('when dealing with nested multiplications with primitives', () => {
    it('multiplies primitives across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(real(5), multiply(variable('x'), complex(1, 1))),
        multiply(complex(5, 5), variable('x'))
      )
    })
  })

  describe('when dealing with equivalent subtrees', () => {
    it('squares the left if the right is equivalent', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), variable('x')),
        square(variable('x'))
      )
    })

    it('adds to the power when multiplying by the base from the left', () => {
      expectToEqualWithSnapshot(
        multiply(variable('x'), square(variable('x'))),
        raise(variable('x'), real(3))
      )
    })

    it('adds to the power when multiplying by the base from the right', () => {
      expectToEqualWithSnapshot(
        multiply(square(variable('x')), variable('x')),
        raise(variable('x'), real(3))
      )
    })

    it('combines equivalently-based powers together', () => {
      expectToEqualWithSnapshot(
        multiply(square(variable('x')), raise(variable('x'), real(3))),
        raise(variable('x'), real(5))
      )
    })
  })

  describe('when dealing with exponentiations', () => {
    it('isEa_A2xEa: combines nested multiplications involving similar exponentiations', () => {
      expectToEqualWithSnapshot(
        multiply(
          square(variable('x')), 
          multiply(
            variable('y'), 
            raise(variable('x'), real(3))
          )
        ),
        multiply(variable('y'), raise(variable('x'), real(5)))        
      )
    })

    it('isEa_EaxA2: combines nested multiplications involving similar exponentiations', () => {
      expectToEqualWithSnapshot(
        multiply(
          square(variable('x')), 
          multiply(
            raise(variable('x'), real(3)),
            variable('y')
          )
        ),
        multiply(variable('y'), raise(variable('x'), real(5)))
      )
    })

    it('isA2xEa_Ea: combines nested multiplications involving similar exponentiations', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(
            variable('y'), 
            raise(variable('x'), real(3))
          ),
          square(variable('x'))
        ),
        multiply(variable('y'), raise(variable('x'), real(5)))
      )
    })

    it('isEaxA2_Ea: combines nested multiplications involving similar exponentiations', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(
            raise(variable('x'), real(3)),
            variable('y')
          ),
          square(variable('x'))
        ),
        multiply(variable('y'), raise(variable('x'), real(5)))
      )
    })

    it('isA1_A1xA2: combines nested multiplications involving similar terms', () => {
      expectToEqualWithSnapshot(
        multiply(
          variable('x'),
          multiply(variable('x'), variable('y'))
        ),
        multiply(variable('y'), square(variable('x')))
      )
    })

    it('isA1_A2xA1: combines nested multiplications involving similar terms', () => {
      expectToEqualWithSnapshot(
        multiply(
          variable('x'),
          multiply(variable('y'), variable('x'))
        ),
        multiply(variable('y'), square(variable('x')))
      )
    })

    it('isA1xA2_A1: combines nested multiplications involving similar terms', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(variable('x'), variable('y')),
          variable('x')
        ),
        multiply(variable('y'), square(variable('x')))
      )
    })

    it('isA2xA1_A1: combines nested multiplications involving similar terms', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(variable('y'), variable('x')),
          variable('x')
        ),
        multiply(variable('y'), square(variable('x')))
      )
    })

    it('isA1_A2xEa1: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          variable('x'),
          multiply(variable('y'), square(variable('x')))
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    it('isA1_Ea1xA2: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          variable('x'),
          multiply(square(variable('x')), variable('y'))
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    it('isA2xEa1_A1: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(variable('y'), square(variable('x'))),
          variable('x')
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    it('isEa1xA2_A1: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(square(variable('x')), variable('y')),
          variable('x')
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    // isEa1_A1xA2
    it('isEa1_A1xA2: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          square(variable('x')),
          multiply(variable('x'), variable('y'))
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    // isEa1_A2xA1
    it('isEa1_A2xA1: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          square(variable('x')),
          multiply(variable('y'), variable('x'))
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    // isA1xA2_Ea1
    it('isA1xA2_Ea1: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(variable('x'), variable('y')),
          square(variable('x'))
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })

    // isA2xA1_Ea1
    it('isA2xA1_Ea1: adds to an exponential across nested multiplications', () => {
      expectToEqualWithSnapshot(
        multiply(
          multiply(variable('y'), variable('x')),
          square(variable('x'))
        ),
        multiply(variable('y'), raise(variable('x'), real(3)))
      )
    })
  })
})

describe('negate', () => {
  it('returns a Writer<Multiplication> for variable inputs', () => {
    expectToEqualWithSnapshot(
      negate(variable('x')),
      multiply(real(-1), variable('x'))
    )
  })

  it('results in a real with negative value, when real', () => {
    expectToEqualWithSnapshot(
      negate(real(1)),
      real(-1)
    )
  })
})

describe('double', () => {
  it('returns a Writer<Real> for real inputs', () => {
    expectToEqualWithSnapshot(
      double(real(5)),
      real(10)
    )
  })

  it('returns a Writer<Multiplication> for variable inputs', () => {
    expectToEqualWithSnapshot(
      double(variable('x')),
      multiply(real(2), variable('x'))
    )
  })
})

describe('divide', () => {
  it('results in a division of the two real arguments', () => {
    expectToEqualWithSnapshot(
      divide(real(10), real(5)),
      real(2)
    )
  })

  it('is the multiplication of the numerator by the reciprocal of the denominator', () => {
    expectToEqualWithSnapshot(
      divide(real(2), variable('x')),
      multiply(real(2), reciprocal(variable('x')))
    )
  })

  it('handles division by zero correctly', () => {
    expectToEqualWithSnapshot(
      divide(variable('x'), real(0)),
      real(Infinity)
    )
  })

  // NOTE: Result should be `0.2-0.4i`, but imprecision of floating point math
  it('properly calculates real / complex division', () => {
    expectToEqualWithSnapshot(
      divide(real(1), complex(1, 2)),
      complex(0.20000000000000004, -0.39999999999999997)
    )
  })

  it('properly handles dividing complex 0 by another complex', () => {
    expectToEqualWithSnapshot(
      divide(complex(0, 0), complex(0, 2)),
      complex(0, 0)
    )
  })

  it('properly handles dividing a complex by complex 0', () => {
    expectToEqualWithSnapshot(
      divide(complex(0, 2), complex(0, 0)), 
      complex(0, Infinity)
    )
  })

  it('properly divides a complex value by complex 1', () => {
    expectToEqualWithSnapshot(
      divide(complex(2, 0), complex(1, 0)), 
      complex(2, 0)
    )
  })

  it('properly divides complex negative infinity by complex 1', () => {
    expectToEqualWithSnapshot(
      divide(complex(-Infinity, 0), complex(1, 0)), 
      complex(-Infinity, 0)
    )
  })

  it('a: cancels like terms in a division of multiplications', () => {
    expectToEqualWithSnapshot(
      divide(
        multiply(variable('x'), variable('y')), 
        multiply(variable('z'), variable('y'))
      ),
      divide(variable('x'), variable('z'))
    )
  })

  it('b; cancels like terms in a division of multiplications', () => {
    expectToEqualWithSnapshot(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('z'))
      ),
      divide(variable('y'), variable('z'))
    )
  })

  it('c: cancels like terms in a division of multiplications', () => {
    expectToEqualWithSnapshot(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('y'), variable('z'))
      ),
      divide(variable('x'), variable('z'))
    )
  })

  it('d: cancels like terms in a division of multiplications', () => {
    expectToEqualWithSnapshot(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('z'), variable('x'))
      ),
      divide(variable('y'), variable('z'))
    )
  })
})
