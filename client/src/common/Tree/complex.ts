import { Base } from './Expression';

export class Complex extends Base {
  readonly $kind = 'Complex'
  constructor(readonly a: number, readonly b: number) { super() }
}

export function complex(a: number|string, b: number|string) {
  return new Complex(Number(a), Number(b))
}

export const ComplexInfinity = complex(Infinity, NaN)
