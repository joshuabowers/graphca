import { unit } from '../monads/writer';
import { expectToEqualWithSnapshot } from '../utility/expectations';
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
    expectToEqualWithSnapshot(
      abs(real(-5)),
      real(5)
    )
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expectToEqualWithSnapshot(
      abs(complex([1, 2])),
      complex([2.23606797749979, 0])
    )
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expectToEqualWithSnapshot(
      abs(boolean(true)),
      boolean(true)
    )
  })

  it('returns a Writer<Absolute> for variable input', () => {
    expectToEqualWithSnapshot(
      abs(variable('x')),
      $abs(variable('x'))[0]
    )
  })

  it('returns a NaN for Nil input', () => {
    expectToEqualWithSnapshot(
      abs(nil),
      nan
    )
  })
})
