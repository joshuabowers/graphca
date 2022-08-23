import { Clades, Genera, Species } from '../utility/tree'
import { real, complex, boolean, nil, nan } from '../primitives'
import { variable } from '../variable'
import { add, subtract } from './addition'
import { double, multiply } from './multiplication'

// describe('add', () => {
//   describe('with Real, Real', () => {
//     it('returns a real valued at the addition', () => {
//       expect(add(real(1), real(2))).toEqual(real(3))
//     })
//   })

//   describe('with Complex, Complex', () => {
//     it('returns the pairwise addition of the values', () => {
//       expect(add(complex(1, 2), complex(2, 3))).toEqual(complex(3, 5))
//     })
//   })

//   describe('with Complex, Real', () => {
//     it('adds the real to the real part of the complex', () => {
//       expect(add(complex(1, 2), real(2))).toEqual(complex(3, 2))
//     })
//   })

//   describe('with Real, Complex', () => {
//     it('adds the real to the real part of the complex', () => {
//       expect(add(real(2), complex(1, 2))).toEqual(complex(3, 2))
//     })
//   })

//   describe('with 0, Anything', () => {
//     it('returns the right parameter', () => {
//       expect(add(real(0), variable('x'))).toEqual(variable('x'))
//     })
//   })

//   describe('with Anything, 0', () => {
//     it('returns the left parameter', () => {
//       expect(add(variable('x'), real(0))).toEqual(variable('x'))
//     })
//   })

//   describe('with Real, Anything', () => {
//     it('flips the order of the addends', () => {
//       expect(add(real(1), variable('x'))).toEqual(add(variable('x'), real(1)))
//     })
//   })

//   describe('with Complex, Anything', () => {
//     it('flips the order of the addends', () => {
//       expect(add(complex(1, 2), variable('x'))).toEqual(add(variable('x'), complex(1, 2)))
//     })
//   })

//   describe('with {X + 1} + 2', () => {
//     it('replaces with a single addition', () => {
//       expect(add(add(variable('x'), real(1)), real(2))).toEqual(add(variable('x'), real(3)))
//     })
//   })

//   describe('with {1 + x} + 2', () => {
//     it('replaces with a single addition', () => {
//       expect(add(add(real(1), variable('x')), real(2))).toEqual(add(variable('x'), real(3)))
//     })
//   })

//   describe('with 2 + {X + 1}', () => {
//     it('replaces with a single addition', () => {
//       expect(add(real(2), add(variable('x'), real(1)))).toEqual(add(variable('x'), real(3)))
//     })
//   })

//   describe('with 2 + {1 + X}', () => {
//     it('replaces with a single addition', () => {
//       expect(add(real(2), add(real(1), variable('x')))).toEqual(add(variable('x'), real(3)))
//     })
//   })

//   describe('with {X + 1} + i', () => {
//     it('replaces with a single addition', () => {
//       expect(add(add(variable('x'), real(1)), complex(0, 1))).toEqual(add(variable('x'), complex(1, 1)))
//     })
//   })

//   describe('with the same object twice', () => {
//     it('replaces the addition with a multiplication', () => {
//       expect(add(variable('x'), variable('x'))).toEqual(double(variable('x')))
//     })
//   })

//   describe('with {X + Y}, X', () => {
//     it('replaces the nested addition with an addition of a multiplication', () => {
//       expect(
//         add(add(variable('x'), real(1)), variable('x'))
//       ).toEqual(add(double(variable('x')), real(1)))
//     })
//   })

//   describe('with {Y + X}, X', () => {
//     it('replaces the nested addition with an addition of a multiplication', () => {
//       expect(
//         add(add(variable('y'), variable('x')), variable('x'))
//       ).toEqual(add(double(variable('x')), variable('y')))
//     })
//   })

//   describe('with X, {X + Y}', () => {
//     it('replaces the nested addition and an addition of a multiplication', () => {
//       expect(
//         add(variable('x'), add(variable('x'), variable('y')))
//       ).toEqual(add(double(variable('x')), variable('y')))
//     })
//   })

//   describe('with X, {Y + X}', () => {
//     it('replaces the nested addition with an addition of a multiplication', () => {
//       expect(
//         add(variable('x'), add(variable('y'), variable('x')))
//       ).toEqual(add(double(variable('x')), variable('y')))
//     })
//   })

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

//   describe('with {2 * X}, {X * 3}', () => {
//     it('combines like terms', () => {
//       expect(
//         add(multiply(real(2), variable('x')), multiply(variable('x'), real(3)))
//       ).toEqual(multiply(real(5), variable('x')))
//     })
//   })

//   describe('when adding a complex to itself', () => {
//     it('results in a doubled complex', () => {
//       expect(add(complex(0, 1), complex(0, 1))).toEqual(complex(0, 2))
//     })
//   })

//   describe('when adding a real to a complex', () => {
//     it('calculates a complex value correctly', () => {
//       expect(add(complex(2, 1), real(1))).toEqual(complex(3, 1))
//     })
//   })

//   describe('when unable to fully evaluate', () => {
//     it('returns an addition expression', () => {
//       expect(add(variable('x'), real(1))).toEqual(new Addition(variable('x'), real(1)))
//     })
//   })
// })

// describe('subtract', () => {
//   it('returns an addition of a negated right', () => {
//     expect(subtract(variable('x'), real(1))).toEqual(new Addition(variable('x'), real(-1)))
//   })

//   it('returns the negated right when subtracting from zero', () => {
//     expect(subtract(real(0), variable('x'))).toEqual(new Multiplication(real(-1), variable('x')))
//   })

//   it('returns the subtraction of reals', () => {
//     expect(subtract(real(4), real(1))).toEqual(real(3))
//   })

//   it('returns 0 if subtracting a quantity from itself', () => {
//     expect(subtract(variable('x'), variable('x'))).toEqual(real(0))
//   })

//   it('returns 0 if subtracting a complex from itself', () => {
//     expect(subtract(complex(0, 1), complex(0, 1))).toEqual(complex(0, 0))
//   })

//   it('properly subtracts a real from a complex', () => {
//     expect(subtract(complex(2, 1), real(1))).toEqual(complex(1, 1))
//   })

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
// })

describe('add', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expect(add(real(1), real(2))).toEqual({
      value: real(3).value,
      log: [{input: [real(1).value, real(2).value], action: 'real addition'}]
    })
  })

  it('returns a Writer<Complex> for two complex inputs', () => {
    expect(add(complex([1, 2]), complex([3, 4]))).toEqual({
      value: complex([4, 6]).value,
      log: [{
        input: [complex([1, 2]).value, complex([3, 4]).value],
        action: 'complex addition'
      }]
    })
  })

  it('returns a Writer<Boolean> for two boolean inputs', () => {
    expect(add(boolean(true), boolean(false))).toEqual({
      value: boolean(true).value,
      log: [{
        input: [boolean(true).value, boolean(false).value], 
        action: 'boolean addition'
      }]
    })
  })

  it('returns a Writer<Addition> for variable input', () => {
    expect(add(variable('x'), variable('y'))).toEqual({
      value: {
        clade: Clades.binary, genus: Genera.arithmetic, species: Species.add, 
        left: variable('x'), right: variable('y')
      },
      log: [{
        input: [variable('x').value, variable('y').value],
        action: 'addition'
      }]
    })
  })

  it('returns a complex for a [real, complex] pair', () => {
    expect(add(real(5), complex([0, 5]))).toEqual({
      value: complex([5, 5]).value,
      log: [
        {
          input: real(5).value,
          action: 'cast to complex'
        },
        {
          input: [complex([5, 0]).value, complex([0, 5]).value],
          action: 'complex addition'
        }
      ]
    })
  })

  it('returns a real for a [real, boolean] pair', () => {
    expect(add(real(9), boolean(true))).toEqual({
      value: real(10).value,
      log: [
        {
          input: boolean(true).value,
          action: 'cast to real'
        },
        {
          input: [real(9).value, real(1).value],
          action: 'real addition'
        }
      ]
    })
  })

  it('returns NaN if the left operand is nil', () => {
    expect(add(nil, real(5))).toEqual({
      value: nan.value,
      log: [{
        input: [nil.value, real(5).value],
        action: 'not a number'
      }]
    })
  })

  it('returns NaN if the right operand is nil', () => {
    expect(add(variable('x'), nil)).toEqual({
      value: nan.value,
      log: [{
        input: [variable('x').value, nil.value],
        action: 'not a number'
      }]
    })
  })

  it('returns the right operand if the left is zero', () => {
    expect(add(real(0), variable('x'))).toEqual({
      value: variable('x').value,
      log: [
        {
          input: [real(0).value, variable('x').value],
          action: 're-order operands'
        },
        {
          input: [variable('x').value, real(0).value],
          action: 'additive identity'
        }
      ]
    })
  })

  it('returns the left operand if the right is zero', () => {
    expect(add(variable('x'), real(0))).toEqual({
      value: variable('x').value,
      log: [
        {
          input: [variable('x').value, real(0).value],
          action: 'additive identity'
        }
      ]
    })
  })

  it('reorders primitives to the right', () => {
    expect(add(real(5), variable('x'))).toEqual({
      value: {
        clade: Clades.binary, genus: Genera.arithmetic, species: Species.add, 
        left: variable('x'), right: real(5)
      },
      log: [
        {
          input: [real(5).value, variable('x').value],
          action: 're-order operands'
        },
        {
          input: [variable('x').value, real(5).value],
          action: 'addition'
        }
      ]
    })
  })

  it('combines reals across nesting levels', () => {
    expect(add(add(variable('x'), real(5)), real(10))).toEqual({
      value: {
        clade: Clades.binary, genus: Genera.arithmetic, species: Species.add, 
        left: variable('x'), right: real(15)
      },
      log: [
        {
          input: [variable('x').value, real(5).value],
          action: 'addition'
        },
        {
          input: [add(variable('x'), real(5)).value, real(10).value],
          action: 'combine primitives across nesting levels'
        },
        {
          input: [real(5).value, real(10).value],
          action: 'real addition'
        },
        {
          input: [variable('x').value, real(15).value],
          action: 'addition'
        }
      ]
    })
  })

  it('doubles the left operand if equivalent to the right', () => {
    expect(add(variable('x'), variable('x'))).toEqual({
      value: multiply(real(2), variable('x')).value,
      log: [
        {
          input: [variable('x').value, variable('x').value],
          action: 'equivalence: replaced with double'
        },
        {
          input: [real(2).value, variable('x').value],
          action: 'multiplication'
        }
      ]
    })
  })

  it('doubles a right operand if equivalent to a left-nested-add left operand', () => {
    expect(add(add(variable('x'), variable('y')), variable('x'))).toEqual({
      value: add(multiply(real(2), variable('x')), variable('y')).value,
      log: [
        {
          input: [variable('x').value, variable('y').value],
          action: 'addition'
        },
        {
          input: [add(variable('x'), variable('y')).value, variable('x').value],
          action: 'combined like terms'
        },
        {
          input: [real(2).value, variable('x').value],
          action: 'multiplication'
        },
        {
          input: [multiply(real(2), variable('x')).value, variable('y').value],
          action: 'addition'
        }
      ]
    })
  })

  it('logs all layers of an operation without loss', () => {
    expect(add(variable('x'), add(variable('y'), add(real(5), real(-5))))).toEqual({
      value: add(variable('x'), variable('y')).value,
      log: [
        {
          input: [real(5).value, real(-5).value],
          action: 'real addition'
        },
        {
          input: [variable('y').value, real(0).value],
          action: 'additive identity'
        },
        {
          input: [variable('x').value, variable('y').value],
          action: 'addition'
        }
      ]
    })
  })
})

describe('subtract', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expect(subtract(real(4), real(5))).toEqual({
      value: real(-1).value,
      log: [
        {
          input: [real(-1).value, real(5).value],
          action: 'real multiplication'
        },
        {
          input: [real(4).value, real(-5).value],
          action: 'real addition'
        }
      ]
    })
  })

  it('returns a Writer<Addition> for variable inputs', () => {
    expect(subtract(variable('x'), variable('y'))).toEqual({
      value: add(variable('x'), multiply(real(-1), variable('y'))).value,
      log: [
        {
          input: [real(-1).value, variable('y').value],
          action: 'multiplication'
        },
        {
          input: [variable('x').value, multiply(real(-1), variable('y')).value],
          action: 'addition'  
        }
      ]
    })
  })
})
