@preprocessor typescript

@{%
const lexer = require('./lexer');
%}

@lexer lexer

expression -> arithmetic | functional

arithmetic -> sum
sum -> sum ws (%plus | %minus) ws product | product
product -> product ws (%multiply | %divide) ws exponent | exponent
exponent -> %number %power exponent | %number # number is placeholder; should also handle variables

functional -> (trigonometric | logarithmic) ws %lparen ws expression ws %rparen

trigonometric -> %sin | %cos | %tan
logarithmic -> %lg | %ln | %log

ws -> %ws:*