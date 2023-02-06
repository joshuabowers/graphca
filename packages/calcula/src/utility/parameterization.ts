import { Writer } from "../monads/writer"
import { TreeNode } from "./tree"
import { isVariable } from '../variable'
import { isUnary } from '../closures/unary'
import { isBinary } from '../closures/binary'

function *findVariables(expression: Writer<TreeNode>): IterableIterator<string>{
  if(isVariable(expression)){
    yield expression.result.name
  } else if(isUnary(expression)){
    yield *findVariables(expression.result.expression)
  } else if(isBinary(expression)){
    yield *findVariables(expression.result.left)
    yield *findVariables(expression.result.right)
  }
}

export const parameterize = (expression: Writer<TreeNode>): Set<string> =>
  new Set<string>(findVariables(expression))
