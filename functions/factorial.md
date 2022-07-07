---
title: Factorial
---

The [factorial](https://en.wikipedia.org/wiki/Factorial) is a recursively defined function on a single argument, typically calculated by the recurrence:

```
n! = n * (n-1)!
```

for all [natural](https://en.wikipedia.org/wiki/Natural_number) `n`. To calculate the factorial in GraphCa, enter the value you wish to use as argument, then activate the `!` key.

Note that definitionally the factorial function is only defined on the natural numbers; any fractional, negative, or complex inputs are, per the recurrence, undefined.

### Gamma Function

The [Gamma Function](https://en.wikipedia.org/wiki/Gamma_function), amongst other uses, exists as an extension of the factorial function; it is applicable to most of the numbers factorial cannot calculate. With the exception of the negative integers, for which the function asymptotically approaches an infinite value, the Gamma function is otherwise defined on all real and complex inputs. 

To find the value of the gamma function for a given input, `n`, activate the {% include key.html name="𝚪" %} key, the value `n`, and a closing parenthesis:

```
𝚪(n)
```

The gamma function will generate the values of the factorial function for natural inputs, according to the following identity:

```
n! = 𝚪(n+1)
```

GraphCa will delegate, via this identity, all non-calculable inputs to factorial to gamma.

### Digamma Function

While a proper discussion of the need for the polygammas might be left to the [Differentiation](/graphca/functions/differentiation) topic, suffice to say that [Digamma](https://en.wikipedia.org/wiki/Digamma_function) is related to the derivative of the Gamma function, and the broader set of Polygamma functions are successive derivatives of Digamma.

Digamma is symbolically represented by `ψ`; the key to enter it is in the [Shift](/graphca/functions/shift) mode tray. The function can be treated as unary: provide it one argument.

To calculate the digamma of an input, `n`, enter {% include key.html mode='shift' name='ψ' %}, followed by `n`, closed with a right parenthesis:

```
ψ(n)
```

### Polygamma Functions

The [polygamma functions](https://en.wikipedia.org/wiki/Polygamma_function) are ordered derivatives of each other; that is, `D(ψ(n)(x)) = ψ(n+1)(x)`, for order `n`. Order `0` is the digamma function; order `1` is its derivative; order `2` its second derivative, etc.

These functions share an input key with the digamma function: they overload the behavior of the key. Should you wish to calculate the polygamma of order `n` of a value, `x`, you would treat `ψ` as though it were a binary function: the first argument is the order, the second argument is the value:

```
ψ(n, x)
```
