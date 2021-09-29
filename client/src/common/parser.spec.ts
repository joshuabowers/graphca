import { parse } from "./parser";

describe(parse, () => {
  it('does not throw an exception on valid input', () => {
    expect(() => parse('1 + 2')).not.toThrow();
  })
  it('sets no error on valid input', () => {
    const input = '1 + 2';
    expect(parse(input).error).toBe(undefined)
  })
})