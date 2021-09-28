import moo from 'moo';

export const lexer = moo.compile({
  ws: /[ \t]+/,
  identifier: {
    match: /[a-zA-Z][a-zA-Z0-9]*/,
    type: moo.keywords(
      Object.fromEntries([
        'sin', 'cos', 'tan',
        'lg', 'ln', 'log'
      ].map(k => ['kw-' + k, k]))
    )
  },
  number: {
    match: /(?:0|[1-9][0-9]*)(?:\.[0-9]*)?/,
    value: (s) => parseFloat(s)
  },
  lparen: '(',
  rparen: ')',
  lbracket: '[',
  rbracket: ']',
  lbrace: '{',
  rbrace: '}',
  plus: '+',
  minus: '-',
  divide: '/',
  multiply: '*'
})