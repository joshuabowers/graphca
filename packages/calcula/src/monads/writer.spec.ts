import { unit } from "./writer";

describe('unit', () => {
  it('returns an object with "value" equal to the passed input', () => {
    expect(unit(5).value).toEqual(5)
  })

  it('returns an object with an empty log', () => {
    expect(unit(5).log).toEqual([])
  })
})
