import { unit } from '../monads/writer'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { multiply } from './multiplication'
import { raise, reciprocal, square, sqrt, $raise } from './exponentiation'
import { log, lb, ln, lg } from '../functions/logarithmic'
import { 
  expectToEqualWithSnapshot, expectCloseTo 
} from '../utility/expectations'

describe('$raise', () => {
  it('generates an Exponentiation for a pair of TreeNode inputs', () => {
    expect(
      $raise(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.arithmetic, species: Species.raise,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('raise', () => {
  it('computes the value of a real raised to a real', () => {
    expectToEqualWithSnapshot(
      raise(real(2), real(3)),
      real(8)
    )
  })

  it('calculates the value of raising one complex to another', () => {
    expectCloseTo(raise(complex(0, 1), complex(0, 1)), complex(0.20787957635076, 0), 10)
  })

  it('calculates the value of raising a real to a complex number', () => {
    expectCloseTo(raise(real(-2), complex(3, 4)), complex(0.000026020793185, -0.000010062701000), 10)
  })

  it('calculates the value of raising a complex number to a real', () => {
    expectCloseTo(raise(complex(2, 3), real(5)), complex(122, -597), 10)
  })

  it('calculates the complex square root', () => {
    expectCloseTo(
      raise(complex(2, 3), real(0.5)), 
      complex(1.67414922803554, 0.89597747612983), 
      10
    )
  })

  it('returns 0 when the base is 0', () => {
    expectToEqualWithSnapshot(
      raise(real(0), variable('x')),
      real(0)
    )
  })

  it('returns 1 when the exponent is 0', () => {
    expectToEqualWithSnapshot(
      raise(variable('x'), real(0)),
      real(1)
    )
  })

  it('returns 1 when the base is 1', () => {
    expectToEqualWithSnapshot(
      raise(real(1), variable('x')),
      real(1)
    )
  })

  it('returns the base whenever the exponent is 1', () => {
    expectToEqualWithSnapshot(
      raise(variable('x'), real(1)),
      variable('x')
    )
  })

  it('returns the sub-expression of an lb if base 2', () => {
    expectToEqualWithSnapshot(
      raise(real(2), lb(variable('x'))),
      variable('x')
    )
  })

  it('returns the sub-expression of an ln if base e', () => {
    expectToEqualWithSnapshot(
      raise(real(Math.E), ln(variable('x'))),
      variable('x')
    )
  })

  it('returns the sub-expression of an lg if base 10', () => {
    expectToEqualWithSnapshot(
      raise(real(10), lg(variable('x'))),
      variable('x')
    )
  })
  
  it('returns the value of a logarithm if raising similar base to it', () => {
    expectToEqualWithSnapshot(
      raise(complex(0, 1), log(complex(0, 1), variable('x'))),
      variable('x')
    )
  })

  it('multiplies the exponent of a base exponential against the exponent', () => {
    expectToEqualWithSnapshot(
      raise(raise(variable('x'), variable('y')), variable('z')),
      raise(variable('x'), multiply(variable('y'), variable('z')))
    )
  })

  it('converts a base multiplication into a product of exponentiations', () => {
    expectToEqualWithSnapshot(
      raise(multiply(variable('x'), variable('y')), variable('z')),
      multiply(
        raise(variable('x'), variable('z')),
        raise(variable('y'), variable('z'))
      )
    )
  })
  
  it('creates an Exponentiation when given non-constants', () => {
    expectToEqualWithSnapshot(
      raise(variable('x'), real(3)),
      $raise(variable('x'), real(3))[0]
    )
  })
})

describe('reciprocal', () => {
  it('raises its argument to the power of -1', () => {
    expectToEqualWithSnapshot(
      reciprocal(variable('x')),
      raise(variable('x'), real(-1))
    )
  })

  it('raises complex 1 to -1 correctly', () => {
    expectToEqualWithSnapshot(
      reciprocal(complex(1, 0)),
      complex(1, 0)
    )
  })

  it('calculates a complex reciprocal correctly', () => {
    expectCloseTo(reciprocal(complex(1, 1)), complex(0.5, -0.5), 10)
  })

  it('calculates a reciprocal of complex 0 correctly', () => {
    expectCloseTo(reciprocal(complex(0, 0)), complex(Infinity, 0), 10)
  })
})

describe('square', () => {
  it('raises its argument to the power of 2', () => {
    expectToEqualWithSnapshot(
      square(variable('x')),
      raise(variable('x'), real(2))
    )
  })

  it('calculates the proper square of a complex number', () => {
    expectCloseTo(square(complex(1, 1)), complex(0, 2), 10)
  })
})

describe('sqrt', () => {
  it('raises its argument to the power of 0.5', () => {
    expectToEqualWithSnapshot(
      sqrt(variable('x')),
      raise(variable('x'), real(0.5))
    )
  })

  it('calculates the proper sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex(1, 1)), complex(1.098684113467, 0.455089860562), 10)
  })

  it('calculates the complex sqrt of a complex number', () => {
    expectCloseTo(sqrt(complex(3, 1)), complex(1.755317301824, 0.284848784593), 10)
  })
})
