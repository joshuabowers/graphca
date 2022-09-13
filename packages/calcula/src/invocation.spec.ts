import { real } from './primitives/real'
import { variable, scope } from './variable'
import { add } from './arithmetic/addition'
import { invoke } from './invocation'

describe('invoke', () => {
  describe('with no passed scope', () => {
    it('applies its arguments to unbound variables', () => {
      const expression = add(variable('x'), variable('y'))
      expect(invoke()(expression)(real(5), real(10)).value).toEqual(real(15).value)
    })

    it('applies its arguments in appearance order', () => {
      const expression = add(variable('x'), variable('y'))
      expect(
        invoke()(expression)(real(5)).value
      ).toEqual(add(variable('y'), real(5)).value)
    })
  })

  describe('with a passed scope but no arguments', () => {
    it('evaluates any unbound variables against its scope', () => {
      const s = scope([['x', variable('x', real(5))]])
      const expression = add(variable('x'), variable('y'))
      expect(invoke(s)(expression)().value).toEqual(add(variable('y'), real(5)).value)
    })
  })

  describe('with a passed scope and arguments', () => {
    it('evaluates any unbound variables against argument overridden scope', () => {
      const s = scope([['x', variable('x', real(5))]])
      const expression = add(variable('x'), variable('y'))
      expect(invoke(s)(expression)(real(10)).value).toEqual(add(variable('y'), real(10)).value)
    })
  })
})
