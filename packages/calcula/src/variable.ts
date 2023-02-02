import { Writer, unit } from './monads/writer'
import { TreeNode, Clades, Species, isSpecies } from './utility/tree'
import { isNil, nil } from './primitives/nil'
import { rule, process, resolve } from './utility/rule'

export type Variable = TreeNode & {
  readonly clade: Clades.variadic,
  readonly species: Species.variable,
  readonly name: string,
  readonly value: Writer<TreeNode>
}

export const isVariable = isSpecies<Variable>(Species.variable)

export const variable = (
  name: string, value: Writer<TreeNode> = nil
): Writer<Variable> => 
  ({
    value: {
      clade: Clades.variadic,
      species: Species.variable,
      name, value
    },
    log: [{
      input: process`${name}`, 
      rewrite: isNil(value) ? resolve`${name}` : process`${value}`,
      action: isNil(value) 
        ? 'referenced variable' : 'referenced variable with value'
    }] 
  })

export type Scope = Map<string, Writer<Variable>>

export const isScope = (v: unknown): v is Scope =>
  typeof v === 'object' && v !== null
  && ['get', 'set', 'has', 'delete'].every(m => m in v)

type Entries = Iterable<readonly [string, Writer<Variable>]>

export const scope = (entries: Entries = []): Scope => 
  new Map<string, Writer<Variable>>(entries)

export const assign = (name: string, value: Writer<TreeNode>, scope?: Scope) => {
  const v = variable(name, value)
  if(scope){
    if(isNil(value)){ scope.delete(name) }
    else { scope.set(name, v) }
  }
  return v
}
