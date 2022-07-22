import { Unicode } from './MathSymbols'
import {
  Base,
  real, complex, bool, not, nil, variable, assign,
  raise, negate, factorial, polygamma, digamma, log,
  differentiate, invoke,
  operators, inequality, additive, multiplicative, functions, permute, combine
} from './Tree'
import { peg, $fail, $context } from 'pegase'
import { EulerMascheroni } from './Tree/real'
export { scope } from './Tree/scope'
export type { Scope } from './Tree/scope'

const capture = (s: string) => `"${s}"`
const inequalityOperators = peg([...inequality.keys()].map(capture).join('|'))
const additiveOperators = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeOperators = peg([...multiplicative.keys()].map(capture).join('|'))
const exponentiationOperator = peg(['^'].map(capture).join('|'))
const additionOperators = peg(['+'].map(capture).join('|'))
const subtractionOperators = peg([Unicode.minus, '-'].map(capture).join('|'))
const functional = peg([...functions.keys()].map(capture).join('|'))
const factorialOPerator = peg(capture('!'))
const assignmentOperators = peg(['<-'].map(capture).join('|'))

const letterRange = `_a-zA-Z${Unicode.theta}`
const validIdentifier = new RegExp(`[${letterRange}][${letterRange}0-9]*`, 'u')

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

const unbox = (value: Base | undefined) => value?.$kind !== 'Nil' ? value : undefined

// NOTE on Factorial: '!' is used in both factorial and not equals (!=);
// this can confuse peg (think 5! == x, 5 != x); so factorial deliberately
// fails if it encounters a '=' afterward. Might need to revisit once
// equals is integrated.

export const parser = peg<Base>`
expression: <a>assignment ${({a}) => assign('Ans', a, $context()).value}

assignment:
| <a>$variable ${assignmentOperators} <b>expression ${({a, b}) => assign(a, b, $context()).value}
| inequality

inequality:
| leftAssociative(addition, ${inequalityOperators})

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

factorial: <a>invocation <...b>(${factorialOPerator}+) &('=='|'!='|!('='{1})) ${
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
| $logicalComplement <>group ${({group}) => not(group)}
| functional
| derivative
| '(' expression ')'
| '[' expression ']'
| '{' expression '}'
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
| 'log' '(' <b>expression ',' <v>expression ')' ${({b, v}) => log(b, v)}

builtInFunction: ${functional}

derivative:
| ${Unicode.derivative} '(' <order>real ',' ^ <>expression ')' ${
  ({order, expression}) => differentiate(order, expression)
}
| ${Unicode.derivative} '(' <>expression ')' ${
  ({expression}) => differentiate(expression)
}

primitive:
| $nil ${() => nil()}
| variable
| constant

constant:
| complex
| real
| boolean

variable:
| <name>$variable ${({name}) => unbox($context()?.get(name)?.value) ?? variable(name)}

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

boolean:
| $true ${() => bool(true)}
| $false ${() => bool(false)}

keywords: 
| builtInFunction
| $nil
| $true
| $false

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) ${validIdentifier}
$i @raw: ${RegExp(Unicode.i, 'u')}
$e @raw: ${RegExp(Unicode.e, 'u')}
$euler @raw: ${RegExp(Unicode.euler, 'u')}
$pi @raw: ${RegExp(Unicode.pi, 'u')}
$infinity @raw: ${RegExp(Unicode.infinity, 'u')}
$nil @raw: /nil/
$true @raw: /true/
$false @raw: /false/
$logicalComplement @raw: ${RegExp(Unicode.not, 'u')}
`
