// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.

function id(d: any[]): any { return d[0]; }
declare var plus: any;
declare var minus: any;
declare var multiply: any;
declare var divide: any;
declare var number: any;
declare var power: any;
declare var lparen: any;
declare var rparen: any;
declare var sin: any;
declare var cos: any;
declare var tan: any;
declare var lg: any;
declare var ln: any;
declare var log: any;
declare var ws: any;

const lexer = require('./lexer');

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "expression", "symbols": ["arithmetic"]},
    {"name": "expression", "symbols": ["functional"]},
    {"name": "arithmetic", "symbols": ["sum"]},
    {"name": "sum$subexpression$1", "symbols": [(lexer.has("plus") ? {type: "plus"} : plus)]},
    {"name": "sum$subexpression$1", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)]},
    {"name": "sum", "symbols": ["sum", "ws", "sum$subexpression$1", "ws", "product"]},
    {"name": "sum", "symbols": ["product"]},
    {"name": "product$subexpression$1", "symbols": [(lexer.has("multiply") ? {type: "multiply"} : multiply)]},
    {"name": "product$subexpression$1", "symbols": [(lexer.has("divide") ? {type: "divide"} : divide)]},
    {"name": "product", "symbols": ["product", "ws", "product$subexpression$1", "ws", "exponent"]},
    {"name": "product", "symbols": ["exponent"]},
    {"name": "exponent", "symbols": [(lexer.has("number") ? {type: "number"} : number), (lexer.has("power") ? {type: "power"} : power), "exponent"]},
    {"name": "exponent", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "functional$subexpression$1", "symbols": ["trigonometric"]},
    {"name": "functional$subexpression$1", "symbols": ["logarithmic"]},
    {"name": "functional", "symbols": ["functional$subexpression$1", "ws", (lexer.has("lparen") ? {type: "lparen"} : lparen), "ws", "expression", "ws", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "trigonometric", "symbols": [(lexer.has("sin") ? {type: "sin"} : sin)]},
    {"name": "trigonometric", "symbols": [(lexer.has("cos") ? {type: "cos"} : cos)]},
    {"name": "trigonometric", "symbols": [(lexer.has("tan") ? {type: "tan"} : tan)]},
    {"name": "logarithmic", "symbols": [(lexer.has("lg") ? {type: "lg"} : lg)]},
    {"name": "logarithmic", "symbols": [(lexer.has("ln") ? {type: "ln"} : ln)]},
    {"name": "logarithmic", "symbols": [(lexer.has("log") ? {type: "log"} : log)]},
    {"name": "ws$ebnf$1", "symbols": []},
    {"name": "ws$ebnf$1", "symbols": ["ws$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ws", "symbols": ["ws$ebnf$1"]}
  ],
  ParserStart: "expression",
};

export default grammar;
export {}
