" Vim syntax file
" Language: Brainfuck

if exists("b:current_syntax")
  finish
endif

syn match brainfuckComment "[^][<>+.,[:space:]-]\+"
syn match brainfuckMove    "[<>]"
syn match brainfuckArith   "[-+]"
syn match brainfuckLoop    "[][]"
syn match brainfuckIO      "[.,]"

hi def link brainfuckComment Comment
hi def link brainfuckMove    Keyword
hi def link brainfuckArith   Operator
hi def link brainfuckLoop    Delimiter
hi def link brainfuckIO      Function

let b:current_syntax = "brainfuck"
