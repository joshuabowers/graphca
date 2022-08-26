import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, unit, bind, Action, CaseFn, isWriter } from "../monads/writer"
import { 
  TreeNode, Clades, Genera, Species, 
  isClade, isSpecies, TreeNodeGuardFn
} from "../utility/tree"
import { Real, Complex, Boolean, Nil, NaN, nan } from "../primitives"
import { CastFn } from "../utility/typings"

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

export const when = <T extends TreeNode>(
  predicate: Test<T>, 
  fn: Action<TreeNode> | CorrespondingFn<T>
) =>
  method(predicate, (t: Writer<T>) =>
    bind(t, input => {
      const [result, action] = typeof fn === 'function' ? fn(input) : fn
      return ({
        value: isWriter(result) ? result.value : result,
        log: [
          {input, action},
          ...(isWriter(result) ? result.log : [])
        ]
      })
    })
  )

const unaryMap = <T, U = T>(fn: CaseFn<T, U>) =>
  (writer: Writer<T>) =>
    bind(writer, input => {
      const [value, action] = fn(input)
      return ({
        value: isWriter(value) ? value.value : value,
        log: [...(isWriter(value) ? value.log : []), {input, action}]
      })
    })

const whenNilOrNaN: CaseFn<Nil | NaN> = _input => [nan.value, 'not a number']

export type UnaryCreateFn<T extends UnaryNode> = 
  (e: Writer<TreeNode>) => Action<T>
export type UnaryNodeMetaTuple<T extends UnaryNode, R> = [
  UnaryFn<T, R>,
  TreeNodeGuardFn<T>,
  UnaryCreateFn<T>
]

export const unary = <T extends UnaryNode, R = void>(
  species: Species, genus?: Genera
) => {
  type Result<U extends TreeNode> = R extends void ? U : R
  const create = (expression: Writer<TreeNode>): Action<T> => [
    ({clade: Clades.unary, genus, species, expression}) as T,
    species.toLocaleLowerCase()
  ]
  return (
    whenReal: CaseFn<Real, Result<Real>>,
    whenComplex: CaseFn<Complex, Result<Complex>>,
    whenBoolean: CaseFn<Boolean, Result<Boolean>>
  ) => {
    const fn: UnaryFn<T, R> = multi(
      (v: Writer<TreeNode>) => v.value.species,
      method(Species.real, unaryMap(whenReal)),
      method(Species.complex, unaryMap(whenComplex)),
      method(Species.boolean, unaryMap(whenBoolean)),
      method(Species.nil, unaryMap(whenNilOrNaN)),
      method(Species.nan, unaryMap(whenNilOrNaN)),
      method(unaryMap<TreeNode>(input => create(unit(input))))
    )
    return (...methods: (typeof method)[]): UnaryNodeMetaTuple<T, R> => [
      methods.length > 0 ? fromMulti(...methods)(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }
}
