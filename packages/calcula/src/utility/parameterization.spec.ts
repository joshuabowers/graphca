import { variable } from '../variable'
import { add } from '../arithmetic'
import { cos } from '../functions/trigonometric'
import { parameterize } from './parameterization'

describe('parameterize', () => {
  it('returns a variable name', () => {
    expect(parameterize(variable('x'))).toEqual(new Set('x'))
  })

  it('returns variables within binaries', () => {
    expect(parameterize(add(variable('x'), variable('y')))).toEqual(new Set(['x', 'y']))
  })

  it('returns variables within unary functions', () => {
    expect(parameterize(cos(variable('x')))).toEqual(new Set('x'))
  })

  it('returns a single name for a variable encountered twice', () => {
    expect(
      parameterize(add(variable('x'), cos(variable('x'))))
    ).toEqual(new Set('x'))
  })

  it('returns multiple variables in occurrence order', () => {
    expect(
      parameterize(add(add(variable('x'), variable('y')), cos(variable('x'))))
    ).toEqual(new Set(['x', 'y']))
    expect(
      parameterize(add(add(variable('y'), variable('x')), cos(variable('x'))))
    ).toEqual(new Set(['y', 'x']))
  })
})
