import { expectWriter } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex, boolean, nil, nan, isPrimitive } from '../primitives'
import { variable } from '../variable'
import { $add, add, subtract } from './addition'
import { double, multiply, negate } from './multiplication'

// describe('add', () => {

// NOTE: Factoring on hold pending broader application review. While it
// can lead to syntactically simpler trees, it can also lead to infinite
// loops with distributive rewrites.

//   describe('with {X * Y}, X', () => {
//     it('replaces the addition with a multiplication of an addition', () => {
//       expect(
//         add(multiply(variable('x'), variable('y')), variable('x'))
//       ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
//     })
//   })

//   describe('with {Y * X}, X', () => {
//     it('replaces the addition with a multiplication of an addition', () => {
//       expect(
//         add(multiply(variable('y'), variable('x')), variable('x'))
//       ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
//     })
//   })

//   describe('with X, {X * Y}', () => {
//     it('replaces the addition with a multiplication of an addition', () => {
//       expect(
//         add(variable('x'), multiply(variable('x'), variable('y')))
//       ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
//     })
//   })

//   describe('with X, {Y * X}', () => {
//     it('replaces the addition with a multiplication of an addition', () => {
//       expect(
//         add(variable('x'), multiply(variable('y'), variable('x')))
//       ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
//     })
//   })

//   describe('with {X * Z}, {Y * Z}', () => {
//     it('factors out z as a multiplication', () => {
//       expect(
//         add(multiply(variable('x'), variable('z')), multiply(variable('y'), variable('z')))
//       ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
//     })
//   })

//   describe('with {Z * X}, {Y * Z}', () => {
//     it('factors out z as a multiplication', () => {
//       expect(
//         add(multiply(variable('z'), variable('x')), multiply(variable('y'), variable('z')))
//       ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
//     })
//   })

//   describe('with {X * Z}, {Z * Y}', () => {
//     it('factors out z as a multiplication', () => {
//       expect(
//         add(multiply(variable('x'), variable('z')), multiply(variable('z'), variable('y')))
//       ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
//     })
//   })

//   describe('with {Z * X}, {Z * Y}', () => {
//     it('factors out z as a multiplication', () => {
//       expect(
//         add(multiply(variable('z'), variable('x')), multiply(variable('z'), variable('y')))
//       ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
//     })
//   })


// })

// describe('subtract', () => {


// })

describe('$add', () => {
  it('returns an Action<Addition> without logic', () => {
    expect($add(real(1), real(2))).toEqual([
      {
        clade: Clades.binary, genus: Genera.arithmetic, species: Species.add,
        left: real(1), right: real(2)
      },
      'addition'
    ])
  })
})

describe('add', () => {
  describe('when given pairs of primitives', () => {
    it('returns a Writer<Real> for two real inputs', () => {
      expectWriter(add(real(1), real(2)))(
        real(3).value,
        [[real(1).value, real(2).value], 'real addition']
      )
    })
  
    it('returns a Writer<Complex> for two complex inputs', () => {
      expectWriter(add(complex([1, 2]), complex([3, 4])))(
        complex([4, 6]).value,
        [
          [complex([1, 2]).value, complex([3, 4]).value],
          'complex addition'
        ]
      )
    })
  
    it('returns a Writer<Boolean> for two boolean inputs', () => {
      expectWriter(add(boolean(true), boolean(false)))(
        boolean(true).value,
        [
          [boolean(true).value, boolean(false).value], 
          'boolean addition'
        ]
      )
    })

    it('returns a complex for a [real, complex] pair', () => {
      expectWriter(add(real(5), complex([0, 5])))(
        complex([5, 5]).value,
        [real(5).value, 'cast to complex'],
        [
          [complex([5, 0]).value, complex([0, 5]).value],
          'complex addition'
        ]
      )
    })
  
    it('returns a real for a [real, boolean] pair', () => {
      expectWriter(add(real(9), boolean(true)))(
        real(10).value,
        [boolean(true).value, 'cast to real'],
        [[real(9).value, real(1).value], 'real addition']
      )
    })
  })

  it('returns a Writer<Addition> for variable input', () => {
    expectWriter(add(variable('x'), variable('y')))(
      $add(variable('x'), variable('y'))[0],
      [
        [variable('x').value, variable('y').value],
        'addition'
      ]
    )
  })

  it('returns NaN if the left operand is nil', () => {
    expectWriter(add(nil, real(5)))(
      nan.value,
      [[nil.value, real(5).value], 'not a number']
    )
  })

  it('returns NaN if the right operand is nil', () => {
    expectWriter(add(variable('x'), nil))(
      nan.value,
      [[variable('x').value, nil.value], 'not a number']
    )
  })

  describe('when dealing with the additive identity', () => {
    it('returns the right operand if the left is zero', () => {
      expectWriter(add(real(0), variable('x')))(
        variable('x').value,
        [[real(0).value, variable('x').value], 're-order operands'],
        [[variable('x').value, real(0).value], 'additive identity']
      )
    })
  
    it('returns the left operand if the right is zero', () => {
      expectWriter(add(variable('x'), real(0)))(
        variable('x').value,
        [[variable('x').value, real(0).value], 'additive identity']
      )
    })  
  })

  it('reorders primitives to the right', () => {
    expectWriter(add(real(5), variable('x')))(
      $add(variable('x'), real(5))[0],
      [[real(5).value, variable('x').value], 're-order operands'],
      [[variable('x').value, real(5).value], 'addition']
    )
  })

  describe('when given nested additions with primitives', () => {
    it('combines primitives on the right', () => {
      expectWriter(
        add(add(variable('x'), real(5)), real(10))
      )(
        $add(variable('x'), real(15))[0],
        [[variable('x').value, real(5).value], 'addition'],
        [
          [add(variable('x'), real(5)).value, real(10).value], 
          'combine primitives across nesting levels'
        ],
        [[real(5).value, real(10).value], 'real addition'],
        [[variable('x').value, real(15).value], 'addition']
      )  
    })

    it('reorders primitives before combining them', () => {
      expectWriter(
        add(real(5), add(real(10), variable('x')))
      )(
        $add(variable('x'), real(15))[0],
        [[real(10).value, variable('x').value], 're-order operands'],
        [[variable('x').value, real(10).value], 'addition'],
        [[real(5).value, add(variable('x'), real(10)).value], 're-order operands'],
        [
          [add(variable('x'), real(10)).value, real(5).value],
          'combine primitives across nesting levels'
        ],
        [[real(10).value, real(5).value], 'real addition'],
        [[variable('x').value, real(15).value], 'addition']
      )
    })

    it('casts primitives to minimize complexity', () => {
      expectWriter(
        add(add(variable('x'), real(1)), complex([0, 1]))
      )(
        $add(variable('x'), complex([1, 1]))[0],
        [[variable('x').value, real(1).value], 'addition'],
        [
          [add(variable('x'), real(1)).value, complex([0, 1]).value],
          'combine primitives across nesting levels'
        ],
        [real(1).value, 'cast to complex'],
        [[complex([1, 0]).value, complex([0, 1]).value], 'complex addition'],
        [[variable('x').value, complex([1, 1]).value], 'addition']
      )
    })
  })

  it('doubles the left operand if equivalent to the right', () => {
    expectWriter(add(variable('x'), variable('x')))(
      double(variable('x')).value,
      [
        [variable('x').value, variable('x').value], 
        'equivalence: replaced with double'
      ],
      [[real(2).value, variable('x').value], 'multiplication']
    )
  })

  describe('when given a nested addition with a like term', () => {
    it('doubles a right operand if equivalent to a left-nested-add left operand', () => {
      expectWriter(
        add(add(variable('x'), variable('y')), variable('x'))
      )(
        add(double(variable('x')), variable('y')).value,
        [[variable('x').value, variable('y').value], 'addition'],
        [
          [add(variable('x'), variable('y')).value, variable('x').value],
          'combined like terms'
        ],
        [[real(2).value, variable('x').value], 'multiplication'],
        [
          [multiply(real(2), variable('x')).value, variable('y').value],
          'addition'
        ]
      )
    })

    it('doubles a right operand if equivalent to a left-nested-add right operand', () => {
      expectWriter(
        add(add(variable('y'), variable('x')), variable('x'))
      )(
        add(double(variable('x')), variable('y')).value,
        [[variable('y').value, variable('x').value], 'addition'],
        [
          [add(variable('y'), variable('x')).value, variable('x').value],
          'combined like terms'
        ],
        [[real(2).value, variable('x').value], 'multiplication'],
        [[double(variable('x')).value, variable('y').value], 'addition']
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add left operand', () => {
      expectWriter(
        add(variable('x'), add(variable('x'), variable('y')))
      )(
        add(double(variable('x')), variable('y')).value,
        [[variable('x').value, variable('y').value], 'addition'],
        [
          [variable('x').value, add(variable('x'), variable('y')).value],
          'combined like terms'
        ],
        [[real(2).value, variable('x').value], 'multiplication'],
        [[double(variable('x')).value, variable('y').value], 'addition']
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add right operand', () => {
      expectWriter(
        add(variable('x'), add(variable('y'), variable('x')))
      )(
        add(double(variable('x')), variable('y')).value,
        [[variable('y').value, variable('x').value], 'addition'],
        [
          [variable('x').value, add(variable('y'), variable('x')).value],
          'combined like terms'
        ],
        [[real(2).value, variable('x').value], 'multiplication'],
        [[double(variable('x')).value, variable('y').value], 'addition']
      )
    })
  })

  describe('when given nested multiplications with primitives', () => {
    // E.g. x + 2 * x <-> 3 * x
    it('adds 1 to left operand of right-nested-multiply', () => {
      expectWriter(
        add(variable('x'), multiply(real(2), variable('x')))
      )(
        multiply(real(3), variable('x')).value,
        [[real(2).value, variable('x').value], 'multiplication'],
        [
          [variable('x').value, multiply(real(2), variable('x')).value],
          'combined like terms'
        ],
        [[real(1).value, real(2).value], 'real addition'],
        [[real(3).value, variable('x').value], 'multiplication']
      )
    })

    // E.g. 2 * x + x <-> 3 * x
    it('adds 1 to left operand of left-nested-multiply', () => {
      expectWriter(
        add(multiply(real(2), variable('x')), variable('x')) 
      )(
        multiply(real(3), variable('x')).value,
        [[real(2).value, variable('x').value], 'multiplication'],
        [
          [multiply(real(2), variable('x')).value, variable('x').value],
          'combined like terms'
        ],
        [[real(1).value, real(2).value], 'real addition'],
        [[real(3).value, variable('x').value], 'multiplication']
      )
    })

    // E.g. 2 * x + 3 * x <-> 5 * x
    it('adds left operands of dual-nested-multiplies', () => {
      expectWriter(
        add(multiply(real(2), variable('x')), multiply(real(3), variable('x')))
      )(
        multiply(real(5), variable('x')).value,
        [[real(2).value, variable('x').value], 'multiplication'],
        [[real(3).value, variable('x').value], 'multiplication'],
        [
          [
            multiply(real(2), variable('x')).value, 
            multiply(real(3), variable('x')).value
          ],
          'combined like terms'
        ],
        [[real(2).value, real(3).value], 'real addition'],
        [[real(5).value, variable('x').value], 'multiplication']
      )
    })
  })

  it('logs all layers of an operation without loss', () => {
    expectWriter(
      add(variable('x'), add(variable('y'), add(real(5), real(-5))))
    )(
      add(variable('x'), variable('y')).value,
      [[real(5).value, real(-5).value], 'real addition'],
      [[variable('y').value, real(0).value], 'additive identity'],
      [[variable('x').value, variable('y').value], 'addition']
    )
  })
})

describe('subtract', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expectWriter(subtract(real(4), real(5)))(
      real(-1).value,
      [[real(-1).value, real(5).value], 'real multiplication'],
      [[real(4).value, real(-5).value], 'real addition']
    )
  })

  it('returns a Writer<Addition> for variable inputs', () => {
    expectWriter(subtract(variable('x'), variable('y')))(
      add(variable('x'), multiply(real(-1), variable('y'))).value,
      [[real(-1).value, variable('y').value], 'multiplication'],
      [
        [variable('x').value, multiply(real(-1), variable('y')).value],
        'addition'  
      ]
    )
  })

  it('returns the negated right when subtracting from 0', () => {
    expectWriter(
      subtract(real(0), variable('x'))
    )(
      negate(variable('x')).value,
      [[real(-1).value, variable('x').value], 'multiplication'],
      [[real(0).value, negate(variable('x')).value], 're-order operands'],
      [[negate(variable('x')).value, real(0).value], 'additive identity']
    )
  })

  it('returns 0 if subtracting a quantity from itself', () => {
    expectWriter(
      subtract(variable('x'), variable('x'))
    )(
      real(0).value,
      [[real(-1).value, variable('x').value], 'multiplication'],
      [
        [variable('x').value, negate(variable('x')).value],
        'combined like terms'
      ],
      [[real(1).value, real(-1).value], 'real addition'],
      [[real(0).value, variable('x').value], 'zero absorption']
    )
  })

  it('returns 0 if subtracting a complex from itself', () => {
    expectWriter(
      subtract(complex([0, 1]), complex([0, 1]))
    )(
      complex([0, 0]).value,
      [real(-1).value, 'cast to complex'],
      [[complex([-1, 0]).value, complex([0, 1]).value], 'complex multiplication'],
      [[complex([0, 1]).value, complex([-0, -1]).value], 'complex addition']
      // TODO: -0 is a bit odd.
    )
  })

  it('properly subtracts a real from a complex', () => {
    expectWriter(
      subtract(complex([2, 1]), real(1))
    )(
      complex([1, 1]).value,
      [[real(-1).value, real(1).value], 'real multiplication'],
      [real(-1).value, 'cast to complex'],
      [[complex([2, 1]).value, complex([-1, 0]).value], 'complex addition']
    )
  })

  // it('combines like terms across multiplications', () => {
  //   expectWriter(
  //     subtract(
  //       multiply(multiply(variable('a'), variable('b')), variable('c')),
  //       multiply(multiply(variable('d'), variable('b')), variable('c'))
  //     )
  //   ){

  //   }
  // })

  //   it('combines like terms across multiplications', () => {
//     expect(
//       subtract(
//         multiply(multiply(variable('a'), variable('b')), variable('c')),
//         multiply(multiply(variable('d'), variable('b')), variable('c'))
//       )
//     ).toEqual(
//       multiply(
//         multiply(subtract(variable('a'), variable('d')), variable('b')),
//         variable('c')
//       )
//     )
//   })
})
