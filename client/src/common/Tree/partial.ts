export function fixLeft<L, R, T>(f: (a: L, b: R) => T, a: L): (b: R) => T {
  return function(b: R): T {
    return f(a, b)
  }
}

export function partial<L, R, T>(f: (left: L, right: R) => T, left: L) {
  return function(expression: R) {
    return f(left, expression)
  }
}

export function partialRight<L, R, T>(f:(left: L, right: R) => T, right: R) {
  return function(expression: L){
    return f(expression, right)
  }
}
