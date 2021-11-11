import peg, { $node, Node } from 'pegase';
import { Scope } from './Scope';
import { Unicode } from './MathSymbols';

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

// For future reference, used for constructing a left-associative
// tree structure from a expression list built right recursively.
const leftAssociate = (term: any, expressionPrime: any): any => {
  if(!expressionPrime){ return term; }
  return leftAssociate( 
    $node(
      operators.get(expressionPrime.op) ?? 'ERROR',
      {a: term, b: expressionPrime.a}
    ), expressionPrime.b
  )
}

export const parser = peg<Node, Scope>`
start: statement | expression

statement: assignment

assignment: <identifier>$variable '<-' <>expression => 'ASSIGN'

expression: arithmetic

arithmetic: <a>product <b>arithmeticPrime ${({a,b}) => leftAssociate(a,b)}

arithmeticPrime:
| <op>("+" | "-" | $subtract) <a>product <b>arithmeticPrime ${(args) => args}
| ''

product: <a>exponent <b>productPrime ${({a,b}) => leftAssociate(a,b)}

productPrime:
| <op>("*" | $multiply | "/" | $divide) <a>exponent <b>productPrime ${(args) => args}
| ''

exponent:
| <a>negation '^' ^ <b>exponent => 'RAISE'
| <expression>negation '!' => 'FACTORIAL'
| negation

negation:
| ('-' | $subtract) ^ <expression>grouping => 'NEGATE'
| grouping

grouping:
| <f>callable '(' ^ <>expression ')' ${
  ({f, expression}) => $node(callableNodes.get(f) ?? 'ERROR', {expression})
}
| $differentiate '(' <>expression ')' => 'DIFFERENTIATE'
| <identifier>$variable '(' ^ <...>argumentList ')' => 'INVOKE'
| '(' ^ expression ')'
| factor

argumentList: expression % ','

factor:
| <value>($number?) $i @node('I', ${({value}) => ({value: value || 1})})
| <value>$number => 'NUMBER'
| $e => 'E'
| $pi => 'PI'
| $epsilon => 'EPSILON'
| $infinity => 'INFINITY'
| <name>$variable => 'VARIABLE'

keywords: callable ![a-zA-Z]

callable: ${functional}

$number @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
$i @raw: ${RegExp(Unicode.i, 'u')}
$e @raw: ${RegExp(Unicode.e, 'u')}
$pi @raw: ${RegExp(Unicode.pi, 'u')}
$epsilon @raw: ${RegExp(Unicode.epsilon, 'u')}
$infinity @raw: ${RegExp(Unicode.infinity, 'u')}
$subtract @raw: ${RegExp(Unicode.minus, 'u')}
$multiply @raw: ${RegExp(Unicode.multiplication, 'u')}
$divide @raw: ${RegExp(Unicode.division, 'u')}
$differentiate @raw: ${RegExp(Unicode.derivative, 'u')}
`