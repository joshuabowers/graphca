---
title: Numeric
---

Numbers in GraphCa come in two different flavors: real and complex. In either case, it is important to note that all underlying values are currently stored in Javascript's built in [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) type, which has a precision limit of about 17 decimal places. (The exact precision will vary with how otherwise large the number is. Floating point numbers are a very interesting historical compromise.) As such, be aware that, while testing suggests an accuracy for most functions---unless otherwise noted---to about 15 decimals, any value past that point is suspect.

### Real

Real numbers are any value which is found in the set of [reals](https://en.wikipedia.org/wiki/Real_number); these include the integers, negative numbers, and, subject to precision, rational and irrational fractional values.

To input a real value, it is sufficient to activate the keys (in default mode) associated with those values. A decimal can be similarly input. To make a real value negative, input a minus before the number.

### Complex

[Complex numbers](https://en.wikipedia.org/wiki/Complex_number) are a superset of the reals; they are compositionally a tuple of values, representing the real and imaginary part of the number. Complex numbers are entered in algebraic form as the sum of these two values: `a + bi`, where `a` and `b` are real values and `i` is the constant representing the imaginary number, `sqrt(-1)`. To insert `i`, change the keypad to shift mode and activate the associated key (which should be default "1").

All functions in GraphCa accept both real and complex values, which can be intermixed at whim.
