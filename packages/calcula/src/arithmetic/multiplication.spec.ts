import { unit } from '../monads/writer'
import { 
  expectCloseTo, expectWriterTreeNode,
  realOps, complexOps, variableOps, addOps, multiplyOps, raiseOps
} from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { ComplexInfinity } from '../primitives/complex'
import { real, complex, nan } from '../primitives'
import { variable } from '../variable'
import { $multiply, multiply, negate, double, divide } from './multiplication'
import { raise, square, reciprocal } from './exponentiation'
import { Unicode } from '../Unicode'

describe('$multiply', () => {
  it('generates a Multiplication for a pair of TreeNode inputs', () => {
    expect(
      $multiply(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.arithmetic, species: Species.multiply,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('multiply', () => {
  describe('when given two primitives', () => {
    it('is the product of two reals', () => {
      expectWriterTreeNode(
        multiply(real(2), real(3)),
        real(6)
      )(
        ...multiplyOps(
          'real multiplication',
          realOps('2'),
          realOps('3'),
          realOps('6')
        )
      )
    })

    it('is the product of two complexes', () => {
      expectWriterTreeNode(
        multiply(complex([2,3]), complex([3,4])),
        complex([-6,17])
      )(
        ...multiplyOps(
          'complex multiplication',
          complexOps('2', '3'),
          complexOps('3', '4'),
          complexOps('-6', '17')
        )
      )
    })

    it('is the product of mixed inputs', () => {
      expectWriterTreeNode(
        multiply(complex([2,3]), real(5)),
        complex([10,15])
      )(
        ...multiplyOps(
          'complex multiplication',
          complexOps('2', '3'),
          [
            ...realOps('5'),
            [`5+0${Unicode.i}`, 'cast to Complex from Real']
          ],
          complexOps('10', '15')
        )
      )
    })

    it('multiplies complex infinity against complex 1 correctly', () => {
      expectWriterTreeNode(
        multiply(ComplexInfinity, complex([1,0])),
        complex([Infinity, 0])
      )(
        ...multiplyOps(
          'complex multiplication',
          complexOps(Unicode.infinity, 'NaN'),
          complexOps('1', '0'),
          complexOps(Unicode.infinity, '0')
        )
      )
    })

    it('multiplies a complex wrapped real by a pure imaginary correctly', () => {
      expectWriterTreeNode(
        multiply(complex([Infinity, 0]), complex([0, 3])),
        complex([0, Infinity])
      )(
        ...multiplyOps(
          'complex multiplication',
          complexOps(Unicode.infinity, '0'),
          complexOps('0', '3'),
          complexOps('0', Unicode.infinity)
        )
      )
    })

    it('multiplies a pure imaginary by a complex wrapped real correctly', () => {
      expectWriterTreeNode(
        multiply(complex([0, 3]), complex([Infinity, 0])),
        complex([0, Infinity])
      )(
        ...multiplyOps(
          'complex multiplication',
          complexOps('0', '3'),
          complexOps(Unicode.infinity, '0'),
          complexOps('0', Unicode.infinity)
        )
      )
    })
  })

  describe('when given a primitive and a not primitive', () => {
    it('reorders a real right multiplicand to the left', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(5)),
        $multiply(real(5), variable('x'))[0]
      )(
        ...multiplyOps(
          'reorder operands',
          variableOps('x'),
          realOps('5'),
          multiplyOps(
            'created multiplication',
            realOps('5'),
            variableOps('x'),
            []
          )
        )
      )
    })

    it('reorder a complex right multiplicand to the left', () => {
      expectWriterTreeNode(
        multiply(variable('x'), complex([0, 1])),
        $multiply(complex([0, 1]), variable('x'))[0]
      )(
        ...multiplyOps(
          'reorder operands',
          variableOps('x'),
          complexOps('0', '1'),
          multiplyOps(
            'created multiplication',
            complexOps('0', '1'),
            variableOps('x'),
            []
          )
        )
      )
    })
  })

  describe('when dealing with 0, 1, or (+/-)Infinity', () => {
    it('is NaN if given 0 and Infinity', () => {
      expectWriterTreeNode(
        multiply(real(0), real(Infinity)),
        nan
      )(
        ...multiplyOps(
          'incalculable',
          realOps('0'),
          realOps(Unicode.infinity),
          [['NaN', 'not a number']]
        )
      )
    })

    it('is real 0 if the left is real 0', () => {
      expectWriterTreeNode(
        multiply(real(0), variable('x')),
        real(0)
      )(
        ...multiplyOps(
          'zero absorption',
          realOps('0'),
          variableOps('x'),
          realOps('0')
        )
      )
    })

    it('is real 0 if the right is real 0', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(0)),
        real(0)
      )(
        ...multiplyOps(
          'reorder operands',
          variableOps('x'),
          realOps('0'),
          multiplyOps(
            'zero absorption',
            realOps('0'),
            variableOps('x'),
            realOps('0')
          )
        )
      )
    })

    it('is infinity if left is infinity', () => {
      expectWriterTreeNode(
        multiply(real(Infinity), variable('x')),
        real(Infinity)
      )(
        ...multiplyOps(
          'infinite absorption',
          realOps(Unicode.infinity),
          variableOps('x'),
          realOps(Unicode.infinity)
        )
      )
    })

    it('is infinity if right is infinity', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(Infinity)),
        real(Infinity)
      )(
        ...multiplyOps(
          'reorder operands',
          variableOps('x'),
          realOps(Unicode.infinity),
          multiplyOps(
            'infinite absorption',
            realOps(Unicode.infinity),
            variableOps('x'),
            realOps(Unicode.infinity)
          )
        )
      )
    })

    it('is negative infinity if left is negative infinity', () => {
      expectWriterTreeNode(
        multiply(real(-Infinity), variable('x')),
        real(-Infinity)
      )(
        ...multiplyOps(
          'infinite absorption',
          realOps(`-${Unicode.infinity}`),
          variableOps('x'),
          realOps(`-${Unicode.infinity}`)
        )
      )
    })

    it('is negative infinity if right is negative infinity', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(-Infinity)),
        real(-Infinity)
      )(
        ...multiplyOps(
          'reorder operands',
          variableOps('x'),
          realOps(`-${Unicode.infinity}`),
          multiplyOps(
            'infinite absorption',
            realOps(`-${Unicode.infinity}`),
            variableOps('x'),
            realOps(`-${Unicode.infinity}`)
          )
        )
      )
    })

    it('is the right if the left is 1', () => {
      expectWriterTreeNode(
        multiply(real(1), variable('x')),
        variable('x')
      )(
        ...multiplyOps(
          'multiplicative identity',
          realOps('1'),
          variableOps('x'),
          variableOps('x')
        )
      )
    })

    it('is the left if the right is 1', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(1)),
        variable('x')
      )(
        ...multiplyOps(
          'reorder operands',
          variableOps('x'),
          realOps('1'),
          multiplyOps(
            'multiplicative identity',
            realOps('1'),
            variableOps('x'),
            variableOps('x')
          )
        )
      )
    })
  })

  describe('when dealing with nested multiplications with primitives', () => {
    it('multiplies primitives across nested multiplications', () => {
      expectWriterTreeNode(
        multiply(real(5), multiply(variable('x'), complex([1, 1]))),
        multiply(complex([5, 5]), variable('x'))
      )(
        ...multiplyOps(
          'multiplicative associativity',
          realOps('5'),
          multiplyOps(
            'reorder operands',
            variableOps('x'),
            complexOps('1', '1'),
            multiplyOps(
              'created multiplication',
              complexOps('1', '1'),
              variableOps('x'),
              []
            )
          ),
          multiplyOps(
            'created multiplication',
            multiplyOps(
              'complex multiplication',
              [
                ...realOps('5'),
                [`5+0${Unicode.i}`, 'cast to Complex from Real']
              ],
              complexOps('1', '1'),
              complexOps('5', '5')
            ),
            variableOps('x'),
            []
          )
        )
      )
    })
  })

  describe('when dealing with equivalent subtrees', () => {
    it('squares the left if the right is equivalent', () => {
      expectWriterTreeNode(
        multiply(variable('x'), variable('x')),
        square(variable('x'))
      )(
        ...multiplyOps(
          'equivalence: replaced with square',
          variableOps('x'),
          variableOps('x'),
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            realOps('2'),
            []
          )
        )
      )
    })

    it('adds to the power when multiplying by the base from the left', () => {
      expectWriterTreeNode(
        multiply(variable('x'), square(variable('x'))),
        raise(variable('x'), real(3))
      )(
        ...multiplyOps(
          'combined like terms',
          variableOps('x'),
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            realOps('2'),
            []
          ),
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            addOps(
              'real addition',
              realOps('1'),
              realOps('2'),
              realOps('3')
            ),
            []
          )
        )
      )
    })

    it('adds to the power when multiplying by the base from the right', () => {
      expectWriterTreeNode(
        multiply(square(variable('x')), variable('x')),
        raise(variable('x'), real(3))
      )(
        ...multiplyOps(
          'combined like terms',
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            realOps('2'),
            []
          ),
          variableOps('x'),
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            addOps(
              'real addition',
              realOps('1'),
              realOps('2'),
              realOps('3')
            ),
            []
          )
        )
      )
    })

    it('combines equivalently-based powers together', () => {
      expectWriterTreeNode(
        multiply(square(variable('x')), raise(variable('x'), real(3))),
        raise(variable('x'), real(5))
      )(
        ...multiplyOps(
          'combined like terms',
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            realOps('2'),
            []
          ),
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            realOps('3'),
            []
          ),
          raiseOps(
            'created exponentiation',
            variableOps('x'),
            addOps(
              'real addition',
              realOps('2'),
              realOps('3'),
              realOps('5')
            ),
            []
          )
        )
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
    expectWriterTreeNode(
      negate(variable('x')),
      multiply(real(-1), variable('x'))
    )(
      ...multiplyOps(
        'created multiplication',
        realOps('-1'),
        variableOps('x'),
        []
      )
    )
  })

  it('results in a real with negative value, when real', () => {
    expectWriterTreeNode(
      negate(real(1)),
      real(-1)
    )(
      ...multiplyOps(
        'real multiplication',
        realOps('-1'),
        realOps('1'),
        realOps('-1')
      )
    )
  })
})

describe('double', () => {
  it('returns a Writer<Real> for real inputs', () => {
    expectWriterTreeNode(
      double(real(5)),
      real(10)
    )(
      ...multiplyOps(
        'real multiplication',
        realOps('2'),
        realOps('5'),
        realOps('10')
      )
    )
  })

  it('returns a Writer<Multiplication for variable inputs', () => {
    expectWriterTreeNode(
      double(variable('x')),
      multiply(real(2), variable('x'))
    )(
      ...multiplyOps(
        'created multiplication',
        realOps('2'),
        variableOps('x'),
        []
      )
    )
  })
})

describe('divide', () => {
  it('results in a division of the two real arguments', () => {
    expectWriterTreeNode(
      divide(real(10), real(5)),
      real(2)
    )(
      ...multiplyOps(
        'real multiplication',
        realOps('10'),
        raiseOps(
          'real exponentiation',
          realOps('5'),
          realOps('-1'),
          realOps('0.2')
        ),
        realOps('2')
      )
    )
  })

  it('is the multiplication of the numerator by the reciprocal of the denominator', () => {
    expectWriterTreeNode(
      divide(real(2), variable('x')),
      multiply(real(2), reciprocal(variable('x')))
    )(
      ...multiplyOps(
        'created multiplication',
        realOps('2'),
        raiseOps(
          'created exponentiation',
          variableOps('x'),
          realOps('-1'),
          []
        ),
        []
      )
    )
  })

  it('handles division by zero correctly', () => {
    expectWriterTreeNode(
      divide(variable('x'), real(0)),
      real(Infinity)
    )(
      ...multiplyOps(
        'reorder operands',
        variableOps('x'),
        raiseOps(
          'division by zero',
          realOps('0'),
          realOps('-1'),
          realOps(Unicode.infinity)
        ),
        multiplyOps(
          'infinite absorption',
          realOps(Unicode.infinity),
          variableOps('x'),
          realOps(Unicode.infinity)
        )
      )
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
    expect(
      divide(
        multiply(variable('x'), variable('y')), 
        multiply(variable('z'), variable('y'))
      ).value
    ).toEqual(
      divide(variable('x'), variable('z')).value
    )
  })

  it('b; cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('x'), variable('z'))
      ).value
    ).toEqual(
      divide(variable('y'), variable('z')).value
    )
  })

  it('c: cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('y'), variable('z'))
      ).value
    ).toEqual(
      divide(variable('x'), variable('z')).value
    )
  })

  it('d: cancels like terms in a division of multiplications', () => {
    expect(
      divide(
        multiply(variable('x'), variable('y')),
        multiply(variable('z'), variable('x'))
      ).value
    ).toEqual(
      divide(variable('y'), variable('z')).value
    )
  })
})
