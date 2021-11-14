import {
  real, complex,
  add, subtract, multiply, divide, raise,
  operators, additive, multiplicative, 
  Tree, Node, Real, Addition, Multiplication, Kind
} from './Tree'
import { peg } from 'pegase'
import { match, instanceOf } from 'ts-pattern'

const capture = (s: string) => `"${s}"`
const additiveParser = peg([...additive.keys()].map(capture).join('|'))
const multiplicativeParser = peg([...multiplicative.keys()].map(capture).join('|'))

export const treeParser = peg<Tree>`
addition:
| <a>multiplication <b>additionPrime

additionPrime:
| <op>additiveOperator <a>multiplication <b>additionPrime
| ε

additiveOperator: ${additiveParser}

multiplication:
| <a>exponentiation <b>multiplicationPrime

multiplicationPrime:
| <op>multiplicativeOperator <a>exponentiation <b>multiplicationPrime
| ε

multiplicativeOperator: ${multiplicativeParser}
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