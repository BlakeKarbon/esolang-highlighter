" Vim syntax file
" Language: Whitespace
" Named whitespacelang to avoid clashing with Vim's built-in whitespace.vim.

if exists("b:current_syntax")
  finish
endif

syn match whitespacelangSpace " "
syn match whitespacelangTab   "\t"

hi def whitespacelangSpace ctermbg=red  guibg=#f4a3a8
hi def whitespacelangTab   ctermbg=blue guibg=#9999ff

let b:current_syntax = "whitespacelang"
