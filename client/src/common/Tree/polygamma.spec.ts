import { variable } from './variable'
import { Polygamma, polygamma } from './polygamma'

describe('polygamma', () => {
  it.todo('calculates the polygamma of a given real order of a real')

  it('generates a polygamma node of a given order on an expression', () => {
    expect(polygamma(variable('x'), variable('y'))).toEqual(
      new Polygamma(variable('x'), variable('y'))
    )
  })
})
