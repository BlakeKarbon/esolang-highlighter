" Vim syntax file
" Language: Chef

if exists("b:current_syntax")
  finish
endif

" A recipe starts at its title line; everything that is not an ingredient
" list or method is a comment, until the Serves line.
syn region chefRecipe matchgroup=chefTitle start="^\s*\S.*$" end="^\ze\s*Serves \d\+\.\s*$"
      \ contains=chefIngredients,chefMethod
syn match  chefServes "^\s*Serves \d\+\.\s*$" contains=chefNumber

syn region chefIngredients contained matchgroup=chefSection
      \ start="^\s*Ingredients\.\s*$" end="^\s*$" contains=chefNumber,chefUnit
syn region chefMethod contained matchgroup=chefSection
      \ start="^\s*Method\.\s*$" end="^\s*$" contains=chefKeyword,chefBowl,chefDish

syn match chefNumber  "\d\+" contained
syn match chefUnit    " \%(g\|kg\|pinch\%(es\)\=\|ml\|l\|dash\%(es\)\=\) " contained
syn match chefUnit    " \%(\%(heaped\|level\) \)\=\%(cups\=\|teaspoons\=\|tablespoons\=\) " contained
syn match chefKeyword "\<\%(Take\|Put\|Fold\|Add\|Remove\|Combine\|Divide\|Liquefy\|Stir\|Mix\|Clean\|Pour\|Set aside\|Serve with\|Refrigerate\)\>" contained
syn match chefBowl    "mixing bowl" contained
syn match chefDish    "baking dish" contained

syn sync fromstart

hi def link chefRecipe  Comment
hi def link chefTitle   Function
hi def link chefSection PreProc
hi def link chefNumber  Number
hi def link chefUnit    Type
hi def link chefKeyword Keyword
hi def link chefBowl    Tag
hi def link chefDish    SpecialChar

let b:current_syntax = "chef"
