" Vim syntax file
" Language: INTERCAL (INTERCAL-72 and C-INTERCAL extensions)

if exists("b:current_syntax")
  finish
endif

syn case ignore

syn match intercalNumber     "\d\+"
syn match intercalUnary      "[&V?∀¥∨]" contained
syn match intercalVariable   "[.:,;][&V?∀¥∨]\=\d\+" contains=intercalUnary
syn match intercalConstant   "#[&V?∀¥∨]\=\d\+" contains=intercalUnary
syn match intercalGroup      +['"][&V?∀¥∨]\=+ contains=intercalUnary
syn match intercalOperator   "<-\|[$¢~+]\|\<\%(SUB\|BY\)\>"
syn match intercalStatement  "\<\%(ABSTAIN\s\+FROM\|COME\s\+FROM\|NEXT\s\+FROM\|REINSTATE\|TRY\s\+AGAIN\|REMEMBER\|GO\s\+AHEAD\|RETRIEVE\|READ\s\+OUT\|WRITE\s\+IN\|ABSTAIN\|GIVE\s\+UP\|GO\s\+BACK\|FORGET\|RESUME\|IGNORE\|STASH\|WHILE\|AGAIN\|NEXT\|ONCE\)\>"
syn match intercalGerund     "\<\%(NEXTING\s\+FROM\|REINSTATING\|COMING\s\+FROM\|TRYING\s\+AGAIN\|GOING\s\+AHEAD\|READING\s\+OUT\|REMEMBERING\|CALCULATING\|WRITING\s\+IN\|ABSTAINING\|RETRIEVING\|GIVING\s\+UP\|GOING\s\+BACK\|FORGETTING\|COMMENTING\|RESUMING\|STASHING\|IGNORING\|NEXTING\)\>"
syn match intercalLabel      "(\d\+)"

" Statement identifier: DO, PLEASE, PLEASE DO, optionally MAYBE and NOT / N'T
syn match intercalIdentifier "\<\%(MAYBE\s\+\)\=\%(PLEASE\%(\s\+DO\)\=\|DO\)\%(N'T\|\s\+NOT\)\=\>"
      \ nextgroup=intercalChance,intercalComment skipwhite
syn match intercalChance     "%\d\+" contained nextgroup=intercalComment skipwhite

" Unparseable statements (e.g. PLEASE NOTE ...) are comments and run on until
" the next line that starts a statement.
syn region intercalComment contained
      \ start=+\%(\%(ABSTAIN\|REINSTATE\|COME\|NEXT\|FORGET\|RESUME\|STASH\|RETRIEVE\|IGNORE\|REMEMBER\|GIVE\|READ\|WRITE\|TRY\|GO\|WHILE\|ONCE\|AGAIN\)\>\|[.:,;#'"(%]\)\@!\S+
      \ end=+\ze\n\s*\%((\d\+)\s*\)\=\%(MAYBE\s\+\)\=\%(PLEASE\|DO\)\>+

syn sync fromstart

hi def link intercalNumber     Number
hi def link intercalUnary      Operator
hi def link intercalVariable   Identifier
hi def link intercalConstant   Number
hi def link intercalGroup      Delimiter
hi def link intercalOperator   Operator
hi def link intercalStatement  Keyword
hi def link intercalGerund     Type
hi def link intercalLabel      Tag
hi def link intercalIdentifier PreProc
hi def link intercalChance     SpecialChar
hi def link intercalComment    Comment

let b:current_syntax = "intercal"
