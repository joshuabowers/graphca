export abstract class Field<T extends Field<T>> {
  abstract toString(): string
  abstract add(that: T): T
  abstract subtract(that: T): T
  abstract multiply(that: T): T
  abstract divide(that: T): T
  abstract raise(that: T): T
  abstract negate(): T
  abstract cos(): T
  abstract sin(): T
  abstract tan(): T
  abstract acos(): T
  abstract asin(): T
  abstract atan(): T
  abstract lg(): T
  abstract ln(): T
  abstract log(): T
  abstract factorial(): T
}