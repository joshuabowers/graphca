export function fixLeft<L, R, T>(f: (a: L, b: R) => T, a: L): (b: R) => T {
  return function(b: R): T {
    return f(a, b)
  }
}
