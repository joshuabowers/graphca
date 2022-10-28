import { unit } from '../monads/writer'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'
import { Clades, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { gamma, $gamma } from './gamma'
import { Unicode } from '../Unicode'

describe('$gamma', () => {
  expect($gamma(unit(variable('x').value))[0]).toEqual({
    clade: Clades.unary, genus: undefined, species: Species.gamma,
    expression: unit(variable('x').value)
  })
})

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
    expectCloseTo(gamma(complex([1, 1])), complex([0.498015668118, -0.154949828301]), 10)
  })

  it('generates a Gamma node for unbound variables', () => {
    expectWriterTreeNode(
      gamma(variable('x')),
      $gamma(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      [`${Unicode.gamma}(x)`, `${Unicode.gamma}(x)`, 'gamma']
    )
  })
})
