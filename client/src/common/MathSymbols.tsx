import React from 'react';

export enum Unicode {
  angle = "\u{2221}",
  derivative = "\u2202",
  delete = "\u232b",
  integral = "\u222b",
  squareRoot = "\u221a",
  plusMinus = "\u00b1",
  minus = "\u2212",
  multiplication = "\u00d7",
  division = "\u00f7",
  shift = "/=",
  alt = "\u2325",
  logic = "\u2234",
  space = "\u23d8",
  exponent = "\u2303",
  i = "\ud835\udc8a",
  e = "\ud835\udc86",
  euler = "\u{1d6c4}",
  x = "\ud835\udc99",
  y = "\ud835\udc9a",
  alphaMega = "\u{1d6a8}",
  alphaMicron = "\u{1d6c2}",
  gamma = "\u{1D6AA}",
  digamma = "\u{1D713}",
  pi = "\u{1D70B}",
  t = "\ud835\udc61",
  theta = "\ud835\udf03",
  epsilon = "\u{025B}",
  n = "\ud835\udc5b",
  infinity = "\u{221E}",
  complexInfinity = "\u{221E}\u{0304}",
}

export const functional = {
  eX: <span>{ Unicode.e }<span>{ Unicode.x }</span></span>,
  base10: <span>10<span>{ Unicode.x }</span></span>,
  base2: <span>2<span>{ Unicode.x }</span></span>,
  invert: <span>{ Unicode.x }<span>-1</span></span>,
  squared: <span>{ Unicode.x }<span>2</span></span>,
  xY: <span>{ Unicode.x }<span>{ Unicode.y }</span></span>,
  nRoot: <span><span>{ Unicode.n }</span>{ Unicode.squareRoot }</span>,
  asin: <span>sin<span>-1</span></span>,
  acos: <span>cos<span>-1</span></span>,
  atan: <span>tan<span>-1</span></span>,
  variables: Unicode.x + Unicode.t + Unicode.theta + Unicode.n,
  partialDerivative: <span>{ Unicode.derivative }/{ Unicode.derivative }{ Unicode.x }</span>
}

export type MathSymbols = string | Unicode | JSX.Element;