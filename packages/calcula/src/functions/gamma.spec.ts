import { expectCloseTo, expectWriter } from '../utility/expectations'
import { Clades, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { Gamma, gamma } from './gamma'

describe('gamma', () => {
  it('calculates the value of the gamma function for reals', () => {
    expectCloseTo(gamma(real(5.5)), real(52.34277778455362), 10)
  })

  it('calculates the value of the gamma function for integers', () => {
    console.log(real(24))
    console.dir(gamma(real(5)))
    expectCloseTo(gamma(real(5)), real(24), 10)
  })

  it('calculates the value of the gamma function for negative reals', () => {
    expectCloseTo(gamma(real(-5.5)), real(0.010912654781909826), 10)
  })

  it('calculates the value of the gamma function for complex numbers', () => {
    expectCloseTo(gamma(complex([1, 1])), complex([0.498015668118, -0.154949828301]), 10)
  })

  it('generates a Gamma node for unbound variables', () => {
    expectWriter(gamma(variable('x')))(
      {
        clade: Clades.unary, genus: undefined, species: Species.gamma,
        expression: variable('x')
      } as Gamma,
      [variable('x').value, 'gamma']
    )
  })
})
