import { Kind, Tree } from './Expression';
import { partialRight } from './partial';
import { match } from 'ts-pattern';
import { real } from './real';

export function raise(left: Tree, right: Tree): Tree {
  return match<[Tree, Tree], Tree>([left, right])
    .with(
      [{$kind: 'Real'}, {$kind: 'Real'}],
      ([l, r]) => real(l.value ** r.value)
    )
    .otherwise(() => ({$kind: 'Exponentiation', left, right}))
}

export const reciprocal = partialRight(raise, real(-1))
export const square = partialRight(raise, real(2))
export const sqrt = partialRight(raise, real(0.5))
