import { unit } from '../monads/writer'
import { 
  expectToEqualWithSnapshot, expectCloseTo
} from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { raise } from '../arithmetic'
import { log, lb, ln, lg, $log } from './logarithmic'

describe('$log', () => {
  it('generates a Logarithm from two TreeNode parameters', () => {
    expect(
      $log(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.logarithmic, species: Species.log,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('log', () => {
  it('calculates the real log of a real value', () => {
    expectToEqualWithSnapshot(
      log(real(16), real(256)),
      real(2)
    )
  })

  it('calculates the complex log of a complex value', () => {
    expectCloseTo(log(complex(0, 1), complex(1, 2)), complex(0.7048327646991, -0.5122999987267), 10)
  })

  it('calculates a complex log of a real value', () => {
    expectCloseTo(log(complex(0, 1), real(10)), complex(0, -1.465871197758), 10)
  })

  it('calculates a real log of a complex value', () => {
    expectCloseTo(log(real(10), complex(0, 1)), complex(0, 0.6821881769209), 10)
  })

  it('returns an expression for unbound subtrees', () => {
    expectToEqualWithSnapshot(
      log(variable('x'), variable('y')),
      $log(variable('x'), variable('y'))[0]
    )
  })

  it('returns the exponent of a similarly based exponential', () => {
    expectToEqualWithSnapshot(
      log(real(16), raise(real(16), variable('x'))),
      variable('x')
    )
  })
})

describe('lb', () => {
  it('calculates the base 2 logarithm of a real', () => {
    expectToEqualWithSnapshot(
      lb(real(1024)),
      real(10)
    )
  })

  it('returns the exponent of a binary exponential', () => {
    expectToEqualWithSnapshot(
      lb(raise(real(2), variable('x'))),
      variable('x')
    )
  })
})

describe('ln', () => {
  it('calculates the base e logarithm of complex 0', () => {
    expectToEqualWithSnapshot(
      ln(complex(0, 0)),
      complex(-Infinity, 0)
    )
  })

  it('calculates the natural logarithm of a complex', () => {
    expectCloseTo(ln(complex(3.79890743995, 2.1117859405)), complex(1.4693517444, 0.50735630322), 10)
  })

  it('returns the exponent of a natural exponential', () => {
    expectToEqualWithSnapshot(
      ln(raise(real(Math.E), variable('x'))),
      variable('x')
    )
  })
})

describe('lg', () => {
  it('calculates the base 10 logarithm of a real', () => {
    expectCloseTo(lg(real(1000)), real(3), 10)
  })

  it('returns the exponent of a common exponential', () => {
    expectToEqualWithSnapshot(
      lg(raise(real(10), variable('x'))),
      variable('x')
    )
  })
})
