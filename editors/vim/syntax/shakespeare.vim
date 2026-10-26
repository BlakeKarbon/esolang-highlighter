" Vim syntax file
" Language: Shakespeare Programming Language

if exists("b:current_syntax")
  finish
endif

" All-caps words (e.g. roman numerals) are case sensitive; keywords are not
" and take priority over them because they are defined later.
syn case match
syn match shakespeareFunction   "\<[A-Z][A-Z0-9_]*\>"

syn case ignore
syn match shakespeareNumber     "[+-]\=\<\d\+"
syn match shakespeareKeyword    "\<\%(Speak\s\+your\s\+mind\|Open\s\+your\s\+heart\|Remember\|Seventh\|Let\s\+us\|You\s\+are\|Are\s\+you\|Recall\|Second\|Fourth\|Exeunt\|Scene\|First\|Third\|Fifth\|Sixth\|I\s\+am\|Am\s\+I\|Enter\|Thou\|Exit\|they\|The\|You\|Act\|Let\|If\|As\|We\|I\)\>"
syn match shakespeareAnnotation "\<\%(Act\|Scene\|Enter\|Exit\|Exeunt\)\>"
syn match shakespeareComment    "\[[^]]*\]\="

hi def link shakespeareFunction   Function
hi def link shakespeareNumber     Number
hi def link shakespeareKeyword    Keyword
hi def link shakespeareAnnotation PreProc
hi def link shakespeareComment    Comment

let b:current_syntax = "shakespeare"
