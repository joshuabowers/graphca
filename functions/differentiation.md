---
title: Differentiation
---

GraphCa is capable of [differentiating](https://en.wikipedia.org/wiki/Derivative) expressions; that is, given an expression of arbitrary complexity, it can calculate the derivative of that expression. With the exception of the most basic of expressions (a constant or a variable), all results of the differentiation process will result in a new variable expression.

Located in the [default](/graphca/keypad/default)-tray, the {% include key.html name='∂' %} key is the gateway to calculating derivatives. This function can accept either one or two arguments.

### First Derivative

When supplied with a single argument, `∂` will treat that argument as the expression to differentiate. This will generate the first derivative of the expression.

For example, to find the derivative of the expression `x^2`, supply the expression as the argument to `∂`:

```
∂(x^2)
```

This should result in `2 * x`, as one might expect.

This function nested execution: `∂(∂(x^3))` will produce `6 * x`, as the inner differentiation will be used as argument to the outer differentiation.

Derivatives need not be simple expressions: GraphCa will use the [chain rule](https://en.wikipedia.org/wiki/Chain_rule), amongst others, to break up an expression into smaller chunks which can be separately differentiated. So, for example, take into consideration the expression `e^(sin(x^2))`; GraphCa will correctly generate: `𝒆^(sin(x^2))×(cos(x^2)×(2×x))`.

### nth Derivative

When supplied with two arguments, `∂` will treat the first argument as the derivative order, and the second argument as the expression to differentiate. Note: as GraphCa does not currently implement any sort of [fractional calculus](https://en.wikipedia.org/wiki/Fractional_calculus), the domain for the first argument should be the positive integers. (`[1, 2, 3, ...)`) This will generate the nth-derivative of the supplied expression.

Taking the nested example from the previous section, the second derivative of `x^3` can more simply be found by:

```
∂(2, x^3)
```

Currently, this process is iterative: each ordered derivative is calculated prior to calculating the next higher order. This can be performance intensive for even modestly sized `n` on complex expressions.

### Derivatives of Bound Variables

The discussion to this point has concerned expressions containing [unbound variables](/graphca/functions/vairables); what happens is the differentiation function is applied to a bound variable instead? Consider the following:

```
y <- x * cos(x)
z <- ∂(y)
```

What is the value of `z`? GraphCa will substitute a bound variable with its assigned value when it encounters it in an expression, so the assignment is more accurately handled as:

```
z <- ∂(x * cos(x))
```

Which causes `z` to have the bound value of `cos(x) − x × sin(x)`.

### Usage Caution

The differentiation function is not capable of being bound as the value of a variable, nor capable of being used as a programmable function. While it may be used within a bound expression, as in the previous section, it will interpret the expression variable as a function to immediately differentiate. This can lead to unexpected results. For example, the following, while possible, will not do what one might expect:

```
y <- x * ∂(x)
```

Instead of resulting in a function which generates the product of its input against the derivative of its input, instead, `x` is directly differentiated; `y`, therefore, is identical to `x`.

### Supported Derivatives

Efforts have been undertaken to be as expansive as possible in supporting differentiation. Currently, of the supported functions the calculator provides, only the [combinatorial](/graphca/functions/combinatorial) functions are not differentiable. Every thing else---including the [factorial](/graphca/functions/factorial), gamma, and polygamma functions---should be supported.
