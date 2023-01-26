import { isWriter } from './monads/writer';
import { real } from './primitives'
import { Variable, assign, scope } from "./variable";

describe(assign, () => {
  it('returns a new variable with the supplied value', () => {
    const actual = assign('x', real(5), scope())
    expect(isWriter<Variable>(actual)).toBeTruthy()
    expect(actual.value.name).toEqual('x')
    expect(actual.value.value.value).toEqual(real(5).value)
  })

  it('has, as a side effect, the updating of the supplied scope', () => {
    const s = scope()
    expect(s.get('x')).toBeUndefined()
    const v = assign('x', real(5), s)
    expect(s.get('x')).toEqual(v)
  })
})
