---
title: Constants
---

Some values, within math, are special; they represent relationships between functions, in one form or another, and often are non-integral. GraphCa support easy insertion of a handful of these special constants; each gets an associated key on the pad and a special sigil to represent its value. Wherever possible, GraphCa will attempt to present these values as their symbolic sigils, rather than their underlying numeric value. Numeric precision can limit the ability to do this consistently.

All constants are currently located within shift mode, and are generally associated with a number key which is roughly an integral rounding of the constant. These are:

- `∞`: [Infinity](https://en.wikipedia.org/wiki/Infinity#Mathematics), on `shift-0`
- `i`: the [imaginary number](https://en.wikipedia.org/wiki/Imaginary_number), on `shift-1`
- `e`: [Euler's number](https://en.wikipedia.org/wiki/E_(mathematical_constant)), the base of the natural logarithm, on `shift-2`
- `π`: [pi](https://en.wikipedia.org/wiki/Pi), the ratio of a circle's circumfrence to its diameter, on `shift-3`
- `γ`: the [Euler-Mascheroni constant](https://en.wikipedia.org/wiki/Euler%27s_constant), related to the Gamma function, on `shift-.`

Each constant can be used wherever a real-value is accepted. This includes in forming imgainary numbers. 
