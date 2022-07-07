---
title: Invocation
---

### Variable Recap

Unbound [variables](/graphca/functions/variables) do not have an assigned value; bound variables, by contrast, do. The value of a bound variable can be retrieved by entering in the name of the variable; for example, entering:

```
y <- 5
y
```

would result in GraphCa outputing a value of `5`. But bound variables need not be purely numeric: they can be functional, where the assignment binds to them an expression in an unbound variable:

```
y <- cos(x)
y
```

The output of this example would be `cos(x)`. The value of a bound variable is inserted wherever the variable is encountered:

```
z <- x * y^2
z
```

`z` would therefore equal: `x * (cos(x))^2`

### Variables as Functions

What if you want to supply a value for a variable in a bound expression? Taking `y` as defined in the previous section, how would you find the value of `y` at the value of `𝜋`?

The answer is invocation: treating a bound variable as though it were a function. With invocation, you supply a bound variable with an argument for each unbound variable its expression contains. To do so, reference the variable followed by an open parenthesis, a comma-separated argument list for each expression variable, and a closing parenthesis:

```
y(𝜋)
```

The result of this input would be `-1`: `𝜋` is temporarily bound to the expression variable `x`, and the full expression to which `y` is assigned is evaluated with this new data.

As suggested, this works for expressions which operate on more than a single unbound variable:

```
c <- a^2 + 2*b
c(3, 5)
```

The value of which would be `19`.

### Composibility

Expressions with unbound variables may be provided as argument to an invocation. Doing so will bind the appropriate variable to the supplied expression. 

```
y <- 2 * x
y(x^2)
```

Which yields `2 * x^2`

This can be used to compose functions to more easily generate complex expressions, or to change the expression variable of the function:

```
f <- x^2
g <- cos(x)
h <- g(f(n))
```

Which would yield `cos(n^2)`

### Currying and Partial Application

GraphCa supports both [currying](https://en.wikipedia.org/wiki/Currying) and [partial application](https://en.wikipedia.org/wiki/Partial_application) as invocation strategies for functions of multiple variables. That is, should a bound variable contain multiple unbound variables within its assigned expression, fewer arguments may be supplied to an invocation than would be necessary to provide a value to all unbound variables. Any variables which do not recieve an assignment will be left in the resulting expression.

To curry, chian singular argument lists on invocation:

```
c <- a^2 + 2*b
c(3)(5)
```

which is the same as the previous example.

To partially apply:

```
e <- c + cos(d)
e(2, 3)
```

The result of which is `10 + cos(d)`

In either case, these invocation strategies will bind the values supplied as arguments to expression variables in the following fashion: arguments are processed left-to-right, and are assigned to variables in appearance order within the function expression. So, the expressions `x + y` and `y + x` will bind their variables differently!

### Expression Invocation

As hinted at in the previous section, chained invocation is a possibility to providing arguments to a function. However, one need not even have a bound variable to invoke arguments on an expression! Instead, any expression containing an unbound variable can be directly invoked with arguments. (As should hopefully be obvious, referencing a variable is, in and of itself, an expression.)

When invoking an expression, it is helpful to ensure that you are invoking the entirety of the expression, rather than one of its sub-expressions. This can be most easily achieved by using grouping symbols. To make the input more readable, consider the use of square or curly brackets.

```
{x^2 + 2*x}(5)
```

This yields `35`. As can be seen, the way to achieve expression invocation is to group the expression and follow it with an argument list. This process supports composition, currying and partial application:

```
{x^2 + 2*y}(z)
```

Would generate: `z^2 + 2*y`.
