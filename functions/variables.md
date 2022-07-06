---
title: Variables
---

Math is often abstracted between numerical values: it is often useful or necessary to think about the functions used by a process in an expression, without a context for specific values which might be inserted into those functions. Math typically represents unknown quantities via the notion of a variable: a stand-in for a value, which can take any value at a later time.

Variables in GraphCa serve three purposes: to represent unknown quantities, to bind to specific quantities, and to faciliate graphing.

### Unbound

An unbound variable is one which has yet to be assigned a value: it is limitless, truly an unknown quantity. Unbound variables evaluate to their name: as they do not have an associated value, they act a placeholders in expressions. They cannot be directly reduced numerically in the expressions within which they appear: as they are anything and nothing, they do not have a value which can be numerically asserted.

Any variable which has yet to be assigned a value is innately unbound. To use them, just reference them. Any expression which contains an unbound variable is limited in the amount of numerical analysis which can be performed upon it; while edge cases exist, in general, the presence of an unbound variable will result in a functional result, rather than a numeric one.

For example, `ln(x)` is an expression which reads "the natural log of x"; in this context, `x` is an unbound variable; applying `ln` to it results in an unknown value, so the result will be `ln(x)`.

GraphCa will attempt to simplify user input with respect to unbound variables: for example, an input of `x / x` will result in an output of `1`, as the division of anything by itself is unity.

Any alphabetic key (in either of the alphabetic modes) will form a new unbound variable. One can also string together alphabetic keys to create longer names for variables. (E.g., instead of naming a variable `y`, one could instead call it `func`.) Finally, the default mode features the context-sensitive variable key, which, when activated, will generate the appropriate variable for the current operational mode. (This defaults to generating `x`.)

### Binding / Assignment

Unbound variables may be bound to the output of another expression. Doing so will cause new references to the variable to evaluate to whatever value it has been bound to. Expressions may be numerical, but they can also be functional.

Binding, or assignment, is done via the left-arrow, `<-`, key: the unbound variable is placed on the left of the arrow, and the new value to assign to it is placed on the right. For example, `x <- 5` will cause the unbound variable `x` to now be bound to the value `5`. You can check the value of any variable in the current session by entering it into the terminal: if unbound, you will get the variable name back; otherwise, the currently bound value.

Assignment is useful for creating functions which can be later [evaluated](/graphca/functions/evaluation.html): this is done by setting one variable equal to an expression which has an unbound variable within it. For example, `y <- ln(x)` will designate the variable `y` as a function of `x`, the precise value of which is only known when `y` is evaluated with a known value for `x`. Functions can reference other functions as part of their assignment:

```
a <- ln(x)
b <- sin(a)
c <- 1 + b
```

Inspecting `c` would yield a value of `sin(ln(x)) + 1`, as one might correctly assume.

### Use in Graphing

GraphCa currently supports generating graphs for two-dimensional functions, e.g. for a variable which has been assigned an expression in another variable. These functions are evaluated at multiple points over a domain of values by supplying a value for the expression variable. So, for an expression like `y <- ln(x)`, GraphCa will determine values for `y` by giving a set of values to `x`. Variable names need not be `x` or `y` to be valid for graphing, though those are canonical defaults.
