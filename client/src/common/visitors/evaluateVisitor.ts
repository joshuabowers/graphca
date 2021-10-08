import { Visitor, Node, $visit, $node, $fail } from 'pegase';

type EvaluateFunction = (a: number, b: number) => number
type EvaluateNumber = (n: number) => number
type CalculateFunction = () => number

const numberNode = (evaluate: CalculateFunction) => {
  const evaluated = evaluate(), value = evaluated.toString();
  return $node('NUMBER', {value, evaluated})
}

const binaryEval = (node: Node, evaluate: EvaluateFunction): Node => {
  const a = $visit(node.a), b = $visit(node.b);
  if( a.$label !== 'NUMBER' || b.$label !== 'NUMBER' ){
    return $node(node.$label, {a, b})
  } else {
    return numberNode(() => evaluate(a.evaluated, b.evaluated))
  }
}

const applyFunction = (node: Node, evaluate: EvaluateNumber): Node => {
  const expression = $visit(node.expression)
  if( expression.$label !== 'NUMBER' ){
    return $node(node.$label, {expression})
  } else {
    return numberNode(() => evaluate(expression.evaluated))
  }
}

const factorial = (n: number): number => {
  if( n < 0 ){ 
    $fail('factorials undefined for negative numbers')
    return 0;
  }
  return n === 0 ? 1 : n * factorial(n-1);
}
export const evaluateVisitor: Visitor<Node> = {
  NUMBER: (node) => {
    node.evaluated = Number(node.value)
    return node;
  },
  VARIABLE: (node) => node,
  PI: (node) => numberNode(() => Math.PI),
  INFINITY: (node) => numberNode(() => Number.POSITIVE_INFINITY),
  PLUS: (node) => binaryEval(node, (a,b) => a + b),
  MINUS: (node) => binaryEval(node, (a,b) => a - b),
  MULTIPLY: (node) => binaryEval(node, (a,b) => a * b),
  DIVIDE: (node) => binaryEval(node, (a,b) => a / b),
  EXPONENT: (node) => binaryEval(node, (a,b) => a ** b),
  NEGATE: (node) => applyFunction(node, n => -n),
  COS: (node) => applyFunction(node, n => Math.cos(n)),
  SIN: (node) => applyFunction(node, n => Math.sin(n)),
  TAN: (node) => applyFunction(node, n => Math.tan(n)),
  ACOS: (node) => applyFunction(node, n => Math.acos(n)),
  ASIN: (node) => applyFunction(node, n => Math.asin(n)),
  ATAN: (node) => applyFunction(node, n => Math.atan(n)),
  LG: (node) => applyFunction(node, n => Math.log2(n)),
  LN: (node) => applyFunction(node, n => Math.log(n)),
  LOG: (node) => applyFunction(node, n => Math.log10(n)),
  FACTORIAL: (node) => applyFunction(node, n => factorial(n))
}