import { real, complex, boolean } from './primitives'
import { variable, scope } from './variable'
import { add } from './arithmetic/addition'
import { invoke } from './invocation'
import { multiply } from './arithmetic'
import { factorial } from './functions/factorial'

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

  describe('when given an expression with multiple instances of a variable', () => {
    it('substitutes a newly bound value for each variable instance', () => {
      const expression = multiply(variable('x'), add(variable('x'), real(5)))
      expect(invoke()(expression)(real(4)).value).toEqual(real(36).value)
    })
  })

  describe('of specific node types', () => {
    it('returns reals directly', () => {
      expect(invoke()(real(5))().value).toEqual(real(5).value)
    })

    it('returns complex numbers directly', () => {
      expect(invoke()(complex([1, 5]))().value).toEqual(complex([1, 5]).value)
    })

    it('returns booleans directly', () => {
      expect(invoke()(boolean(true))().value).toEqual(boolean(true).value)
    })

    it('returns unbound variables directly', () => {
      expect(invoke()(variable('x'))().value).toEqual(variable('x').value)
    })

    it('returns the value of an argument-bound variable', () => {
      expect(invoke()(variable('x'))(real(5)).value).toEqual(real(5).value)
    })

    it('returns the value of a scope-bound variable', () => {
      const s = scope([['x', variable('x', real(5))]])
      expect(invoke(s)(variable('x'))().value).toEqual(real(5).value)
    })

    it('substitutes a variable with an unbound variable argument', () => {
      expect(invoke()(variable('x'))(variable('y')).value).toEqual(variable('y').value)
    })

    it('evaluates left child variables of binaries', () => {
      const expression = add(variable('x'), real(5))
      expect(invoke()(expression)(real(10)).value).toEqual(real(15).value)
    })

    it('evaluates right child variables of binaries', () => {
      const expression = multiply(real(5), variable('x'))
      expect(invoke()(expression)(real(10)).value).toEqual(real(50).value)
    })

    it('evaluates child variables of unary nodes', () => {
      const expression = factorial(variable('x'))
      expect(invoke()(expression)(real(5)).value).toEqual(real(120).value)
    })
  })
})
