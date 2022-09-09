import { real } from './real'
import { variable } from './variable'
import { add } from './addition'
import { cos } from './trigonometric'
import { invoke, parameterize } from './invocation'
import { scope } from './scope'

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
})

describe('invoke', () => {
  describe('with no passed scope', () => {
    it('applies its arguments to unbound variables', () => {
      const expression = add(variable('x'), variable('y'))
      expect(invoke()(expression)(real(5), real(10))).toEqual(real(15))
    })

    it('applies its arguments in appearance order', () => {
      const expression = add(variable('x'), variable('y'))
      expect(invoke()(expression)(real(5))).toEqual(add(variable('y'), real(5)))
    })
  })

  describe('with a passed scope but no arguments', () => {
    it('evaluates any unbound variables against its scope', () => {
      const s = scope([['x', variable('x', real(5))]])
      const expression = add(variable('x'), variable('y'))
      expect(invoke(s)(expression)()).toEqual(add(variable('y'), real(5)))
    })
  })

  describe('with a passed scope and arguments', () => {
    it('evaluates any unbound variables against argument overridden scope', () => {
      const s = scope([['x', variable('x', real(5))]])
      const expression = add(variable('x'), variable('y'))
      expect(invoke(s)(expression)(real(10))).toEqual(add(variable('y'), real(10)))
    })
  })
})
