import { Unicode } from './MathSymbols'
import {
  real, complex,
  add, subtract, multiply, divide, raise,
  operators, additive, multiplicative, 
  Tree, Node, Real, Addition, Multiplication, Kind
} from './Tree'
import { peg, $fail } from 'pegase'
import { match, instanceOf } from 'ts-pattern'

const capture = (s: string) => `"${s}"`
const additiveParser = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeParser = peg([...multiplicative.keys()].map(capture).join('|'))

type Tail = {
  op: string,
  a: Tree,
  b?: Tail
}

const leftAssociate = (node: Tree, tail: Tail | undefined): Tree | undefined => {
  if(!tail){ return node; }
  const operator = operators.get(tail.op)
  if(!operator){ 
    $fail( `Unknown operator ${tail.op} in expression` )
    return undefined
  }
  return leftAssociate(
    operator(node, tail.a),
    tail.b
  )
}

export const treeParser = peg<Tree>`
addition: leftAssociative(multiplication, ${additiveParser})

multiplication: leftAssociative(exponentiation, ${multiplicativeParser})

leftAssociative(itemType, operators): (
  head: <a>itemType <b>tail ${({a, b}) => leftAssociate(a, b)}
  tail:
  | <op>operators <a>itemType <b>tail ${(tail) => tail}
  | ε
)

exponentiation:
| group

group:
| literal

literal:
| <a>$real '+' <b>$real? $i ${({a, b}) => complex(a, b ?? 1)}
| <b>$real? $i ${({b}) => complex(0, b ?? 1)}
| <value>$real ${({value}) => real(value)}
| $e ${() => real(Math.E)}

$real @raw: /(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
$i @raw: ${RegExp(Unicode.i, 'u')}
$e @raw: ${RegExp(Unicode.e, 'u')}
`

const a = real(5)
const b = real(7)
const c = multiply(a, add(a, b))

const d = operators.get('+')?.(a, b)

const foo = match<Tree, Node>(c)
  .with({$kind: Kind.Real}, (v) => v as Real)
  .with({$kind: Kind.Addition}, (v) => v as Addition)
  .with({$kind: Kind.Multiplication, a: {$kind: Kind.Addition}}, (v) => v as Multiplication)

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

const qux = match<{v: Tree}, Node>({v: c})
  .with({v: instanceOf(Real)}, ({v}) => v)
  .with({v: instanceOf(Addition)}, ({v}) => v)
  .when(({v}) => v instanceof Multiplication && v.a instanceof Addition, ({v}) => v)