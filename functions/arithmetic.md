---
title: Arithmetic
---

Arithmetic operators are found in the [Default](/graphca/keypad/default) mode; they are binary infix operators: that is, they expect two values to operate on, and are placed between those two values to form a composite expression. For example, to add two numbers together, you would enter the first number, followed by the addition operator, followed by the second number.

GraphCa will attempt to reduce arithmetic expressions following a set of mathematical rules associated with each operator. The primary reduction rule will attempt to perform the operation on known numerical values. This would result in a numerical answer to the expression. If either sub-expression contains an [unbound variable](/graphca/functions/variables), a purely numerical result is likely not soluable.

When dealing with variables, therefore, GraphCa prioritizes two goals for generating a response:

1. Reduce the total structure of the expression by removing semantically unneccessary sub-expressions, and
2. combining like terms to eliminate repetitions

To illustrate the first goal, consider the multiplication of a variable by unity: `x * 1`. In this case, GraphCa recognizes that multiplying the variable, `x`, by the value `1`, is not impacted by potential values of `x`; in any case, the result will be the variable `x`.

As an example of the second goal, consider the multiplication of a variable by itself: `x * x`. In this case, GraphCa recognizes that this is semantically equivalent to an exponentiation: while the total complexity of the result is not reduced, the result has combined like terms according to the rules of the operator, to produce the more canonical result of `x ^ 2`. (To be clear: in this result, the variable and the numeric value are only referenced once in the expression, whereas the variable is referenced twice in the input.)

Efforts have been made to provide a large number of reductions and semantic rewrites. This process is not necessarily exhaustive; there are likely edge-cases which have been missed. Should you find an unexpected response to input, feel welcome to submit an [issue](https://github.com/joshuabowers/graphca/issues) on the application's issue list.
