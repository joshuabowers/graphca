import { real } from '../primitives'
import { variable } from '../variable'
import { add } from '../arithmetic'
import { rule } from './rule'
import { Unicode } from '../Unicode'

describe('rule', () => {
  it('renders reals', () => {
    expect(rule`${real(5)}`()).toEqual('5')
  })

  it('renders unbound variables', () => {
    expect(rule`${variable('x')}`()).toEqual('x')
  })

  it('renders an addition', () => {
    expect(rule`${add(variable('x'), real(5))}`()).toEqual('(x+5)')
  })

  it('renders a sentence', () => {
    expect(rule`${real(5)} + ${variable('x')}`()).toEqual('5 + x')
  })

  it('renders a complex sentence', () => {
    expect(rule`${add(variable('x'), real(5))} - ${variable('y')}`()).toEqual('(x+5) - y')
  })

  it('passes strings through to the final output', () => {
    expect(rule`${Unicode.derivative}(${variable('x')})`()).toEqual(`${Unicode.derivative}(x)`)
  })
})
