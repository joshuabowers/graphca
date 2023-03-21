import { multi, method, Multi } from "@arrows/multimethod"
import { Species, Clades, Genera } from "../utility/tree"
import { 
  Real, Complex, Boolean,
  real, complex, boolean
} from "../primitives"

export interface Writer<Value, Operation> {
  value: Value,
  log: Operation[]
}

export type WriterFn<V, O, N = V> = (result: V) => Writer<N, O>

export const unit = <V, O>(result: V): Writer<V, O> => ({value: result, log: []})

export const bind = <V, O, N = V>(
  writer: Writer<V, O>, 
  transform: WriterFn<V, O, N>
): Writer<N, O> => {
  const {value: current, log} = writer
  const {value: result, log: updates} = transform(current)
  return {value: result, log: [...log, ...updates]}
}

export const isWriter = <V, O>(obj: unknown): obj is Writer<V, O> =>
  typeof obj === 'object' && ('value' in (obj ?? {})) && ('log' in (obj ?? {}))

export type TreeNode = {
  readonly species: Species,
  readonly genus?: Genera,
  readonly clade: Clades
}

export type Classify<
  N extends TreeNode, 
  S extends Species, 
  G extends Genera|undefined
> =
  N & Readonly<{species: S, genus?: G}>

export type UnaryNode = TreeNode & {
  readonly clade: Clades.unary,
  readonly argument: TreeNode
}

export type Unary<S extends Species, G extends Genera|undefined = undefined> = 
  Classify<UnaryNode, S, G>

export type BinaryNode = TreeNode & {
  readonly clade: Clades.binary,
  readonly left: TreeNode,
  readonly right: TreeNode
}

export type Binary<S extends Species, G extends Genera> = Classify<BinaryNode, S, G>

export type MultiaryNode = TreeNode & {
  readonly clade: Clades.multiary,
  readonly operands: TreeNode[]
}

export type Multiary<S extends Species, G extends Genera> = Classify<MultiaryNode, S, G>

export enum Alter {
  insert = 'i',
  remove = 'r',
  update = 'u'
}

export type Path = number[]
export type Particle = string | Particle[]

export type Delta = [Alter, Path, Particle]

export type Operation = [string, ...Delta[]]

// const o: Operation = [
//   'referenced variable',
//   [Alter.update, [0, 1, 0, 2], ['(', 'x', ')']],
//   [Alter.insert, [0, 0], ['(', 'y', '+', '3', ')']]
// ]

// const [action, ...deltas] = o

// type Overload<Params extends any[], Result extends TreeNode> = 
//   ((...params: Params) => Writer<Result, Operation>)

type UnaryOverload<Argument extends TreeNode, Result extends TreeNode> =
  (argument: Argument|Writer<Argument, Operation>) => Writer<Result, Operation>

type UnaryFn<T extends UnaryNode> = Multi
  & UnaryOverload<TreeNode, T>

type UnaryCreateFn<T extends UnaryNode> = (argument: TreeNode) => [T, string]

type UnaryPredicate<Argument extends TreeNode> = (argument: Argument) => boolean
type UnaryCorrespondingFn<Argument extends TreeNode, Result extends TreeNode> =
  (argument: Argument) => [Result, string]

const unaryBind = <Argument extends TreeNode, Result extends TreeNode>(
  fn: UnaryCorrespondingFn<Argument, Result>
) =>
  (mArgument: Writer<Argument, Operation>) =>
    bind(mArgument, argument => {
      const [result, action] = fn(argument)
      const o: Operation = [action, [Alter.insert, [0], ['']]]
      return ({value: result, log: [o]}) // <- logFunctional?
    })

const ensureWriter = <Argument extends TreeNode, Result extends TreeNode>(
  fn: ReturnType<typeof unaryBind<Argument, Result>>
) => (input: Argument|Writer<Argument, Operation>) =>
  fn(isWriter(input) ? input : unit(input))

const when = <Argument extends TreeNode, Result extends TreeNode = TreeNode>(
  predicate: UnaryPredicate<Argument>,
  fn: UnaryCorrespondingFn<Argument, Result>
) => 
  () => 
    method(predicate, ensureWriter(unaryBind(fn)))

type WhenFn = ReturnType<typeof when>

const unary = <T extends UnaryNode>(
  name: string, species: Species, genus?: Genera
) => {
  const create: UnaryCreateFn<T> = (argument) => [
    ({ clade: Clades.unary, species, genus, argument }) as T,
    `created ${species.toLocaleLowerCase()}`
  ]

  // Primitive Handlers
  return () => {
    // Extensions
    return (...extensions: WhenFn[]) => {
      const fn: UnaryFn<T> = multi(
        ...extensions.map(e => e())
      )
      return [fn]
    }
  }
}

export type Absolute = Unary<Species.abs>

const isTreeNode = (value: unknown): value is TreeNode =>
  typeof value === 'object' && value! && 'species' in value

const isAbsolute = (value: unknown): value is Absolute =>
  isTreeNode(value) && value.species === Species.abs

export const [abs] = unary<Absolute>('abs', Species.abs)(
  // Primitive handlers
)(
  // Extensions
  when<Absolute>(
    isAbsolute,
    a => [a.argument, 'absolute redundancy']
  )
)
