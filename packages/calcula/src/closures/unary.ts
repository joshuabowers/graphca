import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, writer, unit } from "../monads/writer"
import { 
  Particle, Operation, operation, Action, CaseFn 
} from '../utility/operation'
import { CaretPosition, embedCaret } from "../utility/caret"
import { 
  TreeNode, Clades, Genera, Species, Notation,
  isClade, isSpecies, isTreeNode, TreeNodeGuardFn
} from "../utility/tree"
import { 
  Real, Complex, Boolean, Nil, NaN, nan,
  isReal, isComplex, isBoolean, isNil, isNaN
} from "../primitives"
import { CastFn } from "../utility/typings"
import { Unicode } from "../Unicode"

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
type CorrespondingFn<T> = (t: T) => Action<TreeNode> 

export type UnaryCreateFn<T extends UnaryNode> = 
  (e: Writer<TreeNode, Operation>) => Action<T>
// export type UnaryToString<I extends Input,> = (i: I) => Rewrite

export const when = <T extends TreeNode>(
  predicate: Test<T>, 
  fn: Action<TreeNode> | CorrespondingFn<T>
) =>
  (name: string, notation: Notation, species: Species) => {
    if(notation === Notation.infix){
      throw new Error(`Unknown unary infix operation: ${name}`)
    }
    const toParticles = (position: CaretPosition, argument: Particle[]): Particle[] =>
      notation === Notation.prefix
        ? [name, '(', ...embedCaret(position, argument), ')']
        : ['(', ...embedCaret(position, argument), ')', name]
    return method(predicate, (t: Writer<T, Operation>) => {
      const [result, action] = typeof fn === 'function' ? fn(t.value) : fn
      return writer(
        result,
        // unprocessed current node
        operation(
          toParticles(CaretPosition.none, t.log[0].particles),
          `identified ${species.toLocaleLowerCase()}`
        ),
        // about to process argument
        operation(
          toParticles(CaretPosition.before, t.log[0].particles), 
          'processing argument'
        ),
        // argument logs
        ...t.log,
        // after argument processing
        operation(
          toParticles(CaretPosition.after, t.log.at(-1)?.particles ?? ['never']), 
          'processed argument'
        ),
        // after generating action, before result logs, if any
        operation(
          toParticles(CaretPosition.none, t.log.at(-1)?.particles ?? ['never']), 
          action
        )
      )
    })
  }
      // bind(t, input => {
      //   const [result, action] = typeof fn === 'function' ? fn(input) : fn
      //   writer(
      //     result,
      //     operation([], action)
      //   )
        // return ({
        //   value: isWriter(result) ? result.value : result,
        //   log: [
        //     {input: toString(input), action},
        //     ...(isWriter(result) ? result.log : [])
        //   ]
        // })
      // })

export type WhenFn = ReturnType<typeof when>
export type EdgeCaseFns = (when: WhenFn) => (typeof method)[]

const whenNilOrNaN: CaseFn<Nil | NaN> = _input => [nan, 'not a number']

export type UnaryNodeMetaTuple<T extends UnaryNode, R> = [
  UnaryFn<T, R>,
  TreeNodeGuardFn<T>,
  UnaryCreateFn<T>
]

// export const unaryFnRule = (name: string) =>
//   <E extends Input>(e: E) => 
//     process`${name}(${e})`

// export const unaryPostfixRule = (operator: string) =>
//   <E extends Input>(e: E) =>
//     process`(${e})${operator}`

export type Handle<I extends TreeNode, O extends TreeNode> = (i: I) => Writer<O, Operation>
// export type HandlerRewriteFn = (i: Input) => Rewrite

export const unary = <T extends UnaryNode, R = void>(
  name: string, notation: Notation, species: Species, genus?: Genera,
  // handlerRewrite?: HandlerRewriteFn
) => {
  type Result<U extends TreeNode> = R extends void ? U : (R extends TreeNode ? R : never)
  const create = (expression: Writer<TreeNode, Operation>): Action<T> => {
    const n = ({clade: Clades.unary, genus, species, expression}) as T
    // return [n, resolve`${n}`, species.toLocaleLowerCase()]
    return [n, `created ${species.toLocaleLowerCase()}`]
  }
  if(notation === Notation.infix){ throw new Error(`Unknown unary infix operation: ${name}`)}
  // const toString = notation === Notation.prefix ? unaryFnRule(name) : unaryPostfixRule(name)
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
          // handlerRewrite ? handlerRewrite(i) : process`${result}`, 
          `${kind.toLocaleLowerCase()} ${species.toLocaleLowerCase()}`
        ]
      }
    const fn: UnaryFn<T, R> = multi(
      when(isReal, handled(whenReal, Species.real))(name, notation, species),
      when(isComplex, handled(whenComplex, Species.complex))(name, notation, species),
      when(isBoolean, handled(whenBoolean, Species.boolean))(name, notation, species),
      when(isNil, whenNilOrNaN)(name, notation, species),
      when(isNaN, whenNilOrNaN)(name, notation, species),
      when(isTreeNode, n => create(unit(n)))(name, notation, species)
    )
    return (...methods: WhenFn[]): UnaryNodeMetaTuple<T, R> => [
      methods.length > 0 ? fromMulti(...methods.map(m => m(name, notation, species)))(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }
}
