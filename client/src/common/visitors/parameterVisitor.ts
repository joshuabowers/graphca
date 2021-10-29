import { Visitor, $visit, Node } from 'pegase'

const visitChildren = (...children: Node[]): string[] => {
  return children.flatMap(child => $visit(child))
}

export const parameterVisitor: Visitor<string[]> = {
  'VARIABLE': node => [node.name],

  'PLUS': node => visitChildren(node.a, node.b),
  'MINUS': node => visitChildren(node.a, node.b),
  'MULTIPLY': node => visitChildren(node.a, node.b),
  'DIVIDE': node => visitChildren(node.a, node.b),
  'EXPONENT': node => visitChildren(node.a, node.b),

  $default: node => node.expression ? visitChildren(node.expression) : []
}