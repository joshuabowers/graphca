import { unit } from '../monads/writer'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'
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
        ['2', '2', 'given primitive'],
        ['3', '3', 'given primitive'],
        ['2 * 3', '6', 'real multiplication'],
        ['6', '6', 'given primitive']
      )
    })

    it('is the product of two complexes', () => {
      expectWriterTreeNode(
        multiply(complex([2,3]), complex([3,4])),
        complex([-6,17])
      )(
        [`2+3${Unicode.i}`, `2+3${Unicode.i}`, 'given primitive'],
        [`3+4${Unicode.i}`, `3+4${Unicode.i}`, 'given primitive'],
        [
          `2+3${Unicode.i} * 3+4${Unicode.i}`,
          `-6+17${Unicode.i}`,
          'complex multiplication'
        ],
        [`-6+17${Unicode.i}`, `-6+17${Unicode.i}`, 'given primitive']
      )
    })

    it('is the product of mixed inputs', () => {
      expectWriterTreeNode(
        multiply(complex([2,3]), real(5)),
        complex([10,15])
      )(
        [`2+3${Unicode.i}`, `2+3${Unicode.i}`, 'given primitive'],
        ['5', '5', 'given primitive'],
        ['5', `5+0${Unicode.i}`, 'cast to Complex from Real'],
        [
          `2+3${Unicode.i} * 5+0${Unicode.i}`,
          `10+15${Unicode.i}`,
          'complex multiplication'
        ],
        [`10+15${Unicode.i}`, `10+15${Unicode.i}`, 'given primitive']
      )
    })

    it('multiplies complex infinity against complex 1 correctly', () => {
      expectWriterTreeNode(
        multiply(ComplexInfinity, complex([1,0])),
        complex([Infinity, 0])
      )(
        [Unicode.complexInfinity, Unicode.complexInfinity, 'given primitive'],
        [`1+0${Unicode.i}`, `1+0${Unicode.i}`, 'given primitive'],
        [
          `${Unicode.complexInfinity} * 1+0${Unicode.i}`,
          `${Unicode.infinity}+0${Unicode.i}`,
          'complex multiplication'
        ],
        [
          `${Unicode.infinity}+0${Unicode.i}`,
          `${Unicode.infinity}+0${Unicode.i}`,
          'given primitive'
        ]
      )
    })

    it('multiplies a complex wrapped real by a pure imaginary correctly', () => {
      expectWriterTreeNode(
        multiply(complex([Infinity, 0]), complex([0, 3])),
        complex([0, Infinity])
      )(
        [
          `${Unicode.infinity}+0${Unicode.i}`, 
          `${Unicode.infinity}+0${Unicode.i}`, 
          'given primitive'
        ],
        [`0+3${Unicode.i}`, `0+3${Unicode.i}`, 'given primitive'],
        [
          `${Unicode.infinity}+0${Unicode.i} * 0+3${Unicode.i}`,
          `0+${Unicode.infinity}${Unicode.i}`,
          'complex multiplication'
        ],
        [
          `0+${Unicode.infinity}${Unicode.i}`,
          `0+${Unicode.infinity}${Unicode.i}`,
          'given primitive'
        ]
      )
    })

    it('multiplies a pure imaginary by a complex wrapped real correctly', () => {
      expectWriterTreeNode(
        multiply(complex([0, 3]), complex([Infinity, 0])),
        complex([0, Infinity])
      )(
        [`0+3${Unicode.i}`, `0+3${Unicode.i}`, 'given primitive'],
        [
          `${Unicode.infinity}+0${Unicode.i}`, 
          `${Unicode.infinity}+0${Unicode.i}`, 
          'given primitive'
        ],
        [
          `0+3${Unicode.i} * ${Unicode.infinity}+0${Unicode.i}`,
          `0+${Unicode.infinity}${Unicode.i}`,
          'complex multiplication'
        ],
        [
          `0+${Unicode.infinity}${Unicode.i}`,
          `0+${Unicode.infinity}${Unicode.i}`,
          'given primitive'
        ]
      )
    })
  })

  describe('when given a primitive and a not primitive', () => {
    it('reorders a real right multiplicand to the left', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(5)),
        $multiply(unit(real(5).value), unit(variable('x').value))[0]
      )(
        ['x', 'x', 'given variable'],
        ['5', '5', 'given primitive'],
        ['x * 5', '5 * x', 'reorder operands'],
        ['5 * x', '(5*x)', 'multiplication']
      )
    })

    it('reorder a complex right multiplicand to the left', () => {
      expectWriterTreeNode(
        multiply(variable('x'), complex([0, 1])),
        $multiply(unit(complex([0, 1]).value), unit(variable('x').value))[0]
      )(
        ['x', 'x', 'given variable'],
        [`0+1${Unicode.i}`, `0+1${Unicode.i}`, 'given primitive'],
        [
          `x * 0+1${Unicode.i}`,
          `0+1${Unicode.i} * x`,
          'reorder operands'
        ],
        [
          `0+1${Unicode.i} * x`,
          `(0+1${Unicode.i}*x)`,
          'multiplication'
        ]
      )
    })
  })

  describe('when dealing with 0, 1, or (+/-)Infinity', () => {
    it('is NaN if given 0 and Infinity', () => {
      expectWriterTreeNode(
        multiply(real(0), real(Infinity)),
        nan
      )(
        ['0', '0', 'given primitive'],
        [Unicode.infinity, Unicode.infinity, 'given primitive'],
        [
          `0 * ${Unicode.infinity}`,
          'NaN',
          'incalculable'
        ]
      )
    })

    it('is real 0 if the left is real 0', () => {
      expectWriterTreeNode(
        multiply(real(0), variable('x')),
        real(0)
      )(
        ['0', '0', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['0 * x', '0', 'zero absorption'],
        ['0', '0', 'given primitive']
      )
    })

    it('is real 0 if the right is real 0', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(0)),
        real(0)
      )(
        ['x', 'x', 'given variable'],
        ['0', '0', 'given primitive'],
        ['x * 0', '0 * x', 'reorder operands'],
        ['0 * x', '0', 'zero absorption'],
        ['0', '0', 'given primitive']
      )
    })

    it('is infinity if left is infinity', () => {
      expectWriterTreeNode(
        multiply(real(Infinity), variable('x')),
        real(Infinity)
      )(
        [Unicode.infinity, Unicode.infinity, 'given primitive'],
        ['x', 'x', 'given variable'],
        [`${Unicode.infinity} * x`, Unicode.infinity, 'infinite absorption'],
        [Unicode.infinity, Unicode.infinity, 'given primitive']
      )
    })

    it('is infinity if right is infinity', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(Infinity)),
        real(Infinity)
      )(
        ['x', 'x', 'given variable'],
        [Unicode.infinity, Unicode.infinity, 'given primitive'],
        [
          `x * ${Unicode.infinity}`, 
          `${Unicode.infinity} * x`,
          'reorder operands'
        ],
        [`${Unicode.infinity} * x`, Unicode.infinity, 'infinite absorption'],
        [Unicode.infinity, Unicode.infinity, 'given primitive']
      )
    })

    it('is negative infinity if left is negative infinity', () => {
      expectWriterTreeNode(
        multiply(real(-Infinity), variable('x')),
        real(-Infinity)
      )(
        [`-${Unicode.infinity}`, `-${Unicode.infinity}`, 'given primitive'],
        ['x', 'x', 'given variable'],
        [
          `-${Unicode.infinity} * x`,
          `-${Unicode.infinity}`,
          'infinite absorption'
        ],
        [`-${Unicode.infinity}`, `-${Unicode.infinity}`, 'given primitive'],
      )
    })

    it('is negative infinity if right is negative infinity', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(-Infinity)),
        real(-Infinity)
      )(
        ['x', 'x', 'given variable'],
        [`-${Unicode.infinity}`, `-${Unicode.infinity}`, 'given primitive'],
        [
          `x * -${Unicode.infinity}`,
          `-${Unicode.infinity} * x`,
          'reorder operands'
        ],
        [
          `-${Unicode.infinity} * x`,
          `-${Unicode.infinity}`,
          'infinite absorption'
        ],
        [`-${Unicode.infinity}`, `-${Unicode.infinity}`, 'given primitive'],
      )
    })

    it('is the right if the left is 1', () => {
      expectWriterTreeNode(
        multiply(real(1), variable('x')),
        variable('x')
      )(
        ['1', '1', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['1 * x', 'x', 'multiplicative identity']
      )
    })

    it('is the left if the right is 1', () => {
      expectWriterTreeNode(
        multiply(variable('x'), real(1)),
        variable('x')
      )(
        ['x', 'x', 'given variable'],
        ['1', '1', 'given primitive'],
        ['x * 1', '1 * x', 'reorder operands'],
        ['1 * x', 'x', 'multiplicative identity']
      )
    })
  })

  describe('when dealing with nested multiplications with primitives', () => {
    it('multiplies primitives across nested multiplications', () => {
      expectWriterTreeNode(
        multiply(real(5), multiply(variable('x'), complex([1, 1]))),
        multiply(complex([5, 5]), variable('x'))
      )(
        ['5', '5', 'given primitive'],
        ['x', 'x', 'given variable'],
        [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
        [`x * 1+1${Unicode.i}`, `1+1${Unicode.i} * x`, 'reorder operands'],
        [
          `1+1${Unicode.i} * x`,
          `(1+1${Unicode.i}*x)`,
          'multiplication'
        ],
        [
          `5 * (1+1${Unicode.i}*x)`, 
          `(5 * 1+1${Unicode.i}) * x`,
          'multiplicative associativity'
        ],
        ['5', `5+0${Unicode.i}`, 'cast to Complex from Real'],
        [
          `5+0${Unicode.i} * 1+1${Unicode.i}`,
          `5+5${Unicode.i}`,
          'complex multiplication'
        ],
        [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
        [
          `5+5${Unicode.i} * x`,
          `(5+5${Unicode.i}*x)`,
          'multiplication'
        ]
      )
    })
  })

  describe('when dealing with equivalent subtrees', () => {
    it.skip('squares the left if the right is equivalent', () => {
      // expectWriter(
      //   multiply(variable('x'), variable('x'))
      // )(
      //   square(variable('x')).value,
      //   [
      //     [variable('x').value, variable('x').value], 
      //     'equivalence: replaced with square'
      //   ],
      //   [[variable('x').value, real(2).value], 'exponentiation']
      // )
    })

    it.skip('adds to the power when multiplying by the base from the left', () => {
      // expectWriter(
      //   multiply(variable('x'), square(variable('x')))
      // )(
      //   raise(variable('x'), real(3)).value,
      //   [[variable('x').value, real(2).value], 'exponentiation'],
      //   [[variable('x').value, square(variable('x')).value], 'combined like terms'],
      //   [[real(1).value, real(2).value], 'real addition'],
      //   [[variable('x').value, real(3).value], 'exponentiation']
      // )
    })

    it.skip('adds to the power when multiplying by the base from the right', () => {
      // expectWriter(
      //   multiply(square(variable('x')), variable('x'))
      // )(
      //   raise(variable('x'), real(3)).value,
      //   [[variable('x').value, real(2).value], 'exponentiation'],
      //   [[square(variable('x')).value, variable('x').value], 'combined like terms'],
      //   [[real(1).value, real(2).value], 'real addition'],
      //   [[variable('x').value, real(3).value], 'exponentiation']
      // )
    })

    it.skip('combines equivalently-based powers together', () => {
      // expectWriter(
      //   multiply(square(variable('x')), raise(variable('x'), real(3)))
      // )(
      //   raise(variable('x'), real(5)).value,
      //   [[variable('x').value, real(2).value], 'exponentiation'],
      //   [[variable('x').value, real(3).value], 'exponentiation'],
      //   [
      //     [square(variable('x')).value, raise(variable('x'), real(3)).value],
      //     'combined like terms'
      //   ],
      //   [[real(2).value, real(3).value], 'real addition'],
      //   [[variable('x').value, real(5).value], 'exponentiation']
      // )
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
  it.skip('returns a Writer<Multiplication> for variable inputs', () => {
    // expectWriter(
    //   negate(variable('x'))
    // )(
    //   multiply(real(-1), variable('x')).value,
    //   [[real(-1).value, variable('x').value], 'multiplication']
    // )
  })

  it.skip('results in a real with negative value, when real', () => {
    // expectWriter(
    //   negate(real(1))
    // )(
    //   real(-1),
    //   [[real(-1), real(1)], 'real multiplication']
    // )
  })
})

describe('double', () => {
  it.skip('returns a Writer<Real> for real inputs', () => {
    // expectWriter(
    //   double(real(5))
    // )(
    //   real(10).value,
    //   [[real(2).value, real(5).value], 'real multiplication']
    // )
  })

  it.skip('returns a Writer<Multiplication for variable inputs', () => {
    // expectWriter(
    //   double(variable('x'))
    // )(
    //   multiply(real(2), variable('x')).value,
    //   [[real(2).value, variable('x').value], 'multiplication']
    // )
  })
})

describe('divide', () => {
  it.skip('results in a division of the two real arguments', () => {
    // expectWriter(
    //   divide(real(10), real(5))
    // )(
    //   real(2),
    //   [[real(5), real(-1)], 'real exponentiation'],
    //   [[real(10), real(0.2)], 'real multiplication']
    // )
  })

  it.skip('is the multiplication of the numerator by the reciprocal of the denominator', () => {
    // expectWriter(
    //   divide(real(2), variable('x'))
    // )(
    //   multiply(real(2), reciprocal(variable('x'))),
    //   [[variable('x'), real(-1)], 'exponentiation'],
    //   [[real(2), reciprocal(variable('x'))], 'multiplication']
    // )
  })

  it.skip('handles division by zero correctly', () => {
    // expectWriter(
    //   divide(variable('x'), real(0))
    // )(
    //   real(Infinity),
    //   [[real(0), real(-1)], 'division by zero'],
    //   [[variable('x'), real(Infinity)], 'reorder operands'],
    //   [[real(Infinity), variable('x')], 'infinite absorption']
    // )
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
