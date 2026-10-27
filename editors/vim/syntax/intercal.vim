" Vim syntax file
" Language: INTERCAL (C-INTERCAL)

if exists("b:current_syntax")
  finish
endif

" C-INTERCAL keywords are uppercase and need no word boundaries: DOUBLE is
" DO followed by UBLE. Whitespace inside a keyword is optional.
syn case match

" &, V (or), ?, ¥, ∀, V-backspace-- (xor), ^, | (sharkfin), @, 2@..5@ (whirlpools)
syn match intercalNumber     "\d\+"
syn match intercalUnary      "V\%x08-\|[2-5]\s*@\|[&V?¥∀^|@]"
syn match intercalVariable   "[.:,;]\s*\%(\%(V\%x08-\|[2-5]\s*@\|[&V?¥∀^|@]\)\s*\)\=\d\+" contains=intercalUnary
" ! is a spark and a spot run together: !1 means '.1
syn match intercalVariable   "!\s*\%(\%(V\%x08-\|[2-5]\s*@\|[&V?¥∀^|@]\)\s*\)\=\d\+" contains=intercalSpark,intercalUnary
syn match intercalSpark      "!" contained
syn match intercalConstant   "#\s*\%(\%(V\%x08-\|[2-5]\s*@\|[&V?¥∀^|@]\)\s*\)\=\d\+" contains=intercalUnary
syn match intercalGroup      +['"]+
" Mingle is $, ¢, £, ¤, U+20A0..U+20AC, ৲, ৳, ฿ or c-backspace-/ or |
syn match intercalOperator   "<-\|[$¢£¤₠-€৲৳฿~/\\+]\|c\%x08[/|]\|SUB\|BY\|MULTIPLICATUS\s*A"
syn match intercalStatement  "\%(MEMINISSE\|DISSIMULARE\|SCRIBERE\s*IN\|CONOR\s*ITERUM\|ADVENIRE\s*DE\|DEINDERE\s*A\|CONCEDERE\|DESPERARE\|LEGERE\s*EX\|REINSTATE\|ABSTINERE\|REINSTARE\|COME\s*FROM\|NEXT\s*FROM\|RECOLERE\|RETRIEVE\|REMEMBER\|ALIENERE\|TRY\s*AGAIN\|QUONDAM\|ABSTAIN\|GRASSOR\|CONFICE\|READ\s*OUT\|WRITE\s*IN\|GO\s*AHEAD\|ITERUM\|DEINDE\|GIVE\s*UP\|GO\s*BACK\|FORGET\|RESUME\|EXUERE\|INUERE\|IGNORE\|REDIRE\|CREATE\|STASH\|WHILE\|AGAIN\|NEXT\|FROM\|ONCE\|PIN\)"
syn match intercalGerund     "\%(DISSIMULANDUM\|MEMINISSENDUM\|REINSTATANDUM\|RECOLERENDUM\|NEXTING\s*FROM\|TRYING\s*AGAIN\|REMEMBERING\|CALCULATING\|CALCULANDUM\|ABSTINENDUM\|REINSTATING\|COMING\s*FROM\|READING\s*OUT\|GOING\s*AHEAD\|CONFICENDUM\|ABSTAINING\|ALIENENDUM\|RETRIEVING\|WRITING\s*IN\|DEINDENDUM\|ADVENENDUM\|PROXIMANDUM\|GOING\s*BACK\|FORGETTING\|SCRIBENDUM\|COMMENTING\|IGNORING\|STASHING\|RESUMING\|LEGENDUM\|COMMENTS\|COMMEMERO\|CREATING\|CREATION\|EXUENDUM\|INUENDUM\|REDENDUM\|COMMENT\|PINNING\|NEXTING\|WHILING\|LOOPING\)"
syn match intercalLabel      "(\s*\d[0-9 \t]*)"
syn match intercalChance     "%\s*\d[0-9 \t]*"

" Statement identifier: DO, PLEASE, PLEASE DO, their Latin forms FAC, PLACET,
" PLACET FACERE, or MAYBE [PLEASE] [DO]; optionally followed by NOT, N'T, NON.
syn match intercalIdentifier "\%(MAYBE\%(\s*PLEASE\)\=\%(\s*DO\)\=\|PLEASE\%(\s*DO\)\=\|PLACET\%(\s*FACERE\)\=\|DO\|FAC\)\%(\s*\%(NOT\|N'T\|NON\|¬\)\)\="
      \ nextgroup=intercalNot,intercalChance,intercalComment skipwhite skipnl skipempty
syn match intercalChance     "%\s*\d[0-9 \t]*" contained nextgroup=intercalComment skipwhite skipnl skipempty

" Statements C-INTERCAL can't parse (e.g. PLEASE NOTE, which is PLEASE NOT
" followed by E) are comments. They run on until the next statement
" identifier or line label, even one in the middle of a word; a label after
" COME FROM, NEXT FROM or CREATE is part of that keyword.
syn region intercalComment contained
      \ start=+\%([.:,;#'"!(%]\|\%(MAYBE\|PLEASE\|PLACET\|DO\|FAC\)\|\%(DISSIMULANDUM\|MEMINISSENDUM\|RECOLERENDUM\|NEXTING\|CONFICENDUM\|DEINDENDUM\|PINNING\)\@!\%(MEMINISSE\|DISSIMULARE\|SCRIBERE\s*IN\|CONOR\s*ITERUM\|ADVENIRE\s*DE\|DEINDERE\s*A\|CONCEDERE\|DESPERARE\|LEGERE\s*EX\|REINSTATE\|ABSTINERE\|REINSTARE\|COME\s*FROM\|NEXT\s*FROM\|RECOLERE\|RETRIEVE\|REMEMBER\|ALIENERE\|TRY\s*AGAIN\|ABSTAIN\|GRASSOR\|CONFICE\|READ\s*OUT\|WRITE\s*IN\|GO\s*AHEAD\|DEINDE\|GIVE\s*UP\|GO\s*BACK\|FORGET\|RESUME\|EXUERE\|INUERE\|IGNORE\|REDIRE\|CREATE\|STASH\|NEXT\|PIN\)\)\@!\S+
      \ end=+\ze\%(DO\|FAC\|PLEASE\|PLACET\|MAYBE\|\%(\%(\%(COME\|NEXT\)\s*FROM\|ADVENIRE\s*DE\|DEINDERE\s*A\|CREATE\|CONFICE\)\s*\)\@<!(\s*\d[0-9 \t]*)\)+

" Whitespace after the identifier may include newlines. Defined after the
" comment region so that it wins when both could start at NOT.
syn match intercalNot        "NOT\|N'T\|NON\|¬" contained
      \ nextgroup=intercalChance,intercalComment skipwhite skipnl skipempty

syn sync fromstart

hi def link intercalNumber     Number
hi def link intercalUnary      Operator
hi def link intercalVariable   Identifier
hi def link intercalSpark      Delimiter
hi def link intercalConstant   Number
hi def link intercalGroup      Delimiter
hi def link intercalOperator   Operator
hi def link intercalStatement  Keyword
hi def link intercalGerund     Type
hi def link intercalLabel      Tag
hi def link intercalIdentifier PreProc
hi def link intercalNot        PreProc
hi def link intercalChance     SpecialChar
hi def link intercalComment    Comment

let b:current_syntax = "intercal"
