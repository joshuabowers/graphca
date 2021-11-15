import { Unicode } from './MathSymbols'
import {
  real, complex, variable,
  add, subtract, multiply, divide, raise, negate,
  operators, additive, multiplicative, functions,
  Tree, Node, Real, Addition, Multiplication, Kind, Exponentiation, Subtraction, Sine
} from './Tree'
import { peg, $fail } from 'pegase'
import { match, instanceOf } from 'ts-pattern'

const capture = (s: string) => `"${s}"`
const additiveOperators = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeOperators = peg([...multiplicative.keys()].map(capture).join('|'))
const exponentiationOperator = peg(Exponentiation.operators.map(capture).join('|'))
const subtractionOperators = peg(Subtraction.operators.map(capture).join('|'))
const functional = peg([...functions.keys()].map(capture).join('|'))

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
| group

group:
| ${subtractionOperators} <>group ${({group}) => negate(group)}
| functional
| '(' expression ')'
| primitive

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
| <a>real '+' <b>real? $i ${({a, b}) => complex(a.value, b.value ?? 1)}
| <b>real? $i ${({b}) => complex(0, b.value ?? 1)}

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

const a = real(5)
const b = real(7)
const c = multiply(a, add(a, b))

const d = operators.get('+')?.(a, b)

const foo = match<Tree, Node>(c)
  .with({$kind: Kind.Real}, (v) => v as Real)
  .with({$kind: Kind.Addition}, (v) => v as Addition)
  .with({$kind: Kind.Multiplication, a: {$kind: Kind.Addition}}, (v) => v as Multiplication)
  .with({$kind: Kind.Sine}, (v) => v as Sine)

const bar = match<[Tree, Tree], Node>([b, c])
  .with([{$kind: Kind.Real}, {$kind: Kind.Real}], ([a, b]) => add(a, b))
  .with([{$kind: Kind.Addition}, {$kind: Kind.Multiplication}], ([a, b]) => multiply(a, b))
  .with([instanceOf(Addition), instanceOf(Multiplication)], ([a, b]) => multiply(a, b))

const baz = match<Tree, Node>(c)
  .with(instanceOf(Real), (v) => v)
  .with(instanceOf(Addition), (v) => v)
  .with({$kind: Kind.Multiplication, a: instanceOf(Multiplication), b: instanceOf(Real)},
    (v) => v.a
  )
  .with(instanceOf(Sine), (v) => v)

const qux = match<{v: Tree}, Node>({v: c})
  .with({v: instanceOf(Real)}, ({v}) => v)
  .with({v: instanceOf(Addition)}, ({v}) => v)
  .when(({v}) => v instanceof Multiplication && v.a instanceof Addition, ({v}) => v)