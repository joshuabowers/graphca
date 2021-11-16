import { Unicode } from './MathSymbols'
import {
  real, complex, variable,
  raise, negate, factorial,
  operators, additive, multiplicative, functions,
  Addition, Exponentiation, Subtraction, Factorial
} from './Tree'
import { Tree } from "./Tree"
import { peg, $fail, $children } from 'pegase'

const capture = (s: string) => `"${s}"`
const additiveOperators = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeOperators = peg([...multiplicative.keys()].map(capture).join('|'))
const exponentiationOperator = peg(Exponentiation.operators.map(capture).join('|'))
const additionOperators = peg(Addition.operators.map(capture).join('|'))
const subtractionOperators = peg(Subtraction.operators.map(capture).join('|'))
const functional = peg([...functions.keys()].map(capture).join('|'))
const factorialOPerator = peg(capture(Factorial.function))

type Tail = {
  op: string,
  a: Tree,
  b?: Tail
}

const leftAssociate = (node: Tree, tail: Tail | undefined): Tree | undefined => {
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

const builtInFunction = (name: string, expression: Tree): Tree | undefined => {
  const f = functions.get(name)
  if(!f){ 
    $fail(`could not locate built-in function '${name}'`)
    return undefined
  }
  return f(expression)
}

export const treeParser = peg<Tree>`
expression: addition

addition: leftAssociative(multiplication, ${additiveOperators})

multiplication: leftAssociative(exponentiation, ${multiplicativeOperators})

leftAssociative(itemType, operators): (
  head: <a>itemType <b>tail ${({a, b}) => leftAssociate(a, b)}
  tail:
  | <op>operators <a>itemType <b>tail ${(tail) => tail}
  | ε
)

exponentiation:
| <a>group ${exponentiationOperator} <b>exponentiation ${({a, b}) => raise(a, b)}
| factorial
| group

factorial: <a>group <...b>(${factorialOPerator}+) ${
  ({a, b}) => b.reduce((e: any) => factorial(e), a)
}

group:
| negationOperator !complex <>group ${({group}) => negate(group)}
| functional
| '(' expression ')'
| primitive

negationOperator: ${subtractionOperators}

functional:
| <name>builtInFunction '(' ^ <>expression ')' ${
  ({name, expression}) => builtInFunction(name, expression)
}

builtInFunction: ${functional}

primitive:
| variable
| constant

constant:
| complex
| real

variable:
| <name>$variable ${({name}) => variable(name)}

complex:
| <n>${subtractionOperators}? <a>real ${additionOperators} <b>real? $i ${({n, a, b}) => {
  return complex((n ? -1 : 1) * a.value, b?.value ?? 1)
}}
| <n>${subtractionOperators}? <a>real ${subtractionOperators} <b>real? $i ${({n, a, b}) => complex((n ? -1 : 1) * a.value, -(b?.value ?? 1))}
| <n>${subtractionOperators}? <b>real? $i ${({n, b}) => complex(0, (n ? -1 : 1) * (b?.value ?? 1))}

real:
| <value>$real ${({value}) => real(value)}
| $e ${() => real(Math.E)}
| $pi ${() => real(Math.PI)}
| $infinity ${() => real(Infinity)}

keywords: builtInFunction

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
$i @raw: ${RegExp(Unicode.i, 'u')}
$e @raw: ${RegExp(Unicode.e, 'u')}
$pi @raw: ${RegExp(Unicode.pi, 'u')}
$infinity @raw: ${RegExp(Unicode.infinity, 'u')}
`
