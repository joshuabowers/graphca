import { expectCloseTo, expectWriter } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { raise } from '../arithmetic'
import { Logarithm, log, lb, ln, lg } from './logarithmic'

describe('log', () => {
  it('calculates the real log of a real value', () => {
    expectWriter(log(real(16), real(256)))(
      real(2).value,
      [[real(16).value, real(256).value], 'computed real logarithm']
    )
  })

  it('calculates the complex log of a complex value', () => {
    expectCloseTo(log(complex([0, 1]), complex([1, 2])), complex([0.7048327646991, -0.5122999987267]), 10)
  })

  it('calculates a complex log of a real value', () => {
    expectCloseTo(log(complex([0, 1]), real(10)), complex([0, -1.465871197758]), 10)
  })

  it('calculates a real log of a complex value', () => {
    expectCloseTo(log(real(10), complex([0, 1])), complex([0, 0.6821881769209]), 10)
  })

  it('returns an expression for unbound subtrees', () => {
    expectWriter(log(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.logarithmic, species: Species.log,
        left: variable('x'), right: variable('y')
      } as Logarithm,
      [[variable('x').value, variable('y').value], 'logarithm']
    )
  })

  it('returns the exponent of a similarly based exponential', () => {
    expectWriter(log(real(16), raise(real(16), variable('x'))))(
      variable('x').value,
      [[real(16).value, variable('x').value], 'exponentiation'],
      [[real(16).value, raise(real(16), variable('x')).value], 'inverse operation cancellation']
    )
  })
})

describe('lb', () => {
  it('calculates the base 2 logarithm of a real', () => {
    expectWriter(lb(real(1024)))(
      real(10).value,
      [[real(2).value, real(1024).value], 'computed real logarithm']
    )
  })

  it('returns the exponent of a binary exponential', () => {
    expectWriter(lb(raise(real(2), variable('x'))))(
      variable('x').value,
      [[real(2).value, variable('x').value], 'exponentiation'],
      [[real(2).value, raise(real(2), variable('x')).value], 'inverse operation cancellation']
    )
  })
})

describe('ln', () => {
  it('calculates the base e logarithm of complex 0', () => {
    expectWriter(ln(complex([0, 0])))(
      complex([-Infinity, 0]).value,
      [real(Math.E).value, 'cast to complex'],
      [[complex([Math.E, 0]).value, complex([0, 0]).value], 'computed complex logarithm']
    )
  })

  it('calculates the natural logarithm of a complex', () => {
    expectCloseTo(ln(complex([3.79890743995, 2.1117859405])), complex([1.4693517444, 0.50735630322]), 10)
  })

  it('returns the exponent of a natural exponential', () => {
    expectWriter(ln(raise(real(Math.E), variable('x'))))(
      variable('x').value,
      [[real(Math.E).value, variable('x').value], 'exponentiation'],
      [[real(Math.E).value, raise(real(Math.E), variable('x')).value], 'inverse operation cancellation']
    )
  })
})

describe('lg', () => {
  it('calculates the base 10 logarithm of a real', () => {
    expectCloseTo(lg(real(1000)), real(3), 10)
  })

  it('returns the exponent of a common exponential', () => {
    expectWriter(lg(raise(real(10), variable('x'))))(
      variable('x').value,
      [[real(10).value, variable('x').value], 'exponentiation'],
      [[real(10).value, raise(real(10), variable('x')).value], 'inverse operation cancellation']
    )
  })
})
