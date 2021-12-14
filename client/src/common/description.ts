import { method, multi, Multi } from '@arrows/multimethod'
import { is, Constructor } from './Tree/is'
import { 
  Base, Real, Complex, Variable, Binary, Unary
} from './Tree'

export type Description = {
  variables: Set<string>,
  isGraphable: boolean
}

type About<T extends Base> = (expression: T) => Description

const visit = <T extends Base>(type: Constructor<T>) =>
  (fn: About<T>) =>
    method(is(type), fn)

export type DescribeFn = Multi
  & About<Real>
  & About<Complex>
  & About<Binary>
  & About<Unary>
  & About<Base>

export const about = 
  (isGraphable: boolean, variables = new Set<string>()): Description =>
    ({variables, isGraphable})

const union = <T>(a: Set<T>, b: Set<T>) => {
  const r = new Set<T>(a)
  for(let i of b) {
    r.add(i)
  }
  return r
}

export const describe: DescribeFn = multi(
  visit(Real)(_ => about(true)),
  visit(Complex)(_ => about(false)),
  visit(Variable)(e => about(true, new Set<string>(e.name))),
  visit(Binary)(e => {
    const l = describe(e.left), r = describe(e.right)
    return about(l.isGraphable && r.isGraphable, union(l.variables, r.variables))
  }),
  visit(Unary)(e => {
    const s = describe(e.expression)
    return about(s.isGraphable, s.variables)
  })
)
