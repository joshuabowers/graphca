## About

GraphCa is a graphing calculator: it allows you input mathematical expressions and graph them. Responsively designed to work in most modern browser environments---including modern smartphones---GraphCa lets you answer the age-old question, "What does a sine wave look like", from anywhere you have a browser and an internet connection. Best of all, it's free! You can resolve mathematical expressions and graph results without ever having to throw large sums of money at another bit of clunky hardware.

But GraphCa isn't limited to just graphing of expressions: it's capable of performing various mathematical simplifications to user input, yielding results that are semantically equivalent, but syntactically simpler. For expressions which have purely numerical inputs, this results in numerically solving the expression. (For a simplistic example, inputing "2 + 2" input GraphCa will correctly result in "4".) However, for expressions containing variables, GraphCa will semantically analyze the input, prise apart the intended meaning of the expression, and apply various rules to form a result which is more canonical. Such results will either have fewer total operatins, or, for the same number of operations, fewer repeated inputs.

But wait, there's more! GraphCa is also capable of performing rudimentary calculus! That's right, with the tap of a few buttons on the app's keypad, you can find the derivatives of expressions you've entered.

### Caveat

GraphCa is developed by one person; it relies upon fundamental data-types provided by your browser. Taken together, it might be buggy or lossy; for mission-critical applications---such as, but not limited to, launching probes at other planets in the solar system, or calculating tolerances for heavy machinery which might harm folk---please do not rely solely upon GraphCa. Reasonable testing has ensured that supported mathematical functionality is accurate, but only up to about 15 decimal places. 
