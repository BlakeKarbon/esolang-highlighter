# Editor syntax highlighting

Vim/Neovim and nano syntax files for the same languages the JupyterLab
extension highlights.

| Language    | Extensions                     | Vim filetype     | nano syntax   |
|-------------|--------------------------------|------------------|---------------|
| Chef        | `.chef`                        | `chef`           | `chef`        |
| Brainfuck   | `.bf`, `.b`                    | `brainfuck`      | `brainfuck`   |
| Befunge-93  | `.b93`, `.befunge`             | `befunge`        | `befunge`     |
| LOLCODE     | `.lol`, `.lols`                | `lolcode`        | `lolcode`     |
| Rockstar    | `.rock`                        | `rockstar`       | `rockstar`    |
| Shakespeare | `.spl`                         | `shakespeare`    | `shakespeare` |
| INTERCAL    | `.i`, `.3i`–`.7i`, `.intercal` | `intercal`       | `intercal`    |
| Whitespace  | `.ws`                          | `whitespacelang` | `whitespace`  |

The Vim Whitespace filetype is `whitespacelang` because Vim already ships a
`syntax/whitespace.vim` helper. Vim only treats `.i` files as INTERCAL when
one of the first 50 lines starts with a statement identifier (`DO`, `PLEASE`,
`MAYBE`, `FAC` or `PLACET`, in uppercase); otherwise its usual Progress/SWIG
detection applies.

INTERCAL is highlighted the way C-INTERCAL reads it: keywords are uppercase
and need no word boundaries (`DOUBLE` is `DO` followed by `UBLE`), and
`PLEASE NOTE` is the identifier `PLEASE NOT` followed by the syntax error
`E`. A statement C-INTERCAL can't parse is shown as a comment, which runs on
until the next statement identifier or line label, even one in the middle of
a word.

## Install

Vim:

    cp -r vim/ftdetect vim/syntax ~/.vim/

Neovim:

    cp -r vim/ftdetect vim/syntax ~/.config/nvim/

nano: copy the files somewhere and include them from `~/.nanorc`:

    mkdir -p ~/.nano && cp nano/*.nanorc ~/.nano/
    echo 'include "~/.nano/*.nanorc"' >> ~/.nanorc

## nano limitations

nano highlights with independent regular expressions, so it cannot track
context the way the extension and Vim do:

- Chef: recipe titles and comment paragraphs are not highlighted, and
  numbers, units and method keywords are highlighted anywhere.
- INTERCAL: a comment is only recognised when it starts with a letter that
  no statement starts with (such as the `E` of `PLEASE NOTE`) or a lowercase
  letter, and not when its identifier is on the previous line. A label after
  `COME FROM`, `NEXT FROM` or `CREATE` ends a comment, and only the first
  line of a comment that directly follows another is highlighted.
- LOLCODE: `BTW` inside a string is highlighted as a comment.
