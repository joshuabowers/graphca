import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, unit, bind, Action, CaseFn, isWriter, Rewrite } from "../monads/writer"
import { 
  TreeNode, Clades, Genera, Species, Notation,
  isClade, isSpecies, isTreeNode, TreeNodeGuardFn
} from "../utility/tree"
import { 
  Real, Complex, Boolean, Nil, NaN, nan,
  isReal, isComplex, isBoolean, isNil, isNaN
} from "../primitives"
import { CastFn } from "../utility/typings"
import { Input, rule } from "../utility/rule"

export type UnaryNode = TreeNode & {
  readonly clade: Clades.unary,
  readonly expression: Writer<TreeNode>
}

export type Unary<S extends Species, G extends Genera|undefined = undefined> = 
  UnaryNode & {
    readonly genus: G,
    readonly species: S
  }

export const isUnary = isClade<UnaryNode>(Clades.unary)

type Choose<D, F> = F extends void ? D : F

export type UnaryFn<T, R = void> = Multi
  & CastFn<Writer<Real>, Choose<Real, R>>
  & CastFn<Writer<Complex>, Choose<Complex, R>>
  & CastFn<Writer<Boolean>, Choose<Boolean, R>>
  & CastFn<Writer<Nil|NaN>, NaN>
  & CastFn<Writer<TreeNode>, T>

type UnaryPredicate<T> = (t: Writer<T>) => boolean 
type Test<T> = UnaryPredicate<T> | Writer<T> | typeof _
type CorrespondingFn<T> = (t: T) => Action<TreeNode> 

export type UnaryCreateFn<T extends UnaryNode> = 
  (e: Writer<TreeNode>) => Action<T>
export type UnaryToString<I extends Input,> = (i: I) => Rewrite

export const when = <T extends TreeNode>(
  predicate: Test<T>, 
  fn: Action<TreeNode> | CorrespondingFn<T>
) =>
  (toString: UnaryToString<T>) =>
    method(predicate, (t: Writer<T>) =>
      bind(t, input => {
        const [result, rewrite, action] = typeof fn === 'function' ? fn(input) : fn
        return ({
          value: isWriter(result) ? result.value : result,
          log: [
            {input: toString(input), rewrite, action},
            ...(isWriter(result) ? result.log : [])
          ]
        })
      })
    )

export type WhenFn = ReturnType<typeof when>
export type EdgeCaseFns = (when: WhenFn) => (typeof method)[]

const whenNilOrNaN: CaseFn<Nil | NaN> = _input => [nan.value, rule`${nan}`, 'not a number']

export type UnaryNodeMetaTuple<T extends UnaryNode, R> = [
  UnaryFn<T, R>,
  TreeNodeGuardFn<T>,
  UnaryCreateFn<T>
]

export const unaryFnRule = (name: string) =>
  <E extends Input>(e: E) => 
    rule`${name}(${e})`

export const unaryPostfixRule = (operator: string) =>
  <E extends Input>(e: E) =>
    rule`(${e})${operator}`

export type Handle<I extends TreeNode, O extends TreeNode> = (i: I) => Writer<O>

export const unary = <T extends UnaryNode, R = void>(
  name: string, notation: Notation, species: Species, genus?: Genera
) => {
  type Result<U extends TreeNode> = R extends void ? U : (R extends TreeNode ? R : never)
  const create = (expression: Writer<TreeNode>): Action<T> => {
    const n = ({clade: Clades.unary, genus, species, expression}) as T
    return [n, rule`${n}`, species.toLocaleLowerCase()]
  }
  if(notation === Notation.infix){ throw new Error(`Unknown unary infix operation: ${name}`)}
  const toString = notation === Notation.prefix ? unaryFnRule(name) : unaryPostfixRule(name)
  return (
    whenReal: Handle<Real, Result<Real>>,
    whenComplex: Handle<Complex, Result<Complex>>, 
    whenBoolean: Handle<Boolean, Result<Boolean>>
  ) => {
    const handled = <V extends TreeNode, W extends TreeNode>(
      fn: Handle<V, W>, kind: Species
    ) => 
      (i: V): Action<W> => {
        const result = fn(i)
        return [
          result, 
          rule`${result}`, 
          `${kind.toLocaleLowerCase()} ${species.toLocaleLowerCase()}`
        ]
      }
    const fn: UnaryFn<T, R> = multi(
      when(isReal, handled(whenReal, Species.real))(toString),
      when(isComplex, handled(whenComplex, Species.complex))(toString),
      when(isBoolean, handled(whenBoolean, Species.boolean))(toString),
      when(isNil, whenNilOrNaN)(toString),
      when(isNaN, whenNilOrNaN)(toString),
      when(isTreeNode, n => create(unit(n)))(toString)
    )
    return (...methods: WhenFn[]): UnaryNodeMetaTuple<T, R> => [
      methods.length > 0 ? fromMulti(...methods.map(m => m(toString)))(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }
}
