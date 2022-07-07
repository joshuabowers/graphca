---
title: Trigonometric Functions
---

As described in the [Trigonometric](/graphca/keypad/trigonometric) mode documentation, GraphCa supports 24 distinct trigonometric-like functions: three basic functions (`sin`, `cos`, and `tan`), their reciprocals (`csc`, `sec`, and `cot`), and reinterpretations of those six functions in three separate usage domains (being inverse trigometric, hyperbolic, and inverse hyperbolic).

Each of these functions are unary: they take a single argument. To enter a function, you will need to change to the trigonometric mode, activate its associated key, supply the function with an argument, and close the expression with a closing parenthesis:

```
sin(x)
```

At this time, GraphCa does not attempt any reductions directly related to any of the trigonometric functions.

Both numeric types---reals and complex numbers---are supported for all 24 operations.

Currently, the inputs and results of these functions are interpreted as being in radians, as appropriate.
