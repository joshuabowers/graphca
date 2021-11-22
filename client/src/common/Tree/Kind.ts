export enum Kind {
  Real,
  Complex,

  Variable,
  Assignment,
  Invocation,

  Addition,
  Subtraction,
  Multiplication,
  Division,
  Exponentiation,

  Negation,
  AbsoluteValue,

  Logarithm,

  BinaryLogarithm,
  NaturalLogarithm,
  CommonLogarithm,

  Cosine,
  Sine,
  Tangent,
  Secant,
  Cosecant,
  Cotangent,

  ArcusCosine,
  ArcusSine,
  ArcusTangent,
  ArcusSecant,
  ArcusCosecant,
  ArcusCotangent,

  HyperbolicCosine,
  HyperbolicSine,
  HyperbolicTangent,
  HyperbolicSecant,
  HyperbolicCosecant,
  HyperbolicCotangent,

  AreaHyperbolicCosine,
  AreaHyperbolicSine,
  AreaHyperbolicTangent,
  AreaHyperbolicSecant,
  AreaHyperbolicCosecant,
  AreaHyperbolicCotangent,

  Gamma,
  Polygamma,
  Factorial,

  Derivative,
  Integral
}
