import { unit } from '../monads/writer'
import { 
  expectCloseTo, expectWriterTreeNode,
  realOps, variableOps, polygammaOps
} from '../utility/expectations'
import { Clades, Species } from '../utility/tree'
import { EulerMascheroni } from '../primitives/real'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { negate } from '../arithmetic'
import { polygamma, digamma, $polygamma } from './polygamma'

describe('$polygamma', () => {
  it('generates a Polygamma for two TreeNode inputs', () => {
    expect(
      $polygamma(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: undefined, species: Species.polygamma,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('polygamma', () => {
  describe('for large inputs', () => {
    it('calculates an approximate value for positive reals for m=1', () => {
      expectCloseTo(polygamma(real(1), real(100)), real(0.0100501666633), 10)
    })

    it('calculates an approximate value for complex numbers for m=1', () => {
      expectCloseTo(
        polygamma(real(1), complex([0, 100])),
        complex([-0.0000499999999, -0.0099998333299]),
        10
      )
    })
  })

  describe('for negative inputs', () => {
    it('reflects and calculates for a mapped positive real', () => {
      expectCloseTo(
        polygamma(real(1), real(-100.5)), 
        real(9.85970349187), 
        10
      )
    })
  })

  describe('for small positive inputs', () => {
    it('uses a recurrence relation to calculate for a mapped large', () => {
      expectCloseTo(
        polygamma(real(1), real(1)),
        real(1.644934066848),
        10
      )
    })

    it('uses a recurrence relation to calculate for a mapped large complex', () => {
      expectCloseTo(
        polygamma(real(1), complex([1, 1])),
        complex([0.463000096622, -0.794233542759]),
        10
      )
    })
  })

  it('generates a polygamma node of a given order on an expression', () => {
    expectWriterTreeNode(
      polygamma(variable('x'), variable('y')),
      $polygamma(variable('x'), variable('y'))[0]
    )(
      ...polygammaOps(
        'created polygamma',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})

describe('digamma', () => {
  describe('for large inputs', () => {
    it('calculates an approximate value for positive reals', () => {
      expectCloseTo(digamma(real(10)), real(2.2517525890667), 10)
    })

    it('calculates an approximate value for complex numbers', () => {
      expectCloseTo(
        digamma(complex([0, 10])), 
        complex([2.3034192636714, 1.6207963267948]), 
        10
      )
    })
  })

  describe('for negative inputs', () => {
    it('reflects and calculates for a mapped positive real', () => {
      expectCloseTo(digamma(real(-100.5)), real(4.61512460133), 10)
    })
  })

  describe('for small positive inputs', () => {
    it('uses a recurrence relation to calculate for a mapped large real', () => {
      expectCloseTo(digamma(real(1)), negate(EulerMascheroni), 10)
    })

    it('uses a recurrence relation to calculate for a mapped large complex', () => {
      expectCloseTo(
        digamma(complex([1, 1])),
        complex([0.094650320622, 1.076674047468]),
        10
      )
    })
  })

  it('generates a polygamma node of order 0 on an expression', () => {
    expectWriterTreeNode(
      digamma(variable('x')),
      $polygamma(real(0), variable('x'))[0]
    )(
      ...polygammaOps(
        'created polygamma',
        realOps('0'),
        variableOps('x'),
        []
      )
    )
  })
})