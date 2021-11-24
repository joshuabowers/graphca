import { expectCloseTo } from './expectations'
import { Gamma } from './Expression'
import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { gamma } from './gamma'

describe('gamma', () => {
  it('calculates the value of the gamma function for reals', () => {
    expectCloseTo(gamma(real(5.5)), real(52.34277778455362), 10)
  })

  it('calculates the value of the gamma function for integers', () => {
    expectCloseTo(gamma(real(5)), real(24), 10)
  })

  it('calculates the value of the gamma function for negative reals', () => {
    expectCloseTo(gamma(real(-5.5)), real(0.010912654781909826), 10)
  })

  it('calculates the value of the gamma function for complex numbers', () => {
    expectCloseTo(gamma(complex(1, 1)), complex(0.498015668118, -0.154949828301), 10)
  })

  it('generates a Gamma node for unbound variables', () => {
    expect(gamma(variable('x'))).toEqual(new Gamma(variable('x')))
  })
})
