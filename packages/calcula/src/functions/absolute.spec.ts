import { unit } from '../monads/writer';
import { 
  expectWriterTreeNode,
  realOps, complexOps, booleanOps, variableOps, absOps
} from '../utility/expectations';
import { Clades, Species } from '../utility/tree';
import { real, complex, boolean, nil, nan } from '../primitives';
import { variable } from "../variable";
import { abs, $abs } from "./absolute";

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
      ...absOps(
        'real absolute',
        realOps('-5'),
        realOps('5')
      )
    )
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expectWriterTreeNode(
      abs(complex([1, 2])),
      complex([2.23606797749979, 0])
    )(
      ...absOps(
        'complex absolute',
        complexOps('1', '2'),
        complexOps('2.23606797749979', '0')
      )
    )
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expectWriterTreeNode(
      abs(boolean(true)),
      boolean(true)
    )(
      ...absOps(
        'boolean absolute',
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns a Writer<Absolute> for variable input', () => {
    expectWriterTreeNode(
      abs(variable('x')),
      $abs(variable('x'))[0]
    )(
      ...absOps(
        'created absolute', 
        variableOps('x'),
        []
      )
    )
  })

  it('returns a NaN for Nil input', () => {
    expectWriterTreeNode(
      abs(nil),
      nan
    )(
      ...absOps(
        'not a number',
        [['nil', 'nothing']],
        [['NaN', 'not a number']]
      )
    )
  })
})
