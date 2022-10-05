import { multi, method } from '@arrows/multimethod'
import { Writer } from '../monads/writer'
import { real, isReal, Real } from '../primitives'
import { variable, isVariable, Variable } from '../variable'
import { add, Addition, isAddition } from '../arithmetic'
import { rule } from './rule'
import { Unicode } from '../Unicode'
// import { stringify } from './stringify' 

const stringify = multi(
  method(isReal, (r: Writer<Real>) => r.value.value.toString()),
  method(isVariable, (v: Writer<Variable>) => v.value.name),
  method(isAddition, (a: Writer<Addition>) => `[${stringify(a.value.left)} + ${stringify(a.value.right)}]`)
)

describe('rule', () => {
  it('renders reals', () => {
    expect(rule`${real(5)}`(stringify)).toEqual('5')
  })

  it('renders unbound variables', () => {
    expect(rule`${variable('x')}`(stringify)).toEqual('x')
  })

  it('renders an addition', () => {
    expect(rule`${add(variable('x'), real(5))}`(stringify)).toEqual('[x + 5]')
  })

  it('renders a sentence', () => {
    expect(rule`${real(5)} + ${variable('x')}`(stringify)).toEqual('5 + x')
  })

  it('renders a complex sentence', () => {
    expect(rule`${add(variable('x'), real(5))} - ${variable('y')}`(stringify)).toEqual('[x + 5] - y')
  })

  it('passes strings through to the final output', () => {
    expect(rule`${Unicode.derivative}(${variable('x')})`(stringify)).toEqual(`${Unicode.derivative}(x)`)
  })
})
