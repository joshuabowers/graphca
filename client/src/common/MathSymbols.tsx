import React from 'react';

export enum Unicode {
  derivative = "\u2202",
  integral = "\u222b",
  squareRoot = "\u221a",
  plusMinus = "\u00b1",
  minus = "\u2212",
  multiplication = "\u00d7",
  division = "\u00f7",
  shift = "\u2325",
  space = "\u23d8",
  i = "\ud835\udc8a",
  e = "\ud835\udc86",
  x = "\ud835\udc99",
  y = "\ud835\udc9a",
  pi = "\ud835\uded1"
}

export const functional = {
  eX: <span>{ Unicode.e }<span>{ Unicode.x }</span></span>,
  invert: <span>{ Unicode.x }<span>-1</span></span>,
  squared: <span>{ Unicode.x }<span>2</span></span>,
  xY: <span>{ Unicode.x }<span>{ Unicode.y }</span></span>
}

export type MathSymbols = string | Unicode | JSX.Element;