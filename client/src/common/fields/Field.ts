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
  abstract cosh(): T
  abstract sinh(): T
  abstract tanh(): T
  abstract acos(): T
  abstract asin(): T
  abstract atan(): T
  abstract acosh(): T
  abstract asinh(): T
  abstract atanh(): T
  abstract lb(): T
  abstract ln(): T
  abstract lg(): T
  abstract factorial(): T
  abstract abs(): T
}