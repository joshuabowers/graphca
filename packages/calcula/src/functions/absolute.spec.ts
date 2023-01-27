import { unit } from '../monads/writer';
import { expectWriterTreeNode } from '../utility/expectations';
import { Clades, Species } from '../utility/tree';
import { real, complex, boolean, nil, nan } from '../primitives';
import { variable } from "../variable";
import { abs, $abs } from "./absolute";
import { Unicode } from '../Unicode';

describe('$abs', () => {
  it('generates an Absolute for a TreeNode input', () => {
    expect(
      $abs(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: undefined, species: Species.abs,
      expression: unit(variable('x').value)
    })
  })
})

describe('abs', () => {
  it('returns a Writer<Real> for a real input', () => {
    expectWriterTreeNode(
      abs(real(-5)),
      real(5)
    )(
      ['-5', '-5', 'given primitive'],
      ['abs(-5)', '5', 'real absolute'],
      ['5', '5', 'given primitive']
    )
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expectWriterTreeNode(
      abs(complex([1, 2])),
      complex([2.23606797749979, 0])
    )(
      [`1+2${Unicode.i}`, `1+2${Unicode.i}`, 'given primitive'],
      [
        `abs(1+2${Unicode.i})`, 
        `2.23606797749979+0${Unicode.i}`, 
        'complex absolute'
      ],
      [
        `2.23606797749979+0${Unicode.i}`, 
        `2.23606797749979+0${Unicode.i}`, 
        'given primitive'
      ]
    )
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expectWriterTreeNode(
      abs(boolean(true)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['abs(true)', 'true', 'boolean absolute'],
    )
  })

  it('returns a Writer<Absolute> for variable input', () => {
    expectWriterTreeNode(
      abs(variable('x')),
      $abs(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['abs(x)', 'abs(x)', 'absolute']
    )
  })

  it('returns a NaN for Nil input', () => {
    expectWriterTreeNode(
      abs(nil),
      nan
    )(
      ['abs(nil)', 'NaN', 'not a number']
    )
  })
})
