import peg, { $node } from 'pegase';

export const parser = peg`
expression: arithmetic

arithmetic:
| <a>product '+' ^ <b>arithmetic => 'PLUS'
| <a>product '-' ^ <b>arithmetic => 'MINUS'
| product

product:
| <a>exponent '*' ^ <b>product => 'MULTIPLY'
| <a>exponent '/' ^ <b>product => 'DIVIDE'
| exponent

exponent:
| <base>negation '^' ^ <power>expression => 'EXPONENT'
| negation

negation:
| '-' ^ <expression>grouping => 'NEGATE'
| grouping

grouping:
| functional
| '(' ^ expression ')'
| factor

factor:
| <value>number => 'NUMBER'
| <name>variable => 'VARIABLE'

functional: <f>callable '(' <args>expression ')' ${
({f, args}) => $node((<string>f).toLocaleUpperCase(), {args})
}

keywords: callable

callable: "sin" | "cos" | "tan" | "lg" | "ln" | "log"

$number @raw: (integer ('.' integer)? ('E' '-'? integer)?)
$integer @raw: 0 | [1-9][0-9]*
$variable @raw: !(keywords) [a-zA-Z][a-zA-Z0-9]*
`