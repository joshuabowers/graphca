import { differentiationVisitor } from "./differentiationVisitor";
import { evaluateVisitor } from "./evaluateVisitor";
import { parser } from "../parser";
import { Scope } from "../Scope";
import { Node, Location } from 'pegase'
import { Real } from '../fields/Real'
import { Unicode } from "../MathSymbols";

const apply = (input: string, scope: Scope) => parser.value(
  input, {visit: [evaluateVisitor, differentiationVisitor], context: scope}
)

const expectObject = (input: string, expected: object) => {
  let output = undefined
  const scope = new Scope()
  expect(() => {output = apply(input, scope)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

const real = (val: string) => ({'$label': 'REAL', 'value': new Real(val)})

describe('differentiationVisitor', () => {
  describe('of constants', () => {
    it('returns 0 for any constant', () => {
      expectObject('5', real('0'))
      expectObject(Unicode.infinity, real('0'))
    })
  })
})