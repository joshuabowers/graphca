import { Writer, unit, isWriter } from '../monads/writer'
import { Operation } from './operation'
import { TreeNode } from './tree'
import { Scope, isScope, scope } from '../variable'
import { Unicode } from '../Unicode'
// import { stringify } from './stringify'

export type Input = string | TreeNode | Writer<TreeNode, Operation> | Scope
export type StringifyFn = (node: Writer<TreeNode, Operation>) => string

export const rule = (strings: TemplateStringsArray, ...nodes: Input[]) => 
  (stringify: StringifyFn) => {
    const asStrings = nodes.map(n => 
      typeof n === 'string' 
        ? n 
        : isScope(n)
          ? Array.from(n, ([_k, v]) => stringify(v)).join(', ')
          : stringify(isWriter(n) ? n : unit(n))
    )
    const result: string[] = []
    for(let i = 0; i < strings.length; i++){
      result.push(strings[i], asStrings[i])
    }
    return result.join('')
  }

export const identityRule = <T extends Input>(t: T) => rule`${t}`

export const process = (strings: TemplateStringsArray, ...nodes: Input[]) =>
  (stringify: StringifyFn) =>
    Unicode.process + rule(strings, ...nodes)(stringify)

export const resolve = (strings: TemplateStringsArray, ...nodes: Input[]) =>
  (stringify: StringifyFn) =>
    rule(strings, ...nodes)(stringify) + Unicode.process
