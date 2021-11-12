import { $children, $node, peg } from 'pegase'
import { Unicode } from './MathSymbols'
import { Real } from './fields/Real'

import { 
  real, complex, negate, raise, lb, ln, lg, multiply
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

const functions = [
  'asinh', 'acosh', 'atanh',
  'asin', 'acos', 'atan', 
  'sinh', 'cosh', 'tanh',
  'sin', 'cos', 'tan', 
  'lb', 'ln', 'lg',
  Unicode.gamma, Unicode.digamma, 'abs'
]
const renameFunctions: Map<string, string> = new Map([
  [Unicode.gamma, 'GAMMA'],
  [Unicode.digamma, 'DIGAMMA']
])
const callableNodes = new Map(
  functions.map(f => [f, renameFunctions.get(f) ?? f.toLocaleUpperCase()])
)

const functional = peg(functions.map(s => `"${s}"`).join(" | "))


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
expression: addition

addition:
| <a>multiplication ('+' | '-' | $subtract) '0' ${({a}) => a}
| '0' '+' <a>multiplication <b>additionPrime ${({a, b}) => leftAssociate(a, b)}
| '0' ('-' | $subtract) <a>multiplication <b>additionPrime ${({a, b}) => leftAssociate(negate(a), b)}
| <a>multiplication '+' >a< ${(args) => { console.log(args); return multiply(real(2), args)}}
| <a>multiplication <b>additionPrime ${({a, b}) => leftAssociate(a, b)}

additionPrime:
| ('+' | '-' | $subtract) '0' <b>additionPrime ${({b}) => b}
| <op>("+" | "-" | $subtract) <a>multiplication <b>additionPrime ${(args) => args}
| ε

multiplication:
| exponential ('*' | $multiply) '0' ${() => real(0)}
| <a>exponential ('*' | $multiply) '1' ${({a}) => a}
| '0' ('*' | $multiply) exponential multiplicationPrime ${() => real(0)}
| '1' ('*' | $multiply) <a>exponential <b>multiplicationPrime ${({a, b}) => leftAssociate(a, b)}
| exponential ('/' | $divide) '0' ${() => real(Infinity)}
| '0' ('/' | $divide) exponential multiplicationPrime ${() => real(0)}
| <a>exponential ('/' | $divide) '1' ${({a}) => a}
| <a>exponential <b>multiplicationPrime ${
  ({a, b}) => b === 'ZERO' 
    ? real(0) 
    : b === 'INFINITY' 
      ? real(Infinity) 
      : leftAssociate(a, b)
}

multiplicationPrime:
| ('*' | $multiply) '0' multiplicationPrime ${() => 'ZERO'}
| ('*' | $multiply) '1' <b>multiplicationPrime ${({b}) => b}
| ('/' | $divide) '0' multiplicationPrime ${() => 'INFINITY'}
| ('/' | $divide) '1' <b>multiplicationPrime ${({b}) => b}
| <op>("*" | "/" | $multiply | $divide) <a>exponential <b>multiplicationPrime ${
  (args) => typeof args.b === 'string' ? args.b : args
}
| ε

exponential:
| grouping '^' '0' ${() => real(1)}
| <a>grouping '^' '1' ${({a}) => a}
| <a>("0" | "1") '^' exponential ${({a}) => real(a)}
| '2' '^' 'lb' '(' ^ <b>exponential ')' ${({b}) => b}
| $e '^' 'ln' '(' ^ <b>exponential ')' ${({b}) => b}
| '10' '^' 'lg' '(' ^ <b>exponential ')' ${({b}) => b}
| <a>grouping '^' <b>exponential ${
  ({a, b}) => b.value && b.value.value ? (
    b.value.value === 0 && real(1)
    || b.value.value === 1 && a
    || raise(a, b)
  ) : raise(a, b)
}
| grouping

grouping:
| logarithm
| <f>callable '(' ^ <>expression ')' ${
  ({f, expression}) => $node(callableNodes.get(f) ?? 'ERROR', {expression})
}
| '(' ^ expression ')'
| literal

logarithm:
| 'lb' '(' '2' '^' ^ <>expression ')' ${({expression}) => expression}
| 'ln' '(' $e '^' ^ <>expression ')' ${({expression}) => expression}
| 'lg' '(' '10' '^' ^ <>expression ')' ${({expression}) => expression}

keywords: callable ![a-zA-Z]

callable: ${functional}

literal:
| <a>$real '+' <b>$real? $i ${({a, b}) => complex(a, b ?? 1)}
| <b>$real? $i ${({b}) => complex(0, b ?? 1)}
| <value>$real ${({value}) => real(value)}
| $e ${() => real(Math.E)}
| <name>$variable => 'VARIABLE'

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
$i @raw: ${RegExp(Unicode.i, 'u')}
$e @raw: ${RegExp(Unicode.e, 'u')}

$subtract @raw: ${RegExp(Unicode.minus, 'u')}
$multiply @raw: ${RegExp(Unicode.multiplication, 'u')}
$divide @raw: ${RegExp(Unicode.division, 'u')}
`