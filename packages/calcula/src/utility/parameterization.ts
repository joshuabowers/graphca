import { Writer } from "../monads/writer"
import { Operation } from "./operation"
import { TreeNode } from "./tree"
import { isVariable } from '../variable'
import { isUnary } from '../closures/unary'
import { isBinary } from '../closures/binary'

function *findVariables(expression: Writer<TreeNode, Operation>): IterableIterator<string>{
  if(isVariable(expression)){
    yield expression.value.name
  } else if(isUnary(expression)){
    yield *findVariables(expression.value.expression)
  } else if(isBinary(expression)){
    yield *findVariables(expression.value.left)
    yield *findVariables(expression.value.right)
  }
}

export const parameterize = (expression: Writer<TreeNode, Operation>): Set<string> =>
  new Set<string>(findVariables(expression))
