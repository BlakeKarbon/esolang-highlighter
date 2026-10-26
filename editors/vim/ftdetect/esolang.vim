" Filetype detection for the esoteric languages supported by
" jupyterlab-esolang-highlighter.

au BufNewFile,BufRead *.chef            set filetype=chef
au BufNewFile,BufRead *.bf,*.b          set filetype=brainfuck
au BufNewFile,BufRead *.b93,*.befunge   set filetype=befunge
au BufNewFile,BufRead *.lol,*.lols      set filetype=lolcode
au BufNewFile,BufRead *.rock            set filetype=rockstar
au BufNewFile,BufRead *.spl             set filetype=shakespeare
au BufNewFile,BufRead *.intercal        set filetype=intercal
au BufNewFile,BufRead *.ws              set filetype=whitespacelang

" *.i is shared with Progress, SWIG and assembly; only claim it when the file
" contains INTERCAL statements.
au BufNewFile,BufRead *.i
      \ if match(getline(1, 50), '\c^\s*\%((\d\+)\s*\)\=\%(PLEASE\|DO\)\>') >= 0 |
      \   set filetype=intercal |
      \ endif
