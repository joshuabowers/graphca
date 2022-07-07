---
title: Combinatorial Functions
---

GraphCa comes with two combinatorial functions, which are built on top of [factorials](/graphca/functions/factorial): combinations and permutations

### Combinations

A [combination](https://en.wikipedia.org/wiki/Combination) is a way of counting unique selections of `r` items from a set of `n` items, where the order of the `r` items does not matter. GraphCa follows the convention of denoting this, in input, by `C(n, r)`. The key for inputing combinations is found in the [shift](/graphca/keypad/shift)-tray. 

As GraphCa delegates factorial to gamma for non-natual inputs, it is possible to calculate combinations for both real and complex inputs.

`n` should be, as a value, larger than `r` to resolve a value. If `r > n`, the function will return a "Not a Number" result. (From set theory, this makes implicit sense: there do not exist any ways to select more items than exist within a given set.)

### Permutations

A [permutation](https://en.wikipedia.org/wiki/Permutation), meanwhile, is similar to a combination, but has the added restriction that order of the `r` selected elements matters. For example, if one had, as a set, the natural numbers from 0 to 10, the 3-tuple `(2, 4, 6)` is both a valid combination and permutation. However, `(6, 4, 2)` is counted as a distinct permutation---the order of the elements matters!---while it is *not* counted as a distinct combination.

GraphCa's convention for input of permutations is `P(n, r)`, where `n > r` should be respected. That is, it takes two arguments, separated by a comma. Like combinations, its inputs can be non-natural. The key to enter a permutation is found in the [default](/graphca/keypad/default)-tray.

### Variability

It's worth noting that both combinations and permutations can contain variable inputs, for either argument. Doing so will follow the behavior of the underlying [variable](/graphca/functions/variable): should it be bound, the value of the variable is inserted; should it be unbound, the result can be later [invoked](/graphca/functions/invocation) to generate a result, or it might even be graphed.

### Differentiability

Be aware that both functions do not have defined derivatives, so attempting to differentiate them will result in an error.
