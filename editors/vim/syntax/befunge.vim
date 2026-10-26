" Vim syntax file
" Language: Befunge-93

if exists("b:current_syntax")
  finish
endif

syn match  befungeNumber    "[0-9]"
syn match  befungeOperator  "[-+*/%!`]"
syn match  befungeDirection "[><^v?_|#]"
syn match  befungeFunction  "[\\$gp&~.,@:]"
" String mode toggles on each quote and may run across lines.
syn region befungeString    start=+"+ end=+"+

syn sync fromstart

hi def link befungeNumber    Number
hi def link befungeOperator  Operator
hi def link befungeDirection Keyword
hi def link befungeFunction  Function
hi def link befungeString    String

let b:current_syntax = "befunge"
