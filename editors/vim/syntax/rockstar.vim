" Vim syntax file
" Language: Rockstar

if exists("b:current_syntax")
  finish
endif

syn case ignore

" Words may contain apostrophes (don't, ain't); a keyword only matches when
" it is the whole word.
syn match rockstarVariable "\<[A-Za-z]\+\%('[A-Za-z]\+\)*"
syn match rockstarNumber   "\d\+\%(\.\d\+\)\="
syn match rockstarKeyword  "\<\%(say\|put\|into\|build\|knock\|split\|join\|let\|be\|is\|are\|was\|were\|am\|has\|have\|likes\|wants\|takes\|gives\|with\|if\|else\|while\|until\|continue\|break\|return\|roll\|cast\|listen\|whisper\|shout\|scream\|and\|or\|not\)\>\%('\a\)\@!"
syn match rockstarConstant "\<\%(true\|false\|null\|empty\|mysterious\|nothing\|nobody\|nowhere\|right\|wrong\)\>\%('\a\)\@!"
syn match rockstarString   +"[^"]*"\=+
syn match rockstarString   +'[^']*'\=+
syn match rockstarComment  "(.*"

hi def link rockstarVariable Identifier
hi def link rockstarNumber   Number
hi def link rockstarKeyword  Keyword
hi def link rockstarConstant Constant
hi def link rockstarString   String
hi def link rockstarComment  Comment

let b:current_syntax = "rockstar"
