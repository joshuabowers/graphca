import { Unicode } from '../MathSymbols'
import { Complex } from '../fields/Complex'
import { Real } from '../fields/Real'
import { parser } from '../parser'
import { evaluateVisitor } from './evaluateVisitor'
import { limitVisitor } from './limitVisitor'
import { Scope } from '../Scope'
import { Node, Location } from 'pegase'

const apply = (input: string, scope: Scope) => parser.value(
  input, {visit: [evaluateVisitor, limitVisitor], context: scope}
)

type Asymptote = {[x: string]: number | Real | Complex}

const location: Location = {index: 0, line: 0, column: 0}

const node = (label: string, fields: Record<string, any>): Node => {
  return {$label: label, $from: location, $to: location, ...fields}
}

const expectObject = (input: string, asymptotes: Asymptote, expected: object) => {
  let output = undefined
  const scope = new Scope()
  // for(const identifier in asymptotes){
  //   const value = asymptotes[identifier]
  //   scope.set(
  //     identifier, typeof(value) === 'number' 
  //     ? node('REAL', {value: new Real(value)}) 
  //     : node(value.fieldName, {value})
  //   )
  // }
  expect(() => {output = apply(input, scope)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe('limitVisitor', () => {
  describe('of constants', () => {
    it('is the value of a real', () => {
      expectObject('12.34', {'x': 12.34}, {$label: 'REAL', value: new Real(12.34)})
    })

    it('is the modulus of a complex', () => {
      expectObject(`2 + 3${Unicode.i}`, {'x': new Complex(2,3)}, {
        $label: 'REAL', value: new Real(new Complex(2,3).modulus())
      })
    })
  })

  describe('of variables', () => {
    it('is the value of a real as the variable approaches the real', () => {
      expectObject('x', {'x': 5}, {$label: 'REAL', value: new Real(5)})
    })
  })
})