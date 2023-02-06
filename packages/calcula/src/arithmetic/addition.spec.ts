import { unit } from '../monads/writer'
import { 
  expectWriterTreeNode,
  realOps, complexOps, variableOps, addOps, multiplyOps
} from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex, boolean, nil, nan } from '../primitives'
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
        ...addOps(
          'real addition',
          [['1', 'created real']],
          [['2', 'created real']],
          [['3', 'created real']]
        )
      )
    })
  
    it('returns a Writer<Complex> for two complex inputs', () => {
      expectWriterTreeNode(
        add(complex([1, 2]), complex([3, 4])),
        complex([4, 6])
      )(
        ...addOps(
          'complex addition',
          [[`1+2${Unicode.i}`, 'created complex']],
          [[`3+4${Unicode.i}`, 'created complex']],
          [[`4+6${Unicode.i}`, 'created complex']]
        )
      )
    })
  
    it('returns a Writer<Boolean> for two boolean inputs', () => {
      expectWriterTreeNode(
        add(boolean(true), boolean(false)),
        boolean(true)
      )(
        ...addOps(
          'boolean addition',
          [['true', 'created boolean']],
          [['false', 'created boolean']],
          [['true', 'created boolean']]
        )
      )
    })

    it('returns a complex for a [real, complex] pair', () => {
      expectWriterTreeNode(
        add(real(5), complex([0, 5])),
        complex([5, 5])
      )(
        ...addOps(
          'complex addition',
          [
            ['5', 'created real'],
            [`5+0${Unicode.i}`, 'cast to Complex from Real']
          ],
          [[`0+5${Unicode.i}`, 'created complex']],
          [[`5+5${Unicode.i}`, 'created complex']]
        )
      )
    })
  
    it('returns a real for a [real, boolean] pair', () => {
      expectWriterTreeNode(
        add(real(9), boolean(true)),
        real(10)
      )(
        ...addOps(
          'real addition',
          [['9', 'created real']],
          [
            ['true', 'created boolean'],
            ['1', 'cast to Real from Boolean']
          ],
          [['10', 'created real']]
        )
      )
    })
  })

  it('returns a Writer<Addition> for variable input', () => {
    expectWriterTreeNode(
      add(variable('x'), variable('y')),
      $add(variable('x'), variable('y'))[0]
    )(
      ...addOps(
        'created addition',
        [['x', 'referenced variable']],
        [['y', 'referenced variable']],
        []
      )
    )
  })

  it('returns NaN if the left operand is nil', () => {
    expectWriterTreeNode(
      add(nil, real(5)),
      nan
    )(
      ...addOps(
        'not a number',
        [['nil', 'nothing']],
        [['5', 'created real']],
        [['NaN', 'not a number']]
      )
    )
  })

  it('returns NaN if the right operand is nil', () => {
    expectWriterTreeNode(
      add(variable('x'), nil),
      nan
    )(
      ...addOps(
        'not a number',
        [['x', 'referenced variable']],
        [['nil', 'nothing']],
        [['NaN', 'not a number']]
      )
    )
  })

  describe('when dealing with the additive identity', () => {
    it('returns the right operand if the left is zero', () => {
      expectWriterTreeNode(
        add(real(0), variable('x')),
        variable('x')
      )(
        ...addOps(
          'reorder operands',
          [['0', 'created real']],
          [['x', 'referenced variable']],
          addOps(
            'additive identity',
            [['x', 'referenced variable']],
            [['0', 'created real']],
            [['x', 'referenced variable']]
          )
        )
      )
    })
  
    it('returns the left operand if the right is zero', () => {
      expectWriterTreeNode(
        add(variable('x'), real(0)),
        variable('x')
      )(
        ...addOps(
          'additive identity',
          [['x', 'referenced variable']],
          [['0', 'created real']],
          [['x', 'referenced variable']]
        )
      )
    })  
  })

  it('reorders primitives to the right', () => {
    expectWriterTreeNode(
      add(real(5), variable('x')),
      $add(variable('x'), real(5))[0]
    )(
      ...addOps(
        'reorder operands',
        [['5', 'created real']],
        [['x', 'referenced variable']],
        addOps(
          'created addition',
          [['x', 'referenced variable']],
          [['5', 'created real']],
          []
        )
      )
    )
  })

  describe('when given nested additions with primitives', () => {
    it('combines primitives on the right', () => {
      expectWriterTreeNode(
        add(add(variable('x'), real(5)), real(10)),
        // $add(variable('x'), add(real(5), real(10)))[0]
        $add(variable('x'), real(15))[0]
      )(
        ...addOps(
          'additive associativity',
          addOps(
            'created addition',
            [['x', 'referenced variable']],
            [['5', 'created real']],
            []
          ),
          [['10', 'created real']],
          addOps(
            'created addition',
            [['x', 'referenced variable']],
            addOps(
              'real addition',
              [['5', 'created real']],
              [['10', 'created real']],
              [['15', 'created real']]
            ),
            []
          )
        )
      )
    })

    it('reorders primitives before combining them', () => {
      expectWriterTreeNode(
        add(real(5), add(real(10), variable('x'))),
        $add(variable('x'), real(15))[0]
      )(
        ...addOps(
          'reorder operands',
          [['5', 'created real']],
          addOps(
            'reorder operands',
            [['10', 'created real']],
            [['x', 'referenced variable']],
            addOps(
              'created addition',
              [['x', 'referenced variable']],
              [['10', 'created real']],
              []
            )
          ),
          addOps(
            'additive associativity',
            [['(x+10)', 'created addition']],
            [['5', 'created real']],
            addOps(
              'created addition',
              [['x', 'referenced variable']],
              addOps(
                'real addition',
                [['10', 'created real']],
                [['5', 'created real']],
                [['15', 'created real']]
              ),
              []
            )
          )
        )
      )
    })

    it('casts primitives to minimize complexity', () => {
      expectWriterTreeNode(
        add(add(variable('x'), real(1)), complex([0, 1])),
        $add(variable('x'), complex([1, 1]))[0]
      )(
        ...addOps(
          'additive associativity',
          addOps(
            'created addition',
            [['x', 'referenced variable']],
            [['1', 'created real']],
            []
          ),
          [[`0+1${Unicode.i}`, 'created complex']],
          addOps(
            'created addition',
            [['x', 'referenced variable']],
            addOps(
              'complex addition',
              [
                ['1', 'created real'],
                [`1+0${Unicode.i}`, 'cast to Complex from Real']
              ],
              [[`0+1${Unicode.i}`, 'created complex']],
              [[`1+1${Unicode.i}`, 'created complex']]
            ),
            []
          )
        )
      )
    })
  })

  it('doubles the left operand if equivalent to the right', () => {
    expectWriterTreeNode(
      add(variable('x'), variable('x')),
      double(variable('x'))
    )(
      ...addOps(
        'equivalence: replaced with double',
        [['x', 'referenced variable']],
        [['x', 'referenced variable']],
        multiplyOps(
          'created multiplication',
          [['2', 'created real']],
          [['x', 'referenced variable']],
          []
        )
      )
    )
  })

  describe('when given a nested addition with a like term', () => {
    it('doubles a right operand if equivalent to a left-nested-add left operand', () => {
      expectWriterTreeNode(
        add(add(variable('x'), variable('y')), variable('x')),
        add(double(variable('x')), variable('y'))
      )(
        ...addOps(
          'combined like terms',
          addOps(
            'created addition',
            [['x', 'referenced variable']],
            [['y', 'referenced variable']],
            []
          ),
          [['x', 'referenced variable']],
          addOps(
            'created addition',
            multiplyOps(
              'created multiplication',
              [['2', 'created real']],
              [['x', 'referenced variable']],
              []
            ),
            [['y', 'referenced variable']],
            []
          )
        )
      )
    })

    it('doubles a right operand if equivalent to a left-nested-add right operand', () => {
      expectWriterTreeNode(
        add(add(variable('y'), variable('x')), variable('x')),
        add(double(variable('x')), variable('y'))
      )(
        ...addOps(
          'combined like terms',
          addOps(
            'created addition',
            [['y', 'referenced variable']],
            [['x', 'referenced variable']],
            []
          ),
          [['x', 'referenced variable']],
          addOps(
            'created addition',
            multiplyOps(
              'created multiplication',
              [['2', 'created real']],
              [['x', 'referenced variable']],
              []
            ),
            [['y', 'referenced variable']],
            []
          )
        )
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add left operand', () => {
      expectWriterTreeNode(
        add(variable('x'), add(variable('x'), variable('y'))),
        add(double(variable('x')), variable('y'))
      )(
        ...addOps(
          'combined like terms',
          [['x', 'referenced variable']],
          addOps(
            'created addition',
            [['x', 'referenced variable']],
            [['y', 'referenced variable']],
            []
          ),
          addOps(
            'created addition',
            multiplyOps(
              'created multiplication',
              [['2', 'created real']],
              [['x', 'referenced variable']],
              []
            ),
            [['y', 'referenced variable']],
            []
          )
        )
      )
    })

    it('doubles a left operand if equivalent to a right-nested-add right operand', () => {
      expectWriterTreeNode(
        add(variable('x'), add(variable('y'), variable('x'))),
        add(double(variable('x')), variable('y'))
      )(
        ...addOps(
          'combined like terms',
          [['x', 'referenced variable']],
          addOps(
            'created addition',
            [['y', 'referenced variable']],
            [['x', 'referenced variable']],
            []
          ),
          addOps(
            'created addition',
            multiplyOps(
              'created multiplication',
              [['2', 'created real']],
              [['x', 'referenced variable']],
              []
            ),
            [['y', 'referenced variable']],
            []
          )
        )
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
        ...addOps(
          'combined like terms',
          variableOps('x'),
          multiplyOps(
            'created multiplication',
            realOps('2'),
            variableOps('x'),
            []
          ),
          multiplyOps(
            'created multiplication',
            addOps(
              'real addition',
              realOps('1'),
              realOps('2'),
              realOps('3')
            ),
            variableOps('x'),
            []
          )
        )
      )
    })

    // E.g. 2 * x + x <-> 3 * x
    it('adds 1 to left operand of left-nested-multiply', () => {
      expectWriterTreeNode(
        add(multiply(real(2), variable('x')), variable('x')),
        multiply(real(3), variable('x'))
      )(
        ...addOps(
          'combined like terms',
          multiplyOps(
            'created multiplication',
            realOps('2'),
            variableOps('x'),
            []
          ),
          variableOps('x'),
          multiplyOps(
            'created multiplication',
            addOps(
              'real addition',
              realOps('1'),
              realOps('2'),
              realOps('3')
            ),
            variableOps('x'),
            []
          )
        )
      )
    })

    // E.g. 2 * x + 3 * x <-> 5 * x
    it('adds left operands of dual-nested-multiplies', () => {
      expectWriterTreeNode(
        add(multiply(real(2), variable('x')), multiply(real(3), variable('x'))),
        multiply(real(5), variable('x'))
      )(
        ...addOps(
          'combined like terms',
          multiplyOps(
            'created multiplication',
            realOps('2'),
            variableOps('x'),
            []
          ),
          multiplyOps(
            'created multiplication',
            realOps('3'),
            variableOps('x'),
            []
          ),
          multiplyOps(
            'created multiplication',
            addOps(
              'real addition',
              realOps('2'),
              realOps('3'),
              realOps('5')
            ),
            variableOps('x'),
            []
          )
        )
      )
    })
  })

  it('logs all layers of an operation without loss', () => {
    expectWriterTreeNode(
      add(variable('x'), add(variable('y'), add(real(5), real(-5)))),
      add(variable('x'), variable('y'))
    )(
      ...addOps(
        'created addition',
        variableOps('x'),
        addOps(
          'additive identity',
          variableOps('y'),
          addOps(
            'real addition',
            realOps('5'),
            realOps('-5'),
            realOps('0')
          ),
          variableOps('y')
        ),
        []
      )
    )
  })
})

describe('subtract', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expectWriterTreeNode(
      subtract(real(4), real(5)),
      real(-1)
    )(
      ...addOps(
        'real addition',
        realOps('4'),
        multiplyOps(
          'real multiplication',
          realOps('-1'),
          realOps('5'),
          realOps('-5')
        ),
        realOps('-1')
      )
    )
  })

  it('returns a Writer<Addition> for variable inputs', () => {
    expectWriterTreeNode(
      subtract(variable('x'), variable('y')),
      add(variable('x'), multiply(real(-1), variable('y')))
    )(
      ...addOps(
        'created addition',
        variableOps('x'),
        multiplyOps(
          'created multiplication',
          realOps('-1'),
          variableOps('y'),
          []
        ),
        []
      )
    )
  })

  it('returns the negated right when subtracting from 0', () => {
    expectWriterTreeNode(
      subtract(real(0), variable('x')),
      negate(variable('x'))
    )(
      ...addOps(
        'reorder operands',
        realOps('0'),
        multiplyOps(
          'created multiplication',
          realOps('-1'),
          variableOps('x'),
          []
        ),
        addOps(
          'additive identity',
          [['(-1*x)', 'created multiplication']],
          realOps('0'),
          [['(-1*x)', 'created multiplication']]
        )
      )
    )
  })

  it('returns 0 if subtracting a quantity from itself', () => {
    expectWriterTreeNode(
      subtract(variable('x'), variable('x')),
      real(0)
    )(
      ...addOps(
        'combined like terms',
        variableOps('x'),
        multiplyOps(
          'created multiplication',
          realOps('-1'),
          variableOps('x'),
          []
        ),
        multiplyOps(
          'zero absorption',
          addOps(
            'real addition',
            realOps('1'),
            realOps('-1'),
            realOps('0')
          ),
          variableOps('x'),
          realOps('0')
        )
      )
    )
  })

  it('returns 0 if subtracting a complex from itself', () => {
    expectWriterTreeNode(
      subtract(complex([0, 1]), complex([0, 1])),
      complex([0, 0])
    )(
      ...addOps(
        'complex addition',
        complexOps('0', '1'),
        multiplyOps(
          'complex multiplication',
          [
            ...realOps('-1'),
            [`-1+0${Unicode.i}`, 'cast to Complex from Real']
          ],
          complexOps('0', '1'),
          complexOps('0', '-1')
        ),
        complexOps('0', '0')
      )
    )
  })

  it('properly subtracts a real from a complex', () => {
    expectWriterTreeNode(
      subtract(complex([2, 1]), real(1)),
      complex([1, 1])
    )(
      ...addOps(
        'complex addition',
        complexOps('2', '1'),
        [
          ...multiplyOps(
            'real multiplication',
            realOps('-1'),
            realOps('1'),
            realOps('-1')
          ),
          [`-1+0${Unicode.i}`, 'cast to Complex from Real']
        ],
        complexOps('1', '1')
      )
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
