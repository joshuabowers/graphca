---
title: Default Mode
---

### Mode Toggle Keys

### Number Pad

- <button class='normal'><span class='primary'><span>0</span></span></button>---
  <button class='normal'><span class='primary'><span>9</span></span></button>: Enters the digit associated with the button into the terminal.
- <button class='normal'><span class='primary'><span>.</span></span></button>: Enters a decimal point into the terminal. Note, numbers only support a single decimal point.
- <button class='normal'><span class='primary'><span>&lt;-</span></span></button>: The assignment operator; used in assigning a value to a [variable](/graphca/functions/variables)
  
### Arithmetic Keys

Basic arithmetic operators. These are all used in an infix manner: that is, the operator is placed between the operands upon which it works. For example, to add two values together, enter the first value, the addition operator, then the second value: `a + b`.

- <button class='normal'><span class='primary'><span>+</span></span></button>: Addition; used infix
- <button class='normal'><span class='primary'><span>-</span></span></button>: Subtraction; used infix
- <button class='normal'><span class='primary'><span>*</span></span></button>: Multiplication: used infix
- <button class='normal'><span class='primary'><span>/</span></span></button>: Division: used infix
- <button class='normal'><span class='primary'><span>x<sup>2</sup></span></span></button>: Square; will append `^2` to input
- <button class='normal'><span class='primary'><span>x<sup>y</sup></span></span></button>: Raise: will append `^` to input; following input will be used as exponent.

### Logarithmic Keys

Default mode provides easy access to three prevalent logarithm functions; each input will also append a `(`, and expects to be closed by `)`. 

- <button class='normal'><span class='primary'><span>lb</span></span></button>: Binary log; `lb(x)` is equivalent to `log`<sub>`2`</sub>`(x)`
- <button class='normal'><span class='primary'><span>ln</span></span></button>: Natural log: `ln(x)` is equivalent to `log`<sub>`e`</sub>`(x)`
- <button class='normal'><span class='primary'><span>lg</span></span></button>: Common log: `lg(x)` is equivalent to `log`<sub>`10`</sub>`(x)`

### Grouping Keys

- <button class='normal'><span class='primary'><span>(</span></span></button>: Open/Left Parenthesis; used to either begin a sub-expression or to denote functional invocation.
- <button class='normal'><span class='primary'><span>)</span></span></button>: Close/Right Parenthesis: used to either end a sub-expression or to end functional invocation.
- <button class='normal'><span class='primary'><span>,</span></span></button>: Comma; used to separate arguments to functions which support more than a single input.

### Functional Keys

- <button class='normal'><span class='primary'><span>𝒙𝑡𝜃𝑛</span></span></button>: The context-sensitive variable button; will enter in a variable, `x`, `t`, `𝜃`, or `n`, depending upon the coordinate mode of the calculator. 
- <button class='normal'><span class='primary'><span>∂</span></span></button>: [Derivative](/graphca/functions/differentiation); will attempt to find the functional derivative of the expression passed as argument.
- <button class='normal'><span class='primary'><span>nPr</span></span></button>: Permutation; inserts `P(`; expects two arguments, separated by a comma, followed by a right parenthesis. See [Combinatorial](/graphca/functions/combinatorial) for more detail.
- <button class='normal'><span class='primary'><span>!</span></span></button>: [Factorial](/graphca/functions/factorial): a postfix operator which applies to the sub-expression it is placed after.
- <button class='normal'><span class='primary'><span>𝚪</span></span></button>: The Gamma function; will insert `𝚪(`. Expects a single argument followed by a closing parenthesis. See [Factorial](/graphca/functions/factorial) for more detail.
- <button class='normal'><span class='primary'><span>abs</span></span></button>: Absolute value; will insert `abs(`. Expects a single argument followed by a closing parenthesis.

### Control Keys

This collection of keys cause the calculator to change state; they are contingent upon input, but do not append to input.

- <button class='normal'><span class='primary'><span>EXE</span></span></button>: Execute; submits the current expression to the calculator for processing
- <button class='normal'><span class='primary'><span>DEL</span></span></button>: Delete; removes the last entered key of input
