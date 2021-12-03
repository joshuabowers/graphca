import { expectCloseTo } from './expectations'
import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { Polygamma, polygamma } from './polygamma'

describe('polygamma', () => {
  describe('of reals', () => {
    // 2.2517525890667 211076474561638858515372118089180283303694482010190...
    it('calculates an approximate value for positive reals for digamma', () => {
      expectCloseTo(polygamma(real(0), real(10)), real(2.2517525890667), 10)
    })

    // 0.0100501666633 335713952456684657014225356282011755346238824472488...
    it('calculates an approximate value for positive reals for trigamma', () => {
      expectCloseTo(polygamma(real(1), real(100)), real(0.0100501666633), 10)
    })
  })

  describe('of complex numbers', () => {
    // 2.3034192636714 12535169217706005055981231525010822967923821662274... +
    // 1.6207963267948 96619231321693260153536542076932105598472687028231... i
    it('calculates an approximate value for complex numbers for digamma', () => {
      expectCloseTo(
        polygamma(real(0), complex(0, 10)), 
        complex(2.3034192636714, 1.6207963267948), 
        10
      )
    })

    // -0.0000499999999 9999999999999999999999999999999999999999999999999... -
    // 0.0099998333299 99761871420993138692763427545395192794130579908... i
    it('calculates an approximate value for complex numbers for trigamma', () => {
      expectCloseTo(
        polygamma(real(1), complex(0, 100)),
        complex(-0.0000499999999, -0.0099998333299),
        10
      )
    })
  })

  it('generates a polygamma node of a given order on an expression', () => {
    expect(polygamma(variable('x'), variable('y'))).toEqual(
      new Polygamma(variable('x'), variable('y'))
    )
  })
})
