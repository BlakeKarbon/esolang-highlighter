" Vim syntax file
" Language: LOLCODE

if exists("b:current_syntax")
  finish
endif

syn case ignore

" When several items match at the same position the last defined one wins,
" so the generic identifier comes first and comments last.
syn match lolcodeVariable "\<[A-Za-z_]\w*"
syn match lolcodeNumber   "\<\d\+\%(\.\d\+\)\="
syn match lolcodeKeyword  "\<\%(HOW\s\+IZ\s\+I\|IF\s\+U\s\+SAY\s\+SO\|IM\s\+OUTTA\s\+YR\|IM\s\+IN\s\+YR\|QUOSHUNT\s\+OF\|PRODUKT\s\+OF\|IS\s\+NOW\s\+A\|SMALLR\s\+OF\|EITHER\s\+OF\|BOTH\s\+SAEM\|BIGGR\s\+OF\|DIFF\s\+OF\|BOTH\s\+OF\|DIFFRINT\|KTHXBYE\|ALL\s\+OF\|ANY\s\+OF\|WON\s\+OF\|MOD\s\+OF\|SUM\s\+OF\|CAN\s\+HAS\|I\s\+HAS\s\+A\|VISIBLE\|O\s\+RLY?\|YA\s\+RLY\|NO\s\+WAI\|GIMMEH\|SMOOSH\|MKAY\|MAEK\|OBTW\|TLDR\|WTF?\|LIEK\|HAI\|BTW\|NOT\|ITZ\|AN\|YR\|R\)\w\@!"
syn match lolcodeType     "\<\%(NUMBAR\|BUKKIT\|NUMBR\|TROOF\|NOOB\|YARN\|FAIL\|WIN\)\>"
syn match lolcodeString   +"\%([^"]\|""\)*"\=+
syn match lolcodeComment  "\<BTW\>.*"
syn region lolcodeComment start="\<OBTW\>" end="\<TLDR\>"

syn sync fromstart

hi def link lolcodeVariable Identifier
hi def link lolcodeNumber   Number
hi def link lolcodeKeyword  Keyword
hi def link lolcodeType     Type
hi def link lolcodeString   String
hi def link lolcodeComment  Comment

let b:current_syntax = "lolcode"
