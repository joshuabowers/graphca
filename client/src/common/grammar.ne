@preprocessor typescript

math -> sum
sum -> sum ("+" | "-") product | product
product -> product ("*" | "/") exponent | exponent
exponent -> number "^" exponent | number # number is placeholder; should also handle variables