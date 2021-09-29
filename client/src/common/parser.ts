import peg from 'pegase';

export const expression = peg`
expression: functional | arithmetic
arithmetic: term % ("+" | "-")
term: exponent % ("*" | "/")
exponent: factor ("^" expression)?
factor: number | variable | '(' expression ')' | '-' expression
functional: callable '(' expression ')'
callable: "sin" | "cos" | "tan" | "lg" | "ln" | "log"
$number @raw: integer ('.' integer)? ('E' '-'? integer)?
$integer @raw: 0 | [1-9][0-9]*
$variable @raw: [a-zA-Z][a-zA-Z0-9]*
`;
export const parser = peg`${expression}`;