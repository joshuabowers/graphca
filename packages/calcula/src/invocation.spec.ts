import { 
  expectWriterTreeNode, Op,
  realOps, complexOps, booleanOps, variableOps,
  evaluateOps, substituteOps, noSubstituteOps, invokeOps, 
  addOps, multiplyOps, factorialOps
} from './utility/expectations'
import { real, complex, boolean } from './primitives'
import { variable, scope } from './variable'
import { add } from './arithmetic/addition'
import { invoke } from './invocation'
import { multiply } from './arithmetic'
import { factorial } from './functions/factorial'

describe('invoke', () => {
  describe('with no passed scope', () => {
    /**
     * Desireable output for the following expression:
     * (x+y)(5, 10) => [
     *    ['(x+y)(5, 10)', 'identified invocation'],
     *    ['([x+y])(5, 10), 'processing expression'],
     *    ['(x+y)', 'identified addition'],
     *    ['([x]+y), 'processing left operand'],
     *    ['x', 'referenced variable'],
     *    ['({x}+[y]), 'processed left operand; processing right operand'],
     *    ['y', 'referenced variable'],
     *    ['(x+{y}), 'processed right operand'],
     *    ['(x+y)', 'created addition'],
     *    ['((x+y))([5], 10)', 'processing 1st argument'],
     *    ['5', 'created real'],
     *    ['((x+y))({5}, [10])', 'processed 1st argument; processing 2nd'],
     *    ['10', 'created real'],
     *    ['((x+y))(5, {10})', 'processed 2nd argument'],
     *    ['((x+y))(5, 10), 'evaluating expression with new scope'],
     *    ['{x:=5, y:=10}', 'established scope']
     *    ['(x+y)', 'evaluating addition'],
     *    ['([x]+y)', 'evaluating left operand'],
     *    ['5', 'substituting'],
     *    ['({5}+[y]), 'evaluated left operand; evaluating right'],
     *    ['10', 'substituting'],
     *    ['(5+{10}), 'evaluated right operand'],
     *    ['(5+10)', 'real addition'],
     *    ['15', 'created real']
     * ]
     * 
     * Implication: the last couple of operations in the result log would
     * likely suffice to define continuity and remove redundancy.
     */
    it('applies its arguments to unbound variables', () => {
      // const expression = add(variable('x'), variable('y'))
      expectWriterTreeNode(
        invoke()(add(variable('x'), variable('y')))(real(5), real(10)),
        real(15)
      )(
        ...invokeOps(
          'addition invocation',
          addOps(
            'created addition',
            variableOps('x'),
            variableOps('y'),
            []
          )
        )(
          realOps('5'),
          realOps('10')
        )(
          {x: '5', y: '10'}
        )(
          evaluateOps(
            '(x+y)',
            addOps(
              'real addition',
              substituteOps(
                'x',
                realOps('5')
              ),
              substituteOps(
                'y',
                realOps('10')
              ),
              realOps('15')
            )
          )
        )
      )
      // expect(invoke()(expression)(real(5), real(10)).value).toEqual(real(15).value)
    })

    it('applies its arguments in appearance order', () => {
      expectWriterTreeNode(
        invoke()(add(variable('x'), variable('y')))(real(5)),
        add(variable('y'), real(5))
      )(
        ...invokeOps(
          'addition invocation',
          addOps(
            'created addition',
            variableOps('x'),
            variableOps('y'),
            []
          )
        )(
          realOps('5')
        )(
          {x: '5'}
        )(
          evaluateOps(
            '(x+y)',
            addOps(
              'reorder operands',
              substituteOps(
                'x',
                realOps('5')
              ),
              noSubstituteOps('y'),
              addOps(
                'created addition',
                variableOps('y'),
                realOps('5'),
                []
              )
            )
          )
        )
      )
      // const expression = add(variable('x'), variable('y'))
      // expect(
      //   invoke()(expression)(real(5)).value
      // ).toEqual(add(variable('y'), real(5)).value)
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
