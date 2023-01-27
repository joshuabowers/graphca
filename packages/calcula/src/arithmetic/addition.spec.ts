import { unit } from '../monads/writer'
import { expectWriterTreeNode } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex, boolean, nil, nan, isPrimitive } from '../primitives'
import { variable } from '../variable'
import { $add, add, subtract } from './addition'
import { double, multiply, negate } from './multiplication'
import { Unicode } from '../Unicode'

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
      expectWriterTreeNode(
        add(real(1), real(2)),
        real(3)
      )(
        ['1', '1', 'given primitive'],
        ['2', '2', 'given primitive'],
        ['1 + 2', '3', 'real addition'],
        ['3', '3', 'given primitive']
      )
    })
  
    it('returns a Writer<Complex> for two complex inputs', () => {
      expectWriterTreeNode(
        add(complex([1, 2]), complex([3, 4])),
        complex([4, 6])
      )(
        [`1+2${Unicode.i}`, `1+2${Unicode.i}`, 'given primitive'],
        [`3+4${Unicode.i}`, `3+4${Unicode.i}`, 'given primitive'],
        [
          `1+2${Unicode.i} + 3+4${Unicode.i}`,
          `4+6${Unicode.i}`,
          'complex addition'
        ],
        [`4+6${Unicode.i}`, `4+6${Unicode.i}`, 'given primitive']
      )
    })
  
    it('returns a Writer<Boolean> for two boolean inputs', () => {
      expectWriterTreeNode(
        add(boolean(true), boolean(false)),
        boolean(true)
      )(
        ['true', 'true', 'given primitive'],
        ['false', 'false', 'given primitive'],
        ['true + false', 'true', 'boolean addition'],
        ['true', 'true', 'given primitive']
      )
    })

    it('returns a complex for a [real, complex] pair', () => {
      expectWriterTreeNode(
        add(real(5), complex([0, 5])),
        complex([5, 5])
      )(
        ['5', '5', 'given primitive'],
        ['5', `5+0${Unicode.i}`, 'cast to Complex from Real'],
        [`0+5${Unicode.i}`, `0+5${Unicode.i}`, 'given primitive'],
        [
          `5+0${Unicode.i} + 0+5${Unicode.i}`,
          `5+5${Unicode.i}`,
          'complex addition'
        ],
        [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      )
    })
  
    it('returns a real for a [real, boolean] pair', () => {
      expectWriterTreeNode(
        add(real(9), boolean(true)),
        real(10)
      )(
        ['9', '9', 'given primitive'],
        ['true', 'true', 'given primitive'],
        ['true', '1', 'cast to Real from Boolean'],
        ['9 + 1', '10', 'real addition'],
        ['10', '10', 'given primitive']
      )
    })
  })

  it('returns a Writer<Addition> for variable input', () => {
    expectWriterTreeNode(
      add(variable('x'), variable('y')),
      $add(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x + y', '(x+y)', 'addition']
    )
  })

  it('returns NaN if the left operand is nil', () => {
    expectWriterTreeNode(
      add(nil, real(5)),
      nan
    )(
      ['5', '5', 'given primitive'],
      ['nil + 5', 'NaN', 'not a number']
    )
  })

  it('returns NaN if the right operand is nil', () => {
    expectWriterTreeNode(
      add(variable('x'), nil),
      nan
    )(
      ['x', 'x', 'given variable'],
      ['x + nil', 'NaN', 'not a number']
    )
  })

  describe('when dealing with the additive identity', () => {
    it('returns the right operand if the left is zero', () => {
      expectWriterTreeNode(
        add(real(0), variable('x')),
        variable('x')
      )(
        ['0', '0', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['0 + x', 'x + 0', 're-order operands'],
        ['x + 0', 'x', 'additive identity']
      )
    })
  
    it('returns the left operand if the right is zero', () => {
      expectWriterTreeNode(
        add(variable('x'), real(0)),
        variable('x')
      )(
        ['x', 'x', 'given variable'],
        ['0', '0', 'given primitive'],
        ['x + 0', 'x', 'additive identity']
      )
    })  
  })

  it('reorders primitives to the right', () => {
    expectWriterTreeNode(
      add(real(5), variable('x')),
      $add(unit(variable('x').value), unit(real(5).value))[0]
    )(
      ['5', '5', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['5 + x', 'x + 5', 're-order operands'],
      ['x + 5', '(x+5)', 'addition']
    )
  })

  describe('when given nested additions with primitives', () => {
    it('combines primitives on the right', () => {
      expectWriterTreeNode(
        add(add(variable('x'), real(5)), real(10)),
        $add(unit(variable('x').value), unit(real(15).value))[0]
      )(
        ['x', 'x', 'given variable'],
        ['5', '5', 'given primitive'],
        ['x + 5', '(x+5)', 'addition'],
        ['10', '10', 'given primitive'],
        ['(x+5) + 10', 'x + (5 + 10)', 'additive associativity'],
        ['5 + 10', '15', 'real addition'],
        ['15', '15', 'given primitive'],
        ['x + 15', '(x+15)', 'addition']
      )
    })

    it('reorders primitives before combining them', () => {
      expectWriterTreeNode(
        add(real(5), add(real(10), variable('x'))),
        $add(unit(variable('x').value), unit(real(15).value))[0]
      )(
        ['5', '5', 'given primitive'],
        ['10', '10', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['10 + x', 'x + 10', 're-order operands'],
        ['x + 10', '(x+10)', 'addition'],
        ['5 + (x+10)', '(x+10) + 5', 're-order operands'],
        ['(x+10) + 5', 'x + (10 + 5)', 'additive associativity'],
        ['10 + 5', '15', 'real addition'],
        ['15', '15', 'given primitive'],
        ['x + 15', '(x+15)', 'addition']
      )
    })

    it('casts primitives to minimize complexity', () => {
      expectWriterTreeNode(
        add(add(variable('x'), real(1)), complex([0, 1])),
        $add(unit(variable('x').value), unit(complex([1, 1]).value))[0]
      )(
        ['x', 'x', 'given variable'],
        ['1', '1', 'given primitive'],
        ['x + 1', '(x+1)', 'addition'],
        [`0+1${Unicode.i}`, `0+1${Unicode.i}`, 'given primitive'],
        [
          `(x+1) + 0+1${Unicode.i}`, 
          `x + (1 + 0+1${Unicode.i})`, 
          'additive associativity'
        ],
        ['1', `1+0${Unicode.i}`, 'cast to Complex from Real'],
        [`1+0${Unicode.i} + 0+1${Unicode.i}`, `1+1${Unicode.i}`, 'complex addition'],
        [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
        [`x + 1+1${Unicode.i}`, `(x+1+1${Unicode.i})`, 'addition']
      )
    })
  })

  it('doubles the left operand if equivalent to the right', () => {
    expectWriterTreeNode(
      add(variable('x'), variable('x')),
      double(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      ['x + x', '2 * x', 'equivalence: replaced with double'],
      ['2', '2', 'given primitive'],
      ['2 * x', '(2*x)', 'multiplication']
    )
  })

  describe('when given a nested addition with a like term', () => {
    it('doubles a right operand if equivalent to a left-nested-add left operand', () => {
      expectWriterTreeNode(
        add(add(variable('x'), variable('y')), variable('x')),
        add(double(variable('x')), variable('y'))
      )(
        ['x', 'x', 'given variable'],
        ['y', 'y', 'given variable'],
        ['x + y', '(x+y)', 'addition'],
        ['x', 'x', 'given variable'],
        ['(x+y) + x', '2 * x + y', 'combined like terms'],
        ['2', '2', 'given primitive'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['(2*x) + y', '((2*x)+y)', 'addition']
      )
    })

    it('doubles a right operand if equivalent to a left-nested-add right operand', () => {
      expectWriterTreeNode(
        add(add(variable('y'), variable('x')), variable('x')),
        add(double(variable('x')), variable('y'))
      )(
        ['y', 'y', 'given variable'],
        ['x', 'x', 'given variable'],
        ['y + x', '(y+x)', 'addition'],
        ['x', 'x', 'given variable'],
        ['(y+x) + x', '2 * x + y', 'combined like terms'],
        ['2', '2', 'given primitive'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['(2*x) + y', '((2*x)+y)', 'addition']
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add left operand', () => {
      expectWriterTreeNode(
        add(variable('x'), add(variable('x'), variable('y'))),
        add(double(variable('x')), variable('y'))
      )(
        ['x', 'x', 'given variable'],
        ['x', 'x', 'given variable'],
        ['y', 'y', 'given variable'],
        ['x + y', '(x+y)', 'addition'],
        ['x + (x+y)', '2 * x + y', 'combined like terms'],
        ['2', '2', 'given primitive'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['(2*x) + y', '((2*x)+y)', 'addition']
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add right operand', () => {
      expectWriterTreeNode(
        add(variable('x'), add(variable('y'), variable('x'))),
        add(double(variable('x')), variable('y'))
      )(
        ['x', 'x', 'given variable'],
        ['y', 'y', 'given variable'],
        ['x', 'x', 'given variable'],
        ['y + x', '(y+x)', 'addition'],
        ['x + (y+x)', '2 * x + y', 'combined like terms'],
        ['2', '2', 'given primitive'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['(2*x) + y', '((2*x)+y)', 'addition']
      )
    })
  })

  describe('when given nested multiplications with primitives', () => {
    // E.g. x + 2 * x <-> 3 * x
    it('adds 1 to left operand of right-nested-multiply', () => {
      expectWriterTreeNode(
        add(variable('x'), multiply(real(2), variable('x'))),
        multiply(real(3), variable('x'))
      )(
        ['x', 'x', 'given variable'],
        ['2', '2', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['x + (2*x)', '(1 + 2) * x', 'combined like terms'],
        ['1', '1', 'given primitive'],
        ['1 + 2', '3', 'real addition'],
        ['3', '3', 'given primitive'],
        ['3 * x', '(3*x)', 'multiplication']
      )
    })

    // E.g. 2 * x + x <-> 3 * x
    it('adds 1 to left operand of left-nested-multiply', () => {
      expectWriterTreeNode(
        add(multiply(real(2), variable('x')), variable('x')),
        multiply(real(3), variable('x'))
      )(
        ['2', '2', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['x', 'x', 'given variable'],
        ['(2*x) + x', '(1 + 2) * x', 'combined like terms'],
        ['1', '1', 'given primitive'],
        ['1 + 2', '3', 'real addition'],
        ['3', '3', 'given primitive'],
        ['3 * x', '(3*x)', 'multiplication']
      )
    })

    // E.g. 2 * x + 3 * x <-> 5 * x
    it('adds left operands of dual-nested-multiplies', () => {
      expectWriterTreeNode(
        add(multiply(real(2), variable('x')), multiply(real(3), variable('x'))),
        multiply(real(5), variable('x'))
      )(
        ['2', '2', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['2 * x', '(2*x)', 'multiplication'],
        ['3', '3', 'given primitive'],
        ['x', 'x', 'given variable'],
        ['3 * x', '(3*x)', 'multiplication'],
        ['(2*x) + (3*x)', '(2 + 3) * x', 'combined like terms'],
        ['2 + 3', '5', 'real addition'],
        ['5', '5', 'given primitive'],
        ['5 * x', '(5*x)', 'multiplication']
      )
    })
  })

  it('logs all layers of an operation without loss', () => {
    expectWriterTreeNode(
      add(variable('x'), add(variable('y'), add(real(5), real(-5)))),
      add(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['5', '5', 'given primitive'],
      ['-5', '-5', 'given primitive'],
      ['5 + -5', '0', 'real addition'],
      ['0', '0', 'given primitive'],
      ['y + 0', 'y', 'additive identity'],
      ['x + y', '(x+y)', 'addition']
    )
  })
})

describe('subtract', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expectWriterTreeNode(
      subtract(real(4), real(5)),
      real(-1)
    )(
      ['4', '4', 'given primitive'],
      ['-1', '-1', 'given primitive'],
      ['5', '5', 'given primitive'],
      ['-1 * 5', '-5', 'real multiplication'],
      ['-5', '-5', 'given primitive'],
      ['4 + -5', '-1', 'real addition'],
      ['-1', '-1', 'given primitive']
    )
  })

  it('returns a Writer<Addition> for variable inputs', () => {
    expectWriterTreeNode(
      subtract(variable('x'), variable('y')),
      add(variable('x'), multiply(real(-1), variable('y')))
    )(
      ['x', 'x', 'given variable'],
      ['-1', '-1', 'given primitive'],
      ['y', 'y', 'given variable'],
      ['-1 * y', '(-1*y)', 'multiplication'],
      ['x + (-1*y)', '(x+(-1*y))', 'addition']
    )
  })

  it('returns the negated right when subtracting from 0', () => {
    expectWriterTreeNode(
      subtract(real(0), variable('x')),
      negate(variable('x'))
    )(
      ['0', '0', 'given primitive'],
      ['-1', '-1', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['-1 * x', '(-1*x)', 'multiplication'],
      ['0 + (-1*x)', '(-1*x) + 0', 're-order operands'],
      ['(-1*x) + 0', '(-1*x)', 'additive identity']
    )
  })

  it('returns 0 if subtracting a quantity from itself', () => {
    expectWriterTreeNode(
      subtract(variable('x'), variable('x')),
      real(0)
    )(
      ['x', 'x', 'given variable'],
      ['-1', '-1', 'given primitive'],
      ['x', 'x', 'given variable'],
      ['-1 * x', '(-1*x)', 'multiplication'],
      ['x + (-1*x)', '(1 + -1) * x', 'combined like terms'],
      ['1', '1', 'given primitive'],
      ['1 + -1', '0', 'real addition'],
      ['0', '0', 'given primitive'],
      ['0 * x', '0', 'zero absorption'],
      ['0', '0', 'given primitive']
    )
  })

  it('returns 0 if subtracting a complex from itself', () => {
    expectWriterTreeNode(
      subtract(complex([0, 1]), complex([0, 1])),
      complex([0, 0])
    )(
      [`0+1${Unicode.i}`, `0+1${Unicode.i}`, 'given primitive'],
      ['-1', '-1', 'given primitive'],
      ['-1', `-1+0${Unicode.i}`, 'cast to Complex from Real'],
      [`0+1${Unicode.i}`, `0+1${Unicode.i}`, 'given primitive'],
      [
        `-1+0${Unicode.i} * 0+1${Unicode.i}`,
        `0-1${Unicode.i}`,
        'complex multiplication'
      ],
      [`0-1${Unicode.i}`, `0-1${Unicode.i}`, 'given primitive'],
      [
        `0+1${Unicode.i} + 0-1${Unicode.i}`,
        `0+0${Unicode.i}`,
        'complex addition'
      ],
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive']
    )
  })

  it('properly subtracts a real from a complex', () => {
    expectWriterTreeNode(
      subtract(complex([2, 1]), real(1)),
      complex([1, 1])
    )(
      [`2+1${Unicode.i}`, `2+1${Unicode.i}`, 'given primitive'],
      ['-1', '-1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['-1 * 1', '-1', 'real multiplication'],
      ['-1', '-1', 'given primitive'],
      ['-1', `-1+0${Unicode.i}`, 'cast to Complex from Real'],
      [
        `2+1${Unicode.i} + -1+0${Unicode.i}`,
        `1+1${Unicode.i}`,
        'complex addition'
      ],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive']
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
