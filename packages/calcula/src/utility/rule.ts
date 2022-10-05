import { Writer, unit, isWriter } from '../monads/writer'
import { TreeNode } from './tree'
// import { stringify } from './stringify'

export type Input = string | TreeNode | Writer<TreeNode>
export type StringifyFn = (node: Writer<TreeNode>) => string

export const rule = (strings: TemplateStringsArray, ...nodes: Input[]) => 
  (stringify: StringifyFn) => {
    const asStrings = nodes.map(n => typeof n === 'string' ? n : stringify(isWriter(n) ? n : unit(n)))
    const result: string[] = []
    for(let i = 0; i < strings.length; i++){
      result.push(strings[i], asStrings[i])
    }
    return result.join('')
  }

export const identityRule = <T extends Input>(t: T) => rule`${t}`
