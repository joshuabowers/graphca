// import { expectCloseTo } from './expectations'
// import { real } from './real'
// import { complex } from './complex'
// import { variable } from './variable'
// import { 
//   Multiplication, multiply, negate, double, divide, 
//   exponentialCollect, collectFromProducts, canFormExponential
// } from './multiplication'
// import { raise, reciprocal, square } from './exponentiation'

// describe('canFormExponential', () => {
//   it('is true for equivalent things', () => {
//     expect(canFormExponential(variable('x'), variable('x'))).toBeTruthy()
//   })

//   it('is false for non-equitable things', () => {
//     expect(canFormExponential(variable('y'), variable('x'))).toBeFalsy()
//   })

//   it('is true if a thing is multiplied by a product of itself', () => {
//     expect(canFormExponential(variable('x'), multiply(variable('y'), variable('x'))))
//   })

//   it('is true if an exponential is multiplied by a multiplication of its base', () => {
//     expect(canFormExponential(square(variable('x')), double(variable('x'))))
//   })

//   it('is true if two products multiplied together have similar terms', () => {
//     expect(
//       canFormExponential(
//         multiply(variable('x'), variable('y')),
//         multiply(variable('x'), variable('z'))
//       )
//     ).toBeTruthy()
//   })

//   it('is true for two products dividing each other with similar terms', () => {
//     expect(
//       canFormExponential(
//         multiply(variable('x'), variable('y')),
//         reciprocal(multiply(variable('x'), variable('z')))
//       )
//     ).toBeTruthy()
//   })
// })

// describe('exponentialCollect', () => {
//   it('squares equivalent things', () => {
//     expect(exponentialCollect(variable('x'), variable('x'))).toEqual(
//       square(variable('x'))
//     )
//   })

//   it('creates a new exponential from a nested multiplication', () => {
//     expect(
//       exponentialCollect(variable('x'), multiply(variable('y'), variable('x')))
//     ).toEqual(multiply(variable('y'), square(variable('x'))))
//   })

//   it('collects an exponential across a multiplication', () => {
//     expect(
//       exponentialCollect(square(variable('x')), double(variable('x')))
//     ).toEqual(multiply(real(2), raise(variable('x'), real(3))))
//   })
// })

// describe('collectsFromProducts', () => {
//   it('squares equivalent things', () => {
//     expect(
//       collectFromProducts(
//         multiply(variable('x'), variable('y')),
//         multiply(variable('x'), variable('y'))
//       )
//     ).toEqual(multiply(square(variable('x')), square(variable('y'))))
//   })

//   it('collects like terms across multiplications', () => {
//     expect(
//       collectFromProducts(
//         multiply(variable('x'), variable('y')),
//         multiply(variable('x'), variable('z'))
//       )
//     ).toEqual(
//       multiply(
//         square(variable('x')),
//         multiply(variable('y'), variable('z'))
//       )
//     )
//   })
// })


import { expectWriter, expectCloseTo } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { ComplexInfinity } from '../primitives/complex'
import { real, complex, nan } from '../primitives'
import { variable } from '../variable'
import { $multiply, multiply, negate, double, divide } from './multiplication'
import { raise, square, reciprocal } from './exponentiation'

describe('$multiply', () => {
  it('returns an Action<Multiplication> for any input without logic', () => {
    expect($multiply(real(1), real(2))).toEqual([
      {
        clade: Clades.binary, genus: Genera.arithmetic, species: Species.multiply,
        left: real(1), right: real(2)
      },
      'multiplication'
    ])
  })
})

describe('multiply', () => {
  describe('when given two primitives', () => {
    it('is the product of two reals', () => {
      expectWriter(
        multiply(real(2), real(3))
      )(
        real(6).value,
        [[real(2).value, real(3).value], 'real multiplication']
      )
    })

    it('is the product of two complexes', () => {
      expectWriter(
        multiply(complex([2, 3]), complex([3, 4]))
      )(
        complex([-6, 17]).value,
        [[complex([2, 3]).value, complex([3, 4]).value], 'complex multiplication']
      )
    })

    it('is the product of mixed inputs', () => {
      expectWriter(
        multiply(complex([2, 3]), real(5))
      )(
        complex([10, 15]).value,
        [real(5).value, 'cast to complex'],
        [[complex([2, 3]).value, complex([5, 0]).value], 'complex multiplication']
      )
    })

    it('multiplies complex infinity against complex 1 correctly', () => {
      expectWriter(
        multiply(ComplexInfinity, complex([1, 0]))
      )(
        complex([Infinity, 0]).value,
        [[ComplexInfinity.value, complex([1, 0]).value], 'complex multiplication']
      )
    })

    it('multiplies a complex wrapped real by a pure imaginary correctly', () => {
      expectWriter(
        multiply(complex([Infinity, 0]), complex([0, 3]))
      )(
        complex([0, Infinity]).value,
        [[complex([Infinity, 0]).value, complex([0, 3]).value], 'complex multiplication']
      )
    })

    it('multiplies a pure imaginary by a complex wrapped real correctly', () => {
      expectWriter(
        multiply(complex([0, 3]), complex([Infinity, 0]))
      )(
        complex([0, Infinity]).value,
        [[complex([0, 3]).value, complex([Infinity, 0]).value], 'complex multiplication']
      )
    })
  })

  describe('when given a primitive and a not primitive', () => {
    it('reorders a real right multiplicand to the left', () => {
      expectWriter(
        multiply(variable('x'), real(5))
      )(
        $multiply(real(5), variable('x'))[0],
        [[variable('x').value, real(5).value], 'reorder operands'],
        [[real(5).value, variable('x').value], 'multiplication']
      )
    })

    it('reorder a complex right multiplicand to the left', () => {
      expectWriter(
        multiply(variable('x'), complex([0, 1]))
      )(
        $multiply(complex([0, 1]), variable('x'))[0],
        [[variable('x').value, complex([0, 1]).value], 'reorder operands'],
        [[complex([0, 1]).value, variable('x').value], 'multiplication']
      )
    })
  })

  describe('when dealing with 0, 1, or (+/-)Infinity', () => {
    it('is NaN if given 0 and Infinity', () => {
      expectWriter(
        multiply(real(0), real(Infinity))
      )(
        nan.value,
        [[real(0).value, real(Infinity).value], 'incalculable']
      )
    })

    it('is real 0 if the left is real 0', () => {
      expectWriter(
        multiply(real(0), variable('x'))
      )(
        real(0).value,
        [[real(0).value, variable('x').value], 'zero absorption']
      )
    })

    it('is real 0 if the right is real 0', () => {
      expectWriter(
        multiply(variable('x'), real(0))
      )(
        real(0).value,
        [[variable('x').value, real(0).value], 'reorder operands'],
        [[real(0).value, variable('x').value], 'zero absorption']
      )
    })

    it('is infinity if left is infinity', () => {
      expectWriter(
        multiply(real(Infinity), variable('x'))
      )(
        real(Infinity).value,
        [[real(Infinity).value, variable('x').value], 'infinite absorption']
      )
    })

    it('is infinity if right is infinity', () => {
      expectWriter(
        multiply(variable('x'), real(Infinity))
      )(
        real(Infinity).value,
        [[variable('x').value, real(Infinity).value], 'reorder operands'],
        [[real(Infinity).value, variable('x').value], 'infinite absorption']
      )
    })

    it('is negative infinity if left is negative infinity', () => {
      expectWriter(
        multiply(real(-Infinity), variable('x'))
      )(
        real(-Infinity).value,
        [[real(-Infinity).value, variable('x').value], 'infinite absorption']
      )
    })

    it('is negative infinity if right is negative infinity', () => {
      expectWriter(
        multiply(variable('x'), real(-Infinity))
      )(
        real(-Infinity).value,
        [[variable('x').value, real(-Infinity).value], 'reorder operands'],
        [[real(-Infinity).value, variable('x').value], 'infinite absorption']
      )
    })

    it('is the right if the left is 1', () => {
      expectWriter(
        multiply(real(1), variable('x'))
      )(
        variable('x').value,
        [[real(1).value, variable('x').value], 'multiplicative identity']
      )
    })

    it('is the left if the right is 1', () => {
      expectWriter(
        multiply(variable('x'), real(1))
      )(
        variable('x').value,
        [[variable('x').value, real(1).value], 'reorder operands'],
        [[real(1).value, variable('x').value], 'multiplicative identity']
      )
    })
  })

  describe('when dealing with nested multiplications with primitives', () => {
    it('multiplies primitives across nested multiplications', () => {
      expectWriter(
        multiply(real(5), multiply(variable('x'), complex([1, 1])))
      )(
        multiply(complex([5, 5]), variable('x')).value,
        [[variable('x').value, complex([1, 1]).value], 'reorder operands'],
        [[complex([1, 1]).value, variable('x').value], 'multiplication'],
        [
          [real(5).value, multiply(complex([1, 1]), variable('x')).value], 
          'primitive coalescence'
        ],
        [real(5).value, 'cast to complex'],
        [[complex([5, 0]).value, complex([1, 1]).value], 'complex multiplication'],
        [[complex([5, 5]).value, variable('x').value], 'multiplication']
      )
    })
  })

  describe('when dealing with equivalent subtrees', () => {
    it('squares the left if the right is equivalent', () => {
      expectWriter(
        multiply(variable('x'), variable('x'))
      )(
        square(variable('x')).value,
        [
          [variable('x').value, variable('x').value], 
          'equivalence: replaced with square'
        ],
        [[variable('x').value, real(2).value], 'exponentiation']
      )
    })

    it('adds to the power when multiplying by the base from the left', () => {
      expectWriter(
        multiply(variable('x'), square(variable('x')))
      )(
        raise(variable('x'), real(3)).value,
        [[variable('x').value, real(2).value], 'exponentiation'],
        [[variable('x').value, square(variable('x')).value], 'combined like terms'],
        [[real(1).value, real(2).value], 'real addition'],
        [[variable('x').value, real(3).value], 'exponentiation']
      )
    })

    it('adds to the power when multiplying by the base from the right', () => {
      expectWriter(
        multiply(square(variable('x')), variable('x'))
      )(
        raise(variable('x'), real(3)).value,
        [[variable('x').value, real(2).value], 'exponentiation'],
        [[square(variable('x')).value, variable('x').value], 'combined like terms'],
        [[real(1).value, real(2).value], 'real addition'],
        [[variable('x').value, real(3).value], 'exponentiation']
      )
    })

    it('combines equivalently-based powers together', () => {
      expectWriter(
        multiply(square(variable('x')), raise(variable('x'), real(3)))
      )(
        raise(variable('x'), real(5)).value,
        [[variable('x').value, real(2).value], 'exponentiation'],
        [[variable('x').value, real(3).value], 'exponentiation'],
        [
          [square(variable('x')).value, raise(variable('x'), real(3)).value],
          'combined like terms'
        ],
        [[real(2).value, real(3).value], 'real addition'],
        [[variable('x').value, real(5).value], 'exponentiation']
      )
    })
  })

  describe('when dealing with exponentiations', () => {
    it('isEa_A2xEa: combines nested multiplications involving similar exponentiations', () => {
      expect(
        multiply(
          square(variable('x')), 
          multiply(
            variable('y'), 
            raise(variable('x'), real(3))
          )
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(5))).value
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
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(5))).value
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
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(5))).value
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
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(5))).value
      )
    })

    it('isA1_A1xA2: combines nested multiplications involving similar terms', () => {
      expect(
        multiply(
          variable('x'),
          multiply(variable('x'), variable('y'))
        ).value
      ).toEqual(
        multiply(variable('y'), square(variable('x'))).value
      )
    })

    it('isA1_A2xA1: combines nested multiplications involving similar terms', () => {
      expect(
        multiply(
          variable('x'),
          multiply(variable('y'), variable('x'))
        ).value
      ).toEqual(
        multiply(variable('y'), square(variable('x'))).value
      )
    })

    it('isA1xA2_A1: combines nested multiplications involving similar terms', () => {
      expect(
        multiply(
          multiply(variable('x'), variable('y')),
          variable('x')
        ).value
      ).toEqual(
        multiply(variable('y'), square(variable('x'))).value
      )
    })

    it('isA2xA1_A1: combines nested multiplications involving similar terms', () => {
      expect(
        multiply(
          multiply(variable('y'), variable('x')),
          variable('x')
        ).value
      ).toEqual(
        multiply(variable('y'), square(variable('x'))).value
      )    
    })

    it('isA1_A2xEa1: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          variable('x'),
          multiply(variable('y'), square(variable('x')))
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    it('isA1_Ea1xA2: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          variable('x'),
          multiply(square(variable('x')), variable('y'))
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    it('isA2xEa1_A1: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          multiply(variable('y'), square(variable('x'))),
          variable('x')
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    it('isEa1xA2_A1: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          multiply(square(variable('x')), variable('y')),
          variable('x')
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    // isEa1_A1xA2
    it('isEa1_A1xA2: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          square(variable('x')),
          multiply(variable('x'), variable('y'))
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    // isEa1_A2xA1
    it('isEa1_A2xA1: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          square(variable('x')),
          multiply(variable('y'), variable('x'))
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    // isA1xA2_Ea1
    it('isA1xA2_Ea1: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          multiply(variable('x'), variable('y')),
          square(variable('x'))
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })

    // isA2xA1_Ea1
    it('isA2xA1_Ea1: adds to an exponential across nested multiplications', () => {
      expect(
        multiply(
          multiply(variable('y'), variable('x')),
          square(variable('x'))
        ).value
      ).toEqual(
        multiply(variable('y'), raise(variable('x'), real(3))).value
      )
    })
  })
})

describe('negate', () => {
  it('returns a Writer<Multiplication> for variable inputs', () => {
    expectWriter(
      negate(variable('x'))
    )(
      multiply(real(-1), variable('x')).value,
      [[real(-1).value, variable('x').value], 'multiplication']
    )
  })

  it('results in a real with negative value, when real', () => {
    expectWriter(
      negate(real(1))
    )(
      real(-1),
      [[real(-1), real(1)], 'real multiplication']
    )
  })
})

describe('double', () => {
  it('returns a Writer<Real> for real inputs', () => {
    expectWriter(
      double(real(5))
    )(
      real(10).value,
      [[real(2).value, real(5).value], 'real multiplication']
    )
  })

  it('returns a Writer<Multiplication for variable inputs', () => {
    expectWriter(
      double(variable('x'))
    )(
      multiply(real(2), variable('x')).value,
      [[real(2).value, variable('x').value], 'multiplication']
    )
  })
})

describe('divide', () => {
  it('results in a division of the two real arguments', () => {
    expectWriter(
      divide(real(10), real(5))
    )(
      real(2),
      [[real(5), real(-1)], 'real exponentiation'],
      [[real(10), real(0.2)], 'real multiplication']
    )
  })

  it('is the multiplication of the numerator by the reciprocal of the denominator', () => {
    expectWriter(
      divide(real(2), variable('x'))
    )(
      multiply(real(2), reciprocal(variable('x'))),
      [[variable('x'), real(-1)], 'exponentiation'],
      [[real(2), reciprocal(variable('x'))], 'multiplication']
    )
  })

  it('handles division by zero correctly', () => {
    expectWriter(
      divide(variable('x'), real(0))
    )(
      real(Infinity),
      [[real(0), real(-1)], 'division by zero'],
      [[variable('x'), real(Infinity)], 'reorder operands'],
      [[real(Infinity), variable('x')], 'infinite absorption']
    )
  })

  it('properly calculates real / complex division', () => {
    expectCloseTo(divide(real(1), complex([1, 2])), complex([0.2, -0.4]), 10)
  })

  it('properly handles dividing complex 0 by another complex', () => {
    expectCloseTo(divide(complex([0, 0]), complex([0, 2])), complex([0, 0]), 10)
  })

  it('properly handles dividing a complex by complex 0', () => {
    expectCloseTo(divide(complex([0, 2]), complex([0, 0])), complex([0, Infinity]), 10)
  })

  it('properly divides a complex value by complex 1', () => {
    expectCloseTo(divide(complex([2, 0]), complex([1, 0])), complex([2, 0]), 10)
  })

  it('properly divides complex negative infinity by complex 1', () => {
    expectCloseTo(divide(complex([-Infinity, 0]), complex([1, 0])), complex([-Infinity, 0]), 10)
  })

  it('a: cancels like terms in a division of multiplications', () => {
    expectWriter(
      divide(
        multiply(variable('x'), variable('y')), 
        multiply(variable('z'), variable('y'))
      )
    )(
      divide(variable('x'), variable('z')),
      [[variable('x'), variable('y')], 'multiplication'],
      [[variable('x'), variable('y')], 'multiplication'],
      [[multiply(variable('z'), variable('y')), real(-1)], 'exponential distribution'],
      [
        [
          multiply(variable('x'), variable('y')), 
          reciprocal(multiply(variable('z'), variable('y')))
        ],
        'term collecting'
      ],
      [[variable('z'), real(-1)], 'exponentiation'],
      [[variable('x'), reciprocal(variable('z'))], 'multiplication']
    )
  })

  it('b; cancels like terms in a division of multiplications', () => {
    expectWriter(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('z'))
      )
    )(
      divide(variable('y'), variable('z'))
    )
  })

  it('c: cancels like terms in a division of multiplications', () => {
    expectWriter(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('y'), variable('z'))
      )
    )(
      divide(variable('x'), variable('z'))
    )
  })

  it('d: cancels like terms in a division of multiplications', () => {
    expectWriter(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('z'), variable('x'))
      )
    )(
      divide(variable('y'), variable('z'))
    )
  })
})
