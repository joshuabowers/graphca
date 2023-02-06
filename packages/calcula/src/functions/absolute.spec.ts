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
      ['abs(-5)', 'identified absolute'],
      ['abs(|-5)', 'processing argument'],
      ['-5', 'created real'],
      ['abs(-5|)', 'processed argument'],
      ['abs(-5)', 'real absolute'],
      ['5', 'created real']
    )
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expectWriterTreeNode(
      abs(complex([1, 2])),
      complex([2.23606797749979, 0])
    )(
      [`abs(1+2${Unicode.i})`, 'identified absolute'],
      [`abs(|1+2${Unicode.i})`, 'processing argument'],
      [`1+2${Unicode.i}`, 'created complex'],
      [`abs(1+2${Unicode.i}|)`, 'processed argument'],
      [`abs(1+2${Unicode.i})`, 'complex absolute'],
      [`2.23606797749979+0${Unicode.i}`, 'created complex']
    )
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expectWriterTreeNode(
      abs(boolean(true)),
      boolean(true)
    )(
      ['abs(true)', 'identified absolute'],
      ['abs(|true)', 'processing argument'],
      ['true', 'created boolean'],
      ['abs(true|)', 'processed argument'],
      ['abs(true)', 'boolean absolute'],
      ['true', 'created boolean']
    )
  })

  it('returns a Writer<Absolute> for variable input', () => {
    expectWriterTreeNode(
      abs(variable('x')),
      $abs(unit(variable('x').value))[0]
    )(
      ['abs(x)', 'identified absolute'],
      ['abs(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['abs(x|)', 'processed argument'],
      ['abs(x)', 'created absolute']
    )
  })

  it('returns a NaN for Nil input', () => {
    expectWriterTreeNode(
      abs(nil),
      nan
    )(
      ['abs(nil)', 'identified absolute'],
      ['abs(|nil)', 'processing argument'],
      ['nil', 'nothing'],
      ['abs(nil|)', 'processed argument'],
      ['abs(nil)', 'not a number'],
      ['NaN', 'not a number']
    )
  })
})
