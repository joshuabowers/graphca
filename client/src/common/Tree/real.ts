import { Base } from "./Expression";

export class Real extends Base {
  readonly $kind = 'Real'
  constructor(readonly value: number) { super() }
}

export function real(value: number|string) {
  return new Real(Number(value))
}

export const EulerMascheroni = real(0.57721566490153286060)
