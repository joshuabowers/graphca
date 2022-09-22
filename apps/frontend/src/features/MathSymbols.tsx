import React from 'react';
import { Unicode } from '@bowers/calcula';
export { Unicode }

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