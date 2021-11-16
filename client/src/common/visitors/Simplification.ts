import { match, instanceOf } from 'ts-pattern'
import {
  Tree, Kind,
  Real, Multiplication, Addition, Sine,
  real, multiply, add,
} from './Visitor'

const a = real(5)
const b = real(7)
const c = multiply(a, add(a, b))

// const d = operators.get('+')?.(a, b)

const foo = match<Tree, Tree>(c)
  .with({$kind: Kind.Real}, (v) => v as Real)
  .with({$kind: Kind.Addition}, (v) => v as Addition)
  .with({$kind: Kind.Multiplication, a: {$kind: Kind.Addition}}, (v) => v as Multiplication)
  .with({$kind: Kind.Sine}, (v) => v as Sine)

const bar = match<[Tree, Tree], Tree>([b, c])
  .with([{$kind: Kind.Real}, {$kind: Kind.Real}], ([a, b]) => add(a, b))
  .with([{$kind: Kind.Addition}, {$kind: Kind.Multiplication}], ([a, b]) => multiply(a, b))
  .with([instanceOf(Addition), instanceOf(Multiplication)], ([a, b]) => multiply(a, b))

const baz = match<Tree, Tree>(c)
  .with(instanceOf(Real), (v) => v)
  .with(instanceOf(Addition), (v) => v)
  .with({$kind: Kind.Multiplication, a: instanceOf(Multiplication), b: instanceOf(Real)},
    (v) => v.a
  )
  .with(instanceOf(Sine), (v) => v)

const qux = match<{v: Tree}, Tree>({v: c})
  .with({v: instanceOf(Real)}, ({v}) => v)
  .with({v: instanceOf(Addition)}, ({v}) => v)
  .when(({v}) => v instanceof Multiplication && v.a instanceof Addition, ({v}) => v)