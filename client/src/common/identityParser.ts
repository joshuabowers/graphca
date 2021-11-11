import { $node, peg } from 'pegase'
import { Unicode } from './MathSymbols'

import { 
  real, complex, negate
} from './visitors/helpers/Node'

const operators = new Map([
  ['+', 'ADD'],
  ['-', 'SUBTRACT'],
  [Unicode.minus, 'SUBTRACT'],
  ['*', 'MULTIPLY'],
  [Unicode.multiplication, 'MULTIPLY'],
  ['/', 'DIVIDE'],
  [Unicode.division, 'DIVIDE']
])

const leftAssociate = (term: any, expressionPrime: any): any => {
  if(!expressionPrime){ return term; }
  return leftAssociate( 
    $node(
      operators.get(expressionPrime.op) ?? 'ERROR',
      {a: term, b: expressionPrime.a}
    ), expressionPrime.b
  )
}

export const identityParser = peg`
addition:
| <a>literal ('+' | '-' | $subtract) '0' ${({a}) => a}
| '0' '+' <a>literal <b>additionPrime ${({a, b}) => leftAssociate(a, b)}
| '0' ('-' | $subtract) <a>literal <b>additionPrime ${({a, b}) => leftAssociate(negate(a), b)}
| <a>literal <b>additionPrime ${({a, b}) => leftAssociate(a, b)}

additionPrime:
| ('+' | '-' | $subtract) '0' <b>additionPrime ${({b}) => b}
| <op>("+" | "-" | $subtract) <a>literal <b>additionPrime ${(args) => args}
| ε

literal:
| <a>$real '+' <b>$real? $i ${({a, b}) => complex(a, b ?? 1)}
| <b>$real? $i ${({b}) => complex(0, b ?? 1)}
| <value>$real ${({value}) => real(value)}
| <name>$variable => 'VARIABLE'

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: [a-zA-Z][a-zA-Z0-9]*
$i @raw: ${RegExp(Unicode.i, 'u')}

$subtract @raw: ${RegExp(Unicode.minus, 'u')}
`