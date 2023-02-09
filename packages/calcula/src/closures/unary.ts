import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, writer, curate } from "../monads/writer"
import { 
  Particle, Operation, Action 
} from '../utility/operation'
import { processLogs, LogFunctionalFn } from "../utility/processLogs"
import { 
  TreeNode, Clades, Genera, Species, Notation,
  isClade, isSpecies, isTreeNode, TreeNodeGuardFn,
  eitherNilOrNaN
} from "../utility/tree"
import { 
  Real, Complex, Boolean, Nil, NaN, nan,
  isReal, isComplex, isBoolean
} from "../primitives"
import { CastFn } from "../utility/typings"

export type UnaryNode = TreeNode & {
  readonly clade: Clades.unary,
  readonly expression: Writer<TreeNode, Operation>
}

export type Unary<S extends Species, G extends Genera|undefined = undefined> = 
  UnaryNode & {
    readonly genus: G,
    readonly species: S
  }

export const isUnary = isClade<UnaryNode>(Clades.unary)

type Choose<D, F> = F extends void ? D : F

export type UnaryFn<T, R = void> = Multi
  & CastFn<Writer<Real, Operation>, Choose<Real, R>>
  & CastFn<Writer<Complex, Operation>, Choose<Complex, R>>
  & CastFn<Writer<Boolean, Operation>, Choose<Boolean, R>>
  & CastFn<Writer<Nil|NaN, Operation>, NaN>
  & CastFn<Writer<TreeNode, Operation>, T>

type UnaryPredicate<T> = (t: Writer<T, Operation>) => boolean 
type Test<T> = UnaryPredicate<T> | Writer<T, Operation> | typeof _
type CorrespondingFn<T> = (t: Writer<T, Operation>) => Action<TreeNode> 

export type UnaryCreateFn<T extends UnaryNode> = 
  (e: Writer<TreeNode, Operation>) => Action<T>

export const when = <T extends TreeNode>(
  predicate: Test<T>, 
  fn: Action<TreeNode> | CorrespondingFn<T>
) =>
  (logFunctional: LogFunctionalFn) => {
    return method(predicate, (t: Writer<T, Operation>) => {
      const [result, action] = typeof fn === 'function' ? fn(curate(t)) : fn
      return writer(result, ...logFunctional(action, t))
    })
  }

export type WhenFn = ReturnType<typeof when>
export type EdgeCaseFns = (when: WhenFn) => (typeof method)[]

export type UnaryNodeMetaTuple<T extends UnaryNode, R> = [
  UnaryFn<T, R>,
  TreeNodeGuardFn<T>,
  UnaryCreateFn<T>
]

export type Handle<I extends TreeNode, O extends TreeNode> = 
  (i: Writer<I, Operation>) => Writer<O, Operation>

export const unary = <T extends UnaryNode, R = void>(
  name: string, notation: Notation, species: Species, genus?: Genera,
) => {
  type Result<U extends TreeNode> = R extends void ? U : (R extends TreeNode ? R : never)
  const create = (expression: Writer<TreeNode, Operation>): Action<T> => {
    const n = ({clade: Clades.unary, genus, species, expression}) as T
    return [n, `created ${species.toLocaleLowerCase()}`]
  }
  if(notation === Notation.infix){ throw new Error(`Unknown unary infix operation: ${name}`)}
  const toParticles = (argument: Particle[]): Particle[] =>
    notation === Notation.prefix
      ? [name, '(', argument, ')']
      : ['(', argument, ')', name]
  const logFunctional = processLogs(toParticles, species)

  return (
    whenReal: Handle<Real, Result<Real>>,
    whenComplex: Handle<Complex, Result<Complex>>, 
    whenBoolean: Handle<Boolean, Result<Boolean>>
  ) => {
    const handled = <V extends TreeNode, W extends TreeNode>(
      fn: Handle<V, W>, kind: Species
    ) => 
      (i: Writer<V, Operation>): Action<W> => {
        const result = fn(i)
        return [
          result, 
          `${kind.toLocaleLowerCase()} ${species.toLocaleLowerCase()}`
        ]
      }
    const fn: UnaryFn<T, R> = multi(
      when(isReal, handled(whenReal, Species.real))(logFunctional),
      when(isComplex, handled(whenComplex, Species.complex))(logFunctional),
      when(isBoolean, handled(whenBoolean, Species.boolean))(logFunctional),
      when(eitherNilOrNaN, _ => [nan, 'not a number'])(logFunctional),
      when(isTreeNode, n => create(n))(logFunctional)
    )
    return (...methods: WhenFn[]): UnaryNodeMetaTuple<T, R> => [
      methods.length > 0 ? fromMulti(...methods.map(m => m(logFunctional)))(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }
}
