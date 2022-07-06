---
title: Default Mode
---

![Default Kaypad Mode](/graphca/assets/img/keypad/default.png){:class="img-responsive"}

When GraphCa loads, it will initially place the Keypad into its Default mode, from which a selection of commonly accessed functions can be accessed by activating the associated key. 

As shown in the above image, the four oranage keys are toggles which, upon activation, change the keypad to another mode. These will be discussed in further detail in their own sections.

The numeric keys are located in the bottom center of Default, alongisde the decimal key. The left-facing arrow adjacent to decimal is for associating a value with a variable. Along the lower right are the arithmetic keys. Directly above the number pad are the logarithm and exponential keys. Above which are keys for absolute value, grouping, and comma (which is used in functions which can take multiple arguments). Second row from the top contains the context-sensitive variable key, the derivative key, and keys for permutations, factorials and the gamma function.

The top row currently consists of the trigonometric mode toggle and the delete key. The latter allows you to remove the most recently entered key-press from input.

Finally: the lower left has three more mode toggles (shift, Upper Alphabetic and Lower Alphabetic) and the execute button, which is used to finalize input and submit it to the calculator for processing.


### Mode Toggle Keys

### Number Pad

- <button class='normal'><span class='primary'><span>0</span></span></button>---
  <button class='normal'><span class='primary'><span>9</span></span></button>: Enters the digit associated with the button into the terminal.
- <button class='normal'>
    <span class='primary'>
      <span>.</span>
    </span>
  </button>: Enters a decimal point into the terminal. Note, numbers only support a single decimal point.
- <button class='normal'>
    <span class='primary'>
      <span>&lt;-</span>
    </span>
  </button>: The assignment operator; used in assigning a value to a [variable](/graphca/functions/variables)
  
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

- <button class='normal'><span class='primary'><span>lb</span></span></button>: Binary log; `lb(x)` is equivalent to `log<sub>2</sub>(x)`
- <button class='normal'><span class='primary'><span>ln</span></span></button>: Natural log: `ln(x)` is equivalent to `log<sub>e</sub>(x)`
- <button class='normal'><span class='primary'><span>lg</span></span></button>: Common log: `lg(x)` is equivalent to `log<sub>10</sub>(x)`

### Control Keys

This collection of keys cause the calculator to change state; they are contingent upon input, but do not append to input.

- <button class='normal'><span class='primary'><span>EXE</span></span></button>: Execute; submits the current expression to the calculator for processing
- <button class='normal'><span class='primary'><span>DEL</span></span></button>: Delete; removes the last entered key of input
