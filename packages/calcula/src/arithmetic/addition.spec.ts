import { unit } from '../monads/writer'
import { expectToEqualWithSnapshot } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex, boolean, nil, nan } from '../primitives'
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

describe('$add', () => {
  it('generates an Addition for a pair of TreeNode inputs', () => {
    expect(
      $add(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.arithmetic, species: Species.add,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('add', () => {
  describe('when given pairs of primitives', () => {
    it('returns a Writer<Real> for two real inputs', () => {
      expectToEqualWithSnapshot(
        add(real(1), real(2)),
        real(3)
      )
    })
  
    it('returns a Writer<Complex> for two complex inputs', () => {
      expectToEqualWithSnapshot(
        add(complex(1, 2), complex(3, 4)),
        complex(4, 6)
      )
    })
  
    it('returns a Writer<Boolean> for two boolean inputs', () => {
      expectToEqualWithSnapshot(
        add(boolean(true), boolean(false)),
        boolean(true)
      )
    })

    it('returns a complex for a [real, complex] pair', () => {
      expectToEqualWithSnapshot(
        add(real(5), complex(0, 5)),
        complex(5, 5)
      )
    })
  
    it('returns a real for a [real, boolean] pair', () => {
      expectToEqualWithSnapshot(
        add(real(9), boolean(true)),
        real(10)
      )
    })
  })

  it('returns a Writer<Addition> for variable input', () => {
    expectToEqualWithSnapshot(
      add(variable('x'), variable('y')),
      $add(variable('x'), variable('y'))[0]
    )
  })

  it('returns NaN if the left operand is nil', () => {
    expectToEqualWithSnapshot(
      add(nil, real(5)),
      nan
    )
  })

  it('returns NaN if the right operand is nil', () => {
    expectToEqualWithSnapshot(
      add(variable('x'), nil),
      nan
    )
  })

  describe('when dealing with the additive identity', () => {
    it('returns the right operand if the left is zero', () => {
      expectToEqualWithSnapshot(
        add(real(0), variable('x')),
        variable('x')
      )
    })
  
    it('returns the left operand if the right is zero', () => {
      expectToEqualWithSnapshot(
        add(variable('x'), real(0)),
        variable('x')
      )
    })  
  })

  it('reorders primitives to the right', () => {
    expectToEqualWithSnapshot(
      add(real(5), variable('x')),
      $add(variable('x'), real(5))[0]
    )
  })

  describe('when given nested additions with primitives', () => {
    it('combines primitives on the right', () => {
      expectToEqualWithSnapshot(
        add(add(variable('x'), real(5)), real(10)),
        $add(variable('x'), real(15))[0]
      )
    })

    it('reorders primitives before combining them', () => {
      expectToEqualWithSnapshot(
        add(real(5), add(real(10), variable('x'))),
        $add(variable('x'), real(15))[0]
      )
    })

    it('casts primitives to minimize complexity', () => {
      expectToEqualWithSnapshot(
        add(add(variable('x'), real(1)), complex(0, 1)),
        $add(variable('x'), complex(1, 1))[0]
      )
    })
  })

  it('doubles the left operand if equivalent to the right', () => {
    expectToEqualWithSnapshot(
      add(variable('x'), variable('x')),
      double(variable('x'))
    )
  })

  describe('when given a nested addition with a like term', () => {
    it('doubles a right operand if equivalent to a left-nested-add left operand', () => {
      expectToEqualWithSnapshot(
        add(add(variable('x'), variable('y')), variable('x')),
        add(double(variable('x')), variable('y'))
      )
    })

    it('doubles a right operand if equivalent to a left-nested-add right operand', () => {
      expectToEqualWithSnapshot(
        add(add(variable('y'), variable('x')), variable('x')),
        add(double(variable('x')), variable('y'))
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add left operand', () => {
      expectToEqualWithSnapshot(
        add(variable('x'), add(variable('x'), variable('y'))),
        add(double(variable('x')), variable('y'))
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add right operand', () => {
      expectToEqualWithSnapshot(
        add(variable('x'), add(variable('y'), variable('x'))),
        add(double(variable('x')), variable('y'))
      )
    })
  })

  describe('when given nested multiplications with primitives', () => {
    // E.g. x + 2 * x <-> 3 * x
    it('adds 1 to left operand of right-nested-multiply', () => {
      expectToEqualWithSnapshot(
        add(variable('x'), multiply(real(2), variable('x'))),
        multiply(real(3), variable('x'))
      )
    })

    // E.g. 2 * x + x <-> 3 * x
    it('adds 1 to left operand of left-nested-multiply', () => {
      expectToEqualWithSnapshot(
        add(multiply(real(2), variable('x')), variable('x')),
        multiply(real(3), variable('x'))
      )
    })

    // E.g. 2 * x + 3 * x <-> 5 * x
    it('adds left operands of dual-nested-multiplies', () => {
      expectToEqualWithSnapshot(
        add(multiply(real(2), variable('x')), multiply(real(3), variable('x'))),
        multiply(real(5), variable('x'))
      )
    })
  })

  it('logs all layers of an operation without loss', () => {
    expectToEqualWithSnapshot(
      add(variable('x'), add(variable('y'), add(real(5), real(-5)))),
      add(variable('x'), variable('y'))
    )
  })
})

describe('subtract', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expectToEqualWithSnapshot(
      subtract(real(4), real(5)),
      real(-1)
    )
  })

  it('returns a Writer<Addition> for variable inputs', () => {
    expectToEqualWithSnapshot(
      subtract(variable('x'), variable('y')),
      add(variable('x'), multiply(real(-1), variable('y')))
    )
  })

  it('returns the negated right when subtracting from 0', () => {
    expectToEqualWithSnapshot(
      subtract(real(0), variable('x')),
      negate(variable('x'))
    )
  })

  it('returns 0 if subtracting a quantity from itself', () => {
    expectToEqualWithSnapshot(
      subtract(variable('x'), variable('x')),
      real(0)
    )
  })

  it('returns 0 if subtracting a complex from itself', () => {
    expectToEqualWithSnapshot(
      subtract(complex(0, 1), complex(0, 1)),
      complex(0, 0)
    )
  })

  it('properly subtracts a real from a complex', () => {
    expectToEqualWithSnapshot(
      subtract(complex(2, 1), real(1)),
      complex(1, 1)
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
