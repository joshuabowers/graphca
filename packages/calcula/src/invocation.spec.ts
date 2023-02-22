import { expectToEqualWithSnapshot } from './utility/expectations'
import { real, complex, boolean } from './primitives'
import { variable, scope } from './variable'
import { add } from './arithmetic/addition'
import { invoke } from './invocation'
import { multiply } from './arithmetic'
import { cos } from './functions/trigonometric'

describe('invoke', () => {
  describe('with no passed scope', () => {
    it('applies its arguments to unbound variables', () => {
      expectToEqualWithSnapshot(
        invoke()(add(variable('x'), variable('y')))(real(5), real(10)),
        real(15)
      )
    })

    it('applies its arguments in appearance order', () => {
      expectToEqualWithSnapshot(
        invoke()(add(variable('x'), variable('y')))(real(5)),
        add(variable('y'), real(5))
      )
    })
  })

  describe('with a passed scope but no arguments', () => {
    it('evaluates any unbound variables against its scope', () => {
      const s = scope([['x', variable('x', real(5))]])

      expectToEqualWithSnapshot(
        invoke(s)(add(variable('x'), variable('y')))(),
        add(variable('y'), real(5))
      )
    })
  })

  describe('with a passed scope and arguments', () => {
    it('evaluates any unbound variables against argument overridden scope', () => {
      const s = scope([['x', variable('x', real(5))]])

      expectToEqualWithSnapshot(
        invoke(s)(add(variable('x'), variable('y')))(real(10)),
        add(variable('y'), real(10))
      )
    })
  })

  describe('when given an expression with multiple instances of a variable', () => {
    it('substitutes a newly bound value for each variable instance', () => {
      expectToEqualWithSnapshot(
        invoke()(multiply(variable('x'), add(variable('x'), real(5))))(real(4)),
        real(36)
      )
    })
  })

  describe('of specific node types', () => {
    it('returns reals directly', () => {
      expectToEqualWithSnapshot(
        invoke()(real(5))(),
        real(5)
      )
    })

    it('returns complex numbers directly', () => {
      expectToEqualWithSnapshot(
        invoke()(complex([1, 5]))(),
        complex([1, 5])
      )
    })

    it('returns booleans directly', () => {
      expectToEqualWithSnapshot(
        invoke()(boolean(true))(),
        boolean(true)
      )
    })

    it('returns unbound variables directly', () => {
      expectToEqualWithSnapshot(
        invoke()(variable('x'))(),
        variable('x')
      )
    })

    it('returns the value of an argument-bound variable', () => {
      expectToEqualWithSnapshot(
        invoke()(variable('x'))(real(5)),
        real(5)
      )
    })

    it('returns the value of a scope-bound variable', () => {
      const s = scope([['x', variable('x', real(5))]])
      expectToEqualWithSnapshot(
        invoke(s)(variable('x'))(),
        real(5)
      )
    })

    it('substitutes a variable with an unbound variable argument', () => {
      expectToEqualWithSnapshot(
        invoke()(variable('x'))(variable('y')),
        variable('y')
      )
    })

    it('evaluates left child variables of binaries', () => {
      expectToEqualWithSnapshot(
        invoke()(add(variable('x'), real(5)))(real(10)),
        real(15)
      )
    })

    it('evaluates right child variables of binaries', () => {
      expectToEqualWithSnapshot(
        invoke()(multiply(real(5), variable('x')))(real(10)),
        real(50)
      )
    })

    it('evaluates child variables of unary nodes', () => {
      expectToEqualWithSnapshot(
        invoke()(cos(variable('x')))(real(Math.PI)),
        real(-1)
      )
    })
  })
})
