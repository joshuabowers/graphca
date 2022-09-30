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

export type UnaryCreateFn<T extends UnaryNode> = 
  (e: Writer<TreeNode>) => Action<T>

const createWhen = <U extends UnaryNode>(create: UnaryCreateFn<U>) =>
  <T extends TreeNode>(
    predicate: Test<T>, 
    fn: Action<TreeNode> | CorrespondingFn<T>
  ) =>
    method(predicate, (t: Writer<T>) =>
      bind(t, input => {
        const [result, action] = typeof fn === 'function' ? fn(input) : fn
        const node = create(t)[0]
        const output = isWriter(result) ? result.value : result
        return ({
          value: output,
          log: [
            {input: isWriter(node) ? node.value : node, output, action},
            ...(isWriter(result) ? result.log : [])
          ]
        })
      })
    )

export type WhenFn = ReturnType<typeof createWhen>
export type EdgeCaseFns = (when: WhenFn) => (typeof method)[]

const unaryMap = <T, U = T>(fn: CaseFn<T, U>) =>
  (writer: Writer<T>) =>
    bind(writer, input => {
      const [value, action] = fn(input)
      const output = isWriter(value) ? value.value : value
      return ({
        value: output,
        log: [...(isWriter(value) ? value.log : []), {input, output, action}]
      })
    })

const whenNilOrNaN: CaseFn<Nil | NaN> = _input => [nan.value, 'not a number']

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
  const when = createWhen(create)
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
    return (edgeCases?: EdgeCaseFns): UnaryNodeMetaTuple<T, R> => [
      edgeCases ? fromMulti(...edgeCases(when))(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }
}
