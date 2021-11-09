const lanczos = {
  p: [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ]
}

export abstract class Field<T extends Field<T>> {
  abstract get fieldName(): string
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

  // NOTE: The intent here is to safely convert value, a U, into a
  // Field-wrapped subclass, T. This should be static, but generic
  // statics don't exist. 
  abstract cast(value: number): T

  abstract lt(that: T): boolean
  abstract isNegative(): boolean
  abstract isInteger(): boolean
  abstract isHalfInteger(): boolean
  // abstract isGammaUndefined(): boolean

  /**
   * Defines the Gamma function, which extends the ida of the integer
   * factorial to fields (e.g. Reals and Complexes). Note that this is
   * based on the Lanczos Approximation
   * @see {@link https://en.wikipedia.org/wiki/Lanczos_approximation}
   * @returns Returns the Lanczos Approximation to the gamma function
   */
  gamma(): T {
    const half = this.cast(0.5)
    const one = this.cast(1)
    if(this.lt(half)) {
      const pi = this.cast(Math.PI)
      return pi.divide(
        this.multiply(pi).sin().multiply(
          this.negate().add(one).gamma()
        )
      )
    } else {
      const sqrt2pi = this.cast(2 * Math.PI).raise(half)
      let x = this.cast(0.99999999999980993)
      const z = this.subtract(one)
      lanczos.p.forEach((v, i) => {
        x = x.add(
          this.cast(v).divide(z.add(this.cast(i).add(one)))
        )
      })
      const t = z.add(this.cast(lanczos.p.length)).subtract(half)
      return (
        sqrt2pi
        .multiply(t.raise(z.add(half)))
        .multiply(this.cast(Math.E).raise(t.negate()))
        .multiply(x)
      )
    }
  }

  digamma(): T {
    if(this.isNegative()){
      // reflection
    } else if(this.isInteger()){
      // integer implementation
    } else if(this.isHalfInteger()){
      // half integer implementation
    } else if(this.lt(this.cast(10))){
      // recurrence up toward 10
    } else {
      // values greater than 10
    }
    return this.cast(0)
  }
}