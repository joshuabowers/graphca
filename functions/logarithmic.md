---
title: Logarithmic Functions
---

The logarithmic functions are primarily found in the [Default](/graphca/keypad/default) mode tray; the more generic `log` function is found in [Shift](/graphca/keypad/shift). 

The three functions found in default are unary functions: they accept a single argument. This result of these functions is the exponent you would need to raise their respective bases to to yield the supplied argument. That is, for example, for the following input:

```
y <- ln(x)
```

`y` is the exponent you would need to raise `e`, the base of the natural log, to get `x`. The three default logs correspond to bases `2`, `e` and `10`.

The more generic `log` function is binary: it expects two arguments separated by a comma. The first argument is the base of the log, while the second is the argument. Thus, in the following set of inputs,

```
b <- 16
y <- log(b, x)
```

`b` is the base for the logarithm, `y` is the exponent `b` would need to be raised to to generate `x`.

Logarithms are interrelated by base-shifting: that is, one can express a log of one base by the log of another base. So, aside from using `log`, one can find the logarithm of any given base, `b`, by:

```
y <- ln(x) / ln(b)
```

While the previous example used the natual log, either the binary or common log could be used instead.

GraphCa will attempt to reduce logarithms if it detects them interacting with exponentiations: as the following identites hold, it can be used to reduce complex expressions:

```
x = ln(e^x)
x = e^(ln(x))
```

In either case, inputting the right side of the identity should result in the left side.
