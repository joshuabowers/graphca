/**
 * Represents a generic node in an Abstract Syntax Tree representation of a
 * mathematical expression. Subclasses are expected to overwrite 
 * @link{Base#$kind} with a type discriminator. Subclasses further may extend
 * the class definition with node-specific composite data, such as a sub-
 * expression. 
 */
export abstract class Base {
  abstract readonly $kind: string
}

/**
 * Represents any class which has a constructor function which can generate
 * the generic type parameter.
 * Note: conceptually different to the type provided by is.ts, which does not
 * care about new-ability, but rather type-ness as an interactive abstraction.
 */
export type Constructor<T> = new(...args: any[]) => T
