import peg, { $node } from 'pegase';

const operators = new Map([
  ['+', 'PLUS'],
  ['-', 'MINUS'],
  ['*', 'MULTIPLY'],
  ['/', 'DIVIDE']
])

const functions = ['sin', 'cos', 'tan', 'lg', 'ln', 'log']
const callableNodes = new Map(
  functions.map(f => [f, f.toLocaleUpperCase()])
)

const functional = peg(functions.map(s => `"${s}"`).join(" | "))

// For future reference, used for constructing a left-associative
// tree structure from a expression list built right recursively.
const lNode = (term: any, expressionPrime: any): any => {
  if(!expressionPrime){ return term; }
  return lNode( 
    $node(
      operators.get(expressionPrime.op) ?? 'ERROR',
      {a: term, b: expressionPrime.a}
    ), expressionPrime.b
  )
} 

export const parser = peg`
expression: arithmetic

arithmetic: <a>product <b>arithmeticPrime ${({a,b}) => lNode(a,b)}

arithmeticPrime:
| <op>("+" | "-") <a>product <b>arithmeticPrime ${(args) => args}
| ''

product: <a>exponent <b>productPrime ${({a,b}) => lNode(a,b)}

productPrime:
| <op>("*" | "/") <a>exponent <b>productPrime ${(args) => args}
| ''

exponent:
| <a>negation '^' ^ <b>expression => 'EXPONENT'
| negation

negation:
| '-' ^ <expression>grouping => 'NEGATE'
| grouping

grouping:
| <f>callable '(' ^ <>expression ')' ${
  ({f, expression}) => $node(callableNodes.get(f) ?? 'ERROR', {expression})
}
| '(' ^ expression ')'
| factor

factor:
| <value>number => 'NUMBER'
| <name>variable => 'VARIABLE'

keywords: callable ![a-zA-Z]

callable: ${functional}

$number @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
`