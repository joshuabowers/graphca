import { lexer } from './lexer';

describe('lexer', () => {
  it('tokenizes keywords with a kw- prefix', () => {
    const input = 'sin cos tan',
      expected = ['kw-sin', 'ws', 'kw-cos', 'ws', 'kw-tan'];
    lexer.reset(input);
    const tokens = Array.from(lexer).map(t => t.type);
    expect(tokens).toEqual(expected);
  })

  it('tokenizes non-keywords as identifiers', () => {
    const input = 'x Y zed';
    lexer.reset(input);
    const tokens = Array.from(lexer).map(t => t.type);
    expect(tokens).toEqual(['identifier', 'ws', 'identifier', 'ws', 'identifier']);
  })

  it('recognizes numbers', () => {
    const input = '0.25 10 1.5 1.23E5',
      expected = input.split(' ').map(s => ({type: 'number', text: s}));
    lexer.reset(input);
    const tokens = Array.from(lexer).map(({type, text}) => ({type, text})).filter(t => t.type != 'ws');
    expect(tokens).toEqual(expected);
  })

  it('allows identifiers to have numbers', () => {
    const input = 'x1 10',
      expected = [{type: 'identifier', text: 'x1'}, {type: 'number', text: '10'}];
    lexer.reset(input);
    const tokens = Array.from(lexer).filter(
      (t) => (t.type != 'ws')
    ).map(
      ({type, text}) => ({type, text})
    );
    expect(tokens).toEqual(expected);
  })
});