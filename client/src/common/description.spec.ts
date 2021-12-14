import { about, describe as desc } from './description'
import { 
  real, complex, variable, add, cos
} from './Tree'

describe('describe', () => {
  it('is graphable with no variables for reals', () => {
    expect(desc(real(5))).toEqual(about(true))
  })

  it('is not graphable with no variables for complex numbers', () => {
    expect(desc(complex(1, 1))).toEqual(about(false))
  })

  it('is graphable with the name of a given variable', () => {
    expect(desc(variable('x'))).toEqual(about(true, new Set('x')))
  })

  it('is graphable for non-complex binaries featuring variables', () => {
    expect(desc(add(variable('x'), real(1)))).toEqual(about(true, new Set('x')))
  })

  it('is not graphable for complex binaries featuring variables', () => {
    expect(desc(add(variable('x'), complex(1, 1)))).toEqual(about(false, new Set('x')))
  })

  it('returns all unbound variables for nested binaries', () => {
    expect(
      desc(add(variable('x'), add(variable('y'), variable('z'))))
    ).toEqual(about(true, new Set(['x', 'y', 'z'])))
  })

  it('is graphable for non-complex unary functions', () => {
    expect(
      desc(cos(variable('x')))
    ).toEqual(about(true, new Set('x')))
  })
})
