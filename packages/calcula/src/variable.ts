import { Writer, writer } from './monads/writer'
import { Operation, operation, context } from './utility/operation'
import { TreeNode, Clades, Species, isSpecies } from './utility/tree'
import { isNil, nil } from './primitives/nil'

export type Variable = TreeNode & {
  readonly clade: Clades.variadic,
  readonly species: Species.variable,
  readonly name: string,
  readonly binding: Writer<TreeNode, Operation>
}

export const isVariable = isSpecies<Variable>(Species.variable)

export const variable = (
  name: string, binding: Writer<TreeNode, Operation> = nil
): Writer<Variable, Operation> => 
  writer(
    {clade: Clades.variadic, species: Species.variable, name, binding} as Variable,
    isNil(binding)
      ? operation([name], 'referenced variable')
      : operation(context(binding, -1), 'referenced variable with value')
  )

export type Scope = Map<string, Writer<Variable, Operation>>

export const isScope = (v: unknown): v is Scope =>
  typeof v === 'object' && v !== null
  && ['get', 'set', 'has', 'delete'].every(m => m in v)

type Entries = Iterable<readonly [string, Writer<Variable, Operation>]>

export const scope = (entries: Entries = []): Scope => 
  new Map<string, Writer<Variable, Operation>>(entries)

export const assign = (name: string, value: Writer<TreeNode, Operation>, scope?: Scope) => {
  const v = variable(name, value)
  if(scope){
    if(isNil(value)){ scope.delete(name) }
    else { scope.set(name, v) }
  }
  return v
}
