import { Unicode } from './MathSymbols'
import {
  Base,
  real, complex, variable, assign,
  raise, negate, factorial, polygamma, digamma,
  differentiate, invoke,
  operators, additive, multiplicative, functions, permute, combine
} from './Tree'
import { peg, $fail, $context } from 'pegase'
import { EulerMascheroni } from './Tree/real'
export { scope } from './Tree/scope'
export type { Scope } from './Tree/scope'

const capture = (s: string) => `"${s}"`
const additiveOperators = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeOperators = peg([...multiplicative.keys()].map(capture).join('|'))
const exponentiationOperator = peg(['^'].map(capture).join('|'))
const additionOperators = peg(['+'].map(capture).join('|'))
const subtractionOperators = peg([Unicode.minus, '-'].map(capture).join('|'))
const functional = peg([...functions.keys()].map(capture).join('|'))
const factorialOPerator = peg(capture('!'))
const assignmentOperators = peg(['<-'].map(capture).join('|'))

type Tail = {
  op: string,
  a: Base,
  b?: Tail
}

const leftAssociate = (node: Base, tail: Tail | undefined): Base | undefined => {
  if(!tail){ return node; }
  const operator = operators.get(tail.op)
  if(!operator){ 
    $fail( `Unknown operator '${tail.op}' in expression` )
    return undefined
  }
  return leftAssociate(
    operator(node, tail.a),
    tail.b
  )
}

type InvokeList = {
  a: Base[],
  b?: InvokeList
}

const createInvoke = (node: Base, tail: InvokeList | undefined): Base | undefined => {
  if(!tail){ return node }
  return createInvoke(invoke($context())(node)(...tail.a), tail.b)
}

const builtInFunction = (name: string, expression: Base): Base | undefined => {
  const f = functions.get(name)
  if(!f){ 
    $fail(`could not locate built-in function '${name}'`)
    return undefined
  }
  return f(expression)
}

export const parser = peg<Base>`
expression: assignment

assignment:
| <a>$variable ${assignmentOperators} <b>expression ${({a, b}) => assign(a, b, $context()).value}
| addition

addition: leftAssociative(multiplication, ${additiveOperators})

multiplication: leftAssociative(exponentiation, ${multiplicativeOperators})

leftAssociative(itemType, operators): (
  head: <a>itemType <b>tail ${({a, b}) => leftAssociate(a, b)}
  tail:
  | <op>operators <a>itemType <b>tail ${(tail) => tail}
  | ε
)

exponentiation:
| <a>invocation ${exponentiationOperator} <b>exponentiation ${({a, b}) => raise(a, b)}
| factorial
| invocation

factorial: <a>invocation <...b>(${factorialOPerator}+) ${
  ({a, b}) => b.reduce((e: any) => factorial(e), a)
}

invocation: (
  head: <a>group <b>tail ${({a, b}) => createInvoke(a, b)}
  tail:
  | '(' <...a>parameters ')' <b>tail ${(tail) => tail}
  | ε
  parameters: expression % ','
)

group:
| negationOperator !complex <>group ${({group}) => negate(group)}
| functional
| derivative
| '(' expression ')'
| primitive

negationOperator: ${subtractionOperators}

functional:
| <name>builtInFunction '(' ^ <>expression ')' ${
  ({name, expression}) => builtInFunction(name, expression)
}
| ${Unicode.digamma} '(' <order>expression ',' ^ <>expression ')' ${
  ({order, expression}) => polygamma(order, expression)
}
| ${Unicode.digamma} '(' ^ <>expression ')' ${({expression}) => digamma(expression)}
| 'P' '(' <n>expression ',' <r>expression ')' ${({n, r}) => permute(n, r)}
| 'C' '(' <n>expression ',' <r>expression ')' ${({n, r}) => combine(n, r)}

builtInFunction: ${functional}

derivative:
| ${Unicode.derivative} '(' <order>real ',' ^ <>expression ')' ${
  ({order, expression}) => differentiate(order, expression)
}
| ${Unicode.derivative} '(' <>expression ')' ${
  ({expression}) => differentiate(expression)
}

primitive:
| variable
| constant

constant:
| complex
| real

variable:
| <name>$variable ${({name}) => $context()?.get(name)?.value ?? variable(name)}

complex:
| <n>${subtractionOperators}? <a>real ${additionOperators} <b>real? $i ${({n, a, b}) => {
  return complex((n ? -1 : 1) * a.value, b?.value ?? 1)
}}
| <n>${subtractionOperators}? <a>real ${subtractionOperators} <b>real? $i ${({n, a, b}) => complex((n ? -1 : 1) * a.value, -(b?.value ?? 1))}
| <n>${subtractionOperators}? <b>real? $i ${({n, b}) => complex(0, (n ? -1 : 1) * (b?.value ?? 1))}

real:
| <value>$real ${({value}) => real(value)}
| $e ${() => real(Math.E)}
| $euler ${() => EulerMascheroni}
| $pi ${() => real(Math.PI)}
| $infinity ${() => real(Infinity)}

keywords: builtInFunction

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
$i @raw: ${RegExp(Unicode.i, 'u')}
$e @raw: ${RegExp(Unicode.e, 'u')}
$euler @raw: ${RegExp(Unicode.euler, 'u')}
$pi @raw: ${RegExp(Unicode.pi, 'u')}
$infinity @raw: ${RegExp(Unicode.infinity, 'u')}
`
