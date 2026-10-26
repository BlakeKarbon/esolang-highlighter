# Editor syntax highlighting

Vim/Neovim and nano syntax files for the same languages the JupyterLab
extension highlights.

| Language    | Extensions          | Vim filetype     | nano syntax   |
|-------------|---------------------|------------------|---------------|
| Chef        | `.chef`             | `chef`           | `chef`        |
| Brainfuck   | `.bf`, `.b`         | `brainfuck`      | `brainfuck`   |
| Befunge-93  | `.b93`, `.befunge`  | `befunge`        | `befunge`     |
| LOLCODE     | `.lol`, `.lols`     | `lolcode`        | `lolcode`     |
| Rockstar    | `.rock`             | `rockstar`       | `rockstar`    |
| Shakespeare | `.spl`              | `shakespeare`    | `shakespeare` |
| INTERCAL    | `.i`, `.intercal`   | `intercal`       | `intercal`    |
| Whitespace  | `.ws`               | `whitespacelang` | `whitespace`  |

The Vim Whitespace filetype is `whitespacelang` because Vim already ships a
`syntax/whitespace.vim` helper. Vim only treats `.i` files as INTERCAL when
one of the first 50 lines starts with `DO` or `PLEASE`; otherwise its usual
Progress/SWIG detection applies.

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
- INTERCAL: only `PLEASE NOTE` / `DO NOTE` comments are recognised, and a
  comment does not continue onto following lines.
- LOLCODE: `BTW` inside a string is highlighted as a comment.
