import { Unicode } from './Unicode'
import { Writer } from './monads/writer'
import { TreeNode } from './utility/tree'
import { real, complex, boolean, nil, isNil } from './primitives'
import { variable, assign, Scope } from './variable'
import { 
  raise, negate, additive, multiplicative, AdditiveFn, MultiplicativeFn
} from './arithmetic'
import { log } from './functions/logarithmic'
import { factorial } from './functions/factorial'
import { polygamma, digamma } from './functions/polygamma'
import { permute, combine } from './functions/combinatorics'
import { 
  not, connectives, inequality, functions, ConnectiveFn, InequalityFn 
} from './functions'
import { differentiate } from './calculus/differentiation'
import { invoke } from './invocation'
import { peg, $fail, $context } from 'pegase'
import { EulerMascheroni } from './primitives/real'
export { scope } from './variable'
export type { Scope } from './variable'

type Operator = ConnectiveFn | InequalityFn | AdditiveFn | MultiplicativeFn

const operators = new Map<string, Operator>()
for(const [op, func] of connectives){
  operators.set(op, func)
}
for(const [op, func] of inequality){
  operators.set(op, func)
}
for(const [op, func] of additive){
  operators.set(op, func)
}
for(const [op, func] of multiplicative){
  operators.set(op, func)
}

const capture = (s: string) => `"${s}"`
const connectiveOperators = peg([...connectives.keys()].map(capture).join('|'))
const inequalityOperators = peg([...inequality.keys()].map(capture).join('|'))
const additiveOperators = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeOperators = peg([...multiplicative.keys()].map(capture).join('|'))
const exponentiationOperator = peg(['^'].map(capture).join('|'))
const additionOperators = peg(['+'].map(capture).join('|'))
const subtractionOperators = peg([Unicode.minus, '-'].map(capture).join('|'))
const functional = peg([...functions.keys()].map(capture).join('|'))
const factorialOPerator = peg(capture('!'))
const assignmentOperators = peg([':='].map(capture).join('|'))

const letterRange = `_a-zA-Z${Unicode.theta}`
const validIdentifier = new RegExp(`[${letterRange}][${letterRange}0-9]*`, 'u')

type Tail = {
  op: string,
  a: Writer<TreeNode>,
  b?: Tail
}

const leftAssociate = (node: Writer<TreeNode>, tail: Tail | undefined): Writer<TreeNode> | undefined => {
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
  a: Writer<TreeNode>[],
  b?: InvokeList
}

const createInvoke = (node: Writer<TreeNode>, tail: InvokeList | undefined): Writer<TreeNode> | undefined => {
  if(!tail){ return node }
  return createInvoke(invoke($context())(node)(...tail.a), tail.b)
}

const builtInFunction = (name: string, expression: Writer<TreeNode>): Writer<TreeNode> | undefined => {
  const f = functions.get(name)
  if(!f){ 
    $fail(`could not locate built-in function '${name}'`)
    return undefined
  }
  return f(expression)
}

const unbox = (value: Writer<TreeNode> | undefined) => value && !isNil(value) ? value : undefined

// NOTE on Factorial: '!' is used in both factorial and not equals (!=);
// this can confuse peg (think 5! == x, 5 != x); so factorial deliberately
// fails if it encounters a '=' afterward. Might need to revisit once
// equals is integrated.

export const parser = peg<Writer<TreeNode>, Scope>`
expression: <a>assignment ${({a}) => assign('Ans', a, $context()).value.value}

assignment:
| <a>$variable ${assignmentOperators} <b>expression ${({a, b}) => assign(a, b, $context()).value.value}
| connectives

connectives: leftAssociative(inequality, ${connectiveOperators})

inequality: leftAssociative(addition, ${inequalityOperators})

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

factorial: <a>invocation <...b>(${factorialOPerator}+) &('=='|!('='{1})) ${
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
| $nil ${() => nil}
| variable
| constant

constant:
| complex
| real
| boolean

variable:
| <name>$variable ${({name}) => unbox($context()?.get(name)?.value.value) ?? variable(name)}

complex:
| <n>${subtractionOperators}? <a>real ${additionOperators} <b>real? $i ${({n, a, b}) => {
  return complex([(n ? -1 : 1) * a.value.value, b?.value.value ?? 1])
}}
| <n>${subtractionOperators}? <a>real ${subtractionOperators} <b>real? $i ${({n, a, b}) => complex([(n ? -1 : 1) * a.value.value, -(b?.value.value ?? 1)])}
| <n>${subtractionOperators}? <b>real? $i ${({n, b}) => complex([0, (n ? -1 : 1) * (b?.value.value ?? 1)])}

real:
| <value>$real ${({value}) => real(Number(value))}
| $e ${() => real(Math.E)}
| $euler ${() => EulerMascheroni}
| $pi ${() => real(Math.PI)}
| $infinity ${() => real(Infinity)}

boolean:
| $true ${() => boolean(true)}
| $false ${() => boolean(false)}

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
