import { scope } from "./scope";
import { real } from './real'
import { assign } from "./variable";

describe(assign, () => {
  it('returns a new variable with the supplied value', () => {
    const actual = assign('x', real(5), scope())
    expect(actual.name).toEqual('x')
    expect(actual.value).toEqual(real(5))
  })

  it('has, as a side effect, the updating of the supplied scope', () => {
    const s = scope()
    expect(s.get('x')).toBeUndefined()
    const v = assign('x', real(5), s)
    expect(s.get('x')).toEqual(v)
  })
})
