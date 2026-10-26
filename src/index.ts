
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

type Token = { text: string; kind?: string };
type ChefState = "root" | "recipe" | "ingredients" | "method";

const STYLE_ID = "esolang-highlight-styles";

function tokenizeChefLine(
  line: string,
  state: ChefState
): { tokens: Token[]; state: ChefState } {
  const tokens: Token[] = [];
  const emit = (text: string, kind?: string) => {
    if (text) tokens.push({ text, kind });
  };

  function scan(rules: Array<{ regex: RegExp; kind: string }>) {
    let pos = 0;
    while (pos < line.length) {
      let matched = false;
      for (const rule of rules) {
        rule.regex.lastIndex = pos;
        const match = rule.regex.exec(line);
        if (!match || match.index !== pos) continue;
        emit(match[0], rule.kind);
        pos += match[0].length;
        matched = true;
        break;
      }
      if (!matched) emit(line[pos++]);
    }
  }

  if (state === "root") {
    if (/^\s*$/.test(line)) emit(line);
    else {
      emit(line, "function");
      state = "recipe";
    }
  } else if (state === "recipe") {
    if (/^\s*Ingredients\.\s*$/.test(line)) {
      emit(line, "annotation");
      state = "ingredients";
    } else if (/^\s*Method\.\s*$/.test(line)) {
      emit(line, "annotation");
      state = "method";
    } else {
      const serves = /(^\s*)(Serves )(\d+)(\.\s*$)/.exec(line);
      if (serves) {
        emit(serves[1]);
        emit(serves[2]);
        emit(serves[3], "number");
        emit(serves[4]);
        state = "root";
      } else if (line) emit(line, "comment");
    }
  } else if (state === "ingredients") {
    if (/^\s*$/.test(line)) {
      emit(line);
      state = "recipe";
    } else {
      scan([
        { regex: /\d+/g, kind: "number" },
        {
          regex: / (g|kg|pinch(?:es)?|ml|l|dash(?:es)?) /g,
          kind: "type"
        },
        {
          regex: / ((heaped|level) )?(cups?|teaspoons?|tablespoons?) /g,
          kind: "type"
        }
      ]);
    }
  } else {
    if (/^\s*$/.test(line)) {
      emit(line);
      state = "recipe";
    } else {
      const rules = [
        { regex: /mixing bowl/y, kind: "tag" },
        { regex: /baking dish/y, kind: "meta" },
        {
          regex: /(Take|Put|Fold|Add|Remove|Combine|Divide|Liquefy|Stir|Mix|Clean|Pour|Set aside|Serve with|Refrigerate)\b/y,
          kind: "keyword"
        }
      ];
      let pos = 0;
      while (pos < line.length) {
        let matched = false;
        for (const rule of rules) {
          rule.regex.lastIndex = pos;
          const match = rule.regex.exec(line);
          if (!match || match.index !== pos) continue;
          emit(match[0], rule.kind);
          pos += match[0].length;
          matched = true;
          break;
        }
        if (!matched) emit(line[pos++]);
      }
    }
  }
  return { tokens, state };
}

function tokenizeChef(source: string): Token[] {
  const output: Token[] = [];
  let state: ChefState = "root";
  const lines = source.split("\n");
  lines.forEach((line, i) => {
    const result = tokenizeChefLine(line, state);
    output.push(...result.tokens);
    state = result.state;
    if (i < lines.length - 1) output.push({ text: "\n" });
  });
  return output;
}

function tokenizeBrainfuck(source: string): Token[] {
  return [...source].map((ch) => {
    if ("<>".includes(ch)) return { text: ch, kind: "keyword" };
    if ("+-".includes(ch)) return { text: ch, kind: "operator" };
    if ("[]".includes(ch)) return { text: ch, kind: "bracket" };
    if (".,".includes(ch)) return { text: ch, kind: "function" };
    if (/\s/.test(ch)) return { text: ch };
    return { text: ch, kind: "comment" };
  });
}

function tokenizeBefunge(source: string): Token[] {
  const tokens: Token[] = [];
  let stringMode = false;
  for (const ch of source) {
    if (ch === '"') {
      tokens.push({ text: ch, kind: "string" });
      stringMode = !stringMode;
    } else if (stringMode) {
      tokens.push({ text: ch, kind: "string" });
    } else if (/[0-9]/.test(ch)) {
      tokens.push({ text: ch, kind: "number" });
    } else if (/[+\-*\/%!`]/.test(ch)) {
      tokens.push({ text: ch, kind: "operator" });
    } else if (/[><^v?_|\#]/.test(ch)) {
      tokens.push({ text: ch, kind: "keyword" });
    } else if (/[:\\$gp&~.,@]/.test(ch)) {
      tokens.push({ text: ch, kind: "function" });
    } else if (/\s/.test(ch)) {
      tokens.push({ text: ch });
    } else {
      tokens.push({ text: ch });
    }
  }
  return tokens;
}

const LOL_KEYWORDS = [
  "HOW IZ I", "IF U SAY SO", "IM IN YR", "IM OUTTA YR",
  "IS NOW A", "O RLY?", "YA RLY", "NO WAI", "WTF?",
  "I HAS A", "SUM OF", "DIFF OF", "PRODUKT OF", "QUOSHUNT OF",
  "BOTH SAEM", "DIFFRINT", "BIGGR OF", "SMALLR OF",
  "EITHER OF", "BOTH OF", "WON OF", "ALL OF", "ANY OF",
  "KTHXBYE", "VISIBLE", "GIMMEH", "MKAY", "MAEK", "MOD OF",
  "HAI", "BTW", "OBTW", "TLDR", "AN", "YR", "R", "ITZ",
  "WIN", "FAIL", "NOT", "NOOB", "NUMBR", "NUMBAR", "YARN",
  "TROOF", "BUKKIT", "SMOOSH", "LIEK", "CAN HAS"
].sort((a, b) => b.length - a.length);

function tokenizeLolcode(source: string): Token[] {
  const tokens: Token[] = [];
  let blockComment = false;

  const lines = source.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let pos = 0;
    while (pos < line.length) {
      const rest = line.slice(pos);

      if (blockComment) {
        const end = /\bTLDR\b/i.exec(rest);
        if (!end) {
          tokens.push({ text: rest, kind: "comment" });
          pos = line.length;
          continue;
        }
        tokens.push({ text: rest.slice(0, end.index + 4), kind: "comment" });
        pos += end.index + 4;
        blockComment = false;
        continue;
      }

      if (/^\s/.test(rest)) {
        const m = /^\s+/.exec(rest)!;
        tokens.push({ text: m[0] });
        pos += m[0].length;
        continue;
      }

      if (/^OBTW\b/i.test(rest)) {
        const m = /^OBTW\b/i.exec(rest)![0];
        tokens.push({ text: m, kind: "comment" });
        pos += m.length;
        blockComment = true;
        continue;
      }

      if (/^BTW\b/i.test(rest)) {
        tokens.push({ text: rest, kind: "comment" });
        pos = line.length;
        continue;
      }

      if (rest[0] === '"') {
        const m = /^"(?:[^"]|"")*(?:"|$)/.exec(rest)![0];
        tokens.push({ text: m, kind: "string" });
        pos += m.length;
        continue;
      }

      const number = /^\d+(?:\.\d+)?/.exec(rest);
      if (number) {
        tokens.push({ text: number[0], kind: "number" });
        pos += number[0].length;
        continue;
      }

      const keyword = LOL_KEYWORDS.find((word) =>
        new RegExp("^" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z0-9_])", "i").test(rest)
      );
      if (keyword) {
        const value = rest.slice(0, keyword.length);
        const kind = /^(WIN|FAIL|NOOB|NUMBR|NUMBAR|YARN|TROOF|BUKKIT)$/i.test(keyword)
          ? "type"
          : "keyword";
        tokens.push({ text: value, kind });
        pos += value.length;
        continue;
      }

      const word = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
      if (word) {
        tokens.push({ text: word[0], kind: "variable" });
        pos += word[0].length;
        continue;
      }

      tokens.push({ text: line[pos++] });
    }
    if (lineIndex < lines.length - 1) tokens.push({ text: "\n" });
  }

  return tokens;
}

const ROCKSTAR_KEYWORDS = new Set([
  "say", "put", "into", "build", "knock", "split", "join", "let",
  "be", "is", "are", "was", "were", "am", "has", "have", "likes",
  "wants", "takes", "gives", "with", "if", "else", "while", "until",
  "continue", "break", "return", "roll", "cast", "listen", "whisper",
  "shout", "scream", "true", "false", "null", "empty", "mysterious",
  "nothing", "nobody", "nowhere", "right", "wrong", "and", "or", "not"
]);

function tokenizeRockstar(source: string): Token[] {
  const tokens: Token[] = [];

  const lines = source.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let pos = 0;
    while (pos < line.length) {
      const rest = line.slice(pos);
      if (/^\s/.test(rest)) {
        const m = /^\s+/.exec(rest)![0];
        tokens.push({ text: m });
        pos += m.length;
      } else if (rest[0] === "'" || rest[0] === '"') {
        const quote = rest[0];
        const end = rest.indexOf(quote, 1);
        const length = end < 0 ? rest.length : end + 1;
        tokens.push({ text: rest.slice(0, length), kind: "string" });
        pos += length;
      } else if (rest[0] === "(") {
        tokens.push({ text: rest, kind: "comment" });
        pos = line.length;
      } else {
        const word = /^[A-Za-z]+(?:'[A-Za-z]+)*/.exec(rest);
        if (word) {
          const value = word[0];
          const lower = value.toLowerCase();
          const kind = ROCKSTAR_KEYWORDS.has(lower)
            ? (/^(true|false|null|empty|mysterious|nothing|nobody|nowhere|right|wrong)$/i.test(value)
              ? "constant" : "keyword")
            : "variable";
          tokens.push({ text: value, kind });
          pos += value.length;
        } else {
          const number = /^\d+(?:\.\d+)?/.exec(rest);
          if (number) {
            tokens.push({ text: number[0], kind: "number" });
            pos += number[0].length;
          } else {
            tokens.push({ text: line[pos++] });
          }
        }
      }
    }
    if (lineIndex < lines.length - 1) tokens.push({ text: "\n" });
  }
  return tokens;
}

const SHAKESPEARE_KEYWORDS = [
  "Enter", "Exit", "Exeunt", "Act", "Scene", "Speak your mind",
  "Open your heart", "Let us", "You are", "I am", "Are you",
  "Am I", "Recall", "Remember", "If", "Let", "As", "Thou",
  "The", "First", "Second", "Third", "Fourth", "Fifth",
  "Sixth", "Seventh", "You", "I", "We", "they"
].sort((a, b) => b.length - a.length);

function tokenizeShakespeare(source: string): Token[] {
  const tokens: Token[] = [];
  const lines = source.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let pos = 0;
    while (pos < line.length) {
      const rest = line.slice(pos);
      if (rest[0] === "[") {
        const end = rest.indexOf("]");
        const length = end < 0 ? rest.length : end + 1;
        tokens.push({ text: rest.slice(0, length), kind: "comment" });
        pos += length;
      } else if (/^\s/.test(rest)) {
        const m = /^\s+/.exec(rest)![0];
        tokens.push({ text: m });
        pos += m.length;
      } else {
        const keyword = SHAKESPEARE_KEYWORDS.find((word) =>
          new RegExp("^" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(rest)
        );
        if (keyword) {
          const value = rest.slice(0, keyword.length);
          const kind = /^(Act|Scene|Enter|Exit|Exeunt)$/i.test(keyword)
            ? "annotation" : "keyword";
          tokens.push({ text: value, kind });
          pos += value.length;
        } else if (/^[A-Z][A-Z0-9_]*\b/.test(rest)) {
          const m = /^[A-Z][A-Z0-9_]*\b/.exec(rest)![0];
          tokens.push({ text: m, kind: "function" });
          pos += m.length;
        } else if (/^[+-]?\d+/.test(rest)) {
          const m = /^[+-]?\d+/.exec(rest)![0];
          tokens.push({ text: m, kind: "number" });
          pos += m.length;
        } else if (/^\w+/.test(rest)) {
          // Consume the whole word so keywords don't match inside it.
          const m = /^\w+/.exec(rest)![0];
          tokens.push({ text: m });
          pos += m.length;
        } else {
          tokens.push({ text: line[pos++] });
        }
      }
    }
    if (lineIndex < lines.length - 1) tokens.push({ text: "\n" });
  }
  return tokens;
}

const INTERCAL_STATEMENTS = [
  "ABSTAIN FROM", "ABSTAIN", "REINSTATE", "COME FROM", "NEXT FROM",
  "NEXT", "FORGET", "RESUME", "STASH", "RETRIEVE", "IGNORE",
  "REMEMBER", "GIVE UP", "READ OUT", "WRITE IN", "TRY AGAIN",
  "GO BACK", "GO AHEAD", "WHILE", "ONCE", "AGAIN"
].sort((a, b) => b.length - a.length);

const INTERCAL_GERUNDS = [
  "CALCULATING", "NEXTING FROM", "NEXTING", "FORGETTING", "RESUMING",
  "STASHING", "RETRIEVING", "IGNORING", "REMEMBERING", "ABSTAINING",
  "REINSTATING", "READING OUT", "WRITING IN", "COMING FROM",
  "GIVING UP", "TRYING AGAIN", "GOING BACK", "GOING AHEAD", "COMMENTING"
].sort((a, b) => b.length - a.length);

function intercalWords(words: string[]): RegExp {
  return new RegExp("^(?:" + words.map((w) => w.replace(/ /g, "\\s+")).join("|") + ")\\b", "i");
}

const INTERCAL_STATEMENT = intercalWords(INTERCAL_STATEMENTS);
const INTERCAL_GERUND = intercalWords(INTERCAL_GERUNDS);
// Statement identifier: DO, PLEASE, PLEASE DO, optionally MAYBE and NOT / N'T
const INTERCAL_IDENTIFIER = /^(?:MAYBE\s+)?(?:PLEASE(?:\s+DO)?|DO)(?:N'T|\s+NOT)?\b/i;
const INTERCAL_LINE_START = /^\s*(?:\(\d+\)\s*)?(?:MAYBE\s+)?(?:PLEASE|DO)\b/i;
const INTERCAL_UNARY = "&V?∀¥∨";

function tokenizeIntercal(source: string): Token[] {
  const tokens: Token[] = [];
  // Unparseable statements (e.g. PLEASE NOTE ...) are comments and run on
  // until the next statement identifier.
  let comment = false;

  const lines = source.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let pos = 0;
    if (comment && !INTERCAL_LINE_START.test(line)) {
      if (line) tokens.push({ text: line, kind: "comment" });
      pos = line.length;
    } else {
      comment = false;
    }
    while (pos < line.length) {
      const rest = line.slice(pos);
      let m: RegExpExecArray | null;
      if ((m = /^\s+/.exec(rest))) {
        tokens.push({ text: m[0] });
        pos += m[0].length;
      } else if ((m = /^\(\d+\)/.exec(rest))) {
        tokens.push({ text: m[0], kind: "tag" });
        pos += m[0].length;
      } else if ((m = INTERCAL_IDENTIFIER.exec(rest))) {
        tokens.push({ text: m[0], kind: "annotation" });
        pos += m[0].length;
        const chance = /^(\s*)(%\d+)/.exec(line.slice(pos));
        if (chance) {
          if (chance[1]) tokens.push({ text: chance[1] });
          tokens.push({ text: chance[2], kind: "meta" });
          pos += chance[0].length;
        }
        const body = line.slice(pos);
        const lead = /^\s*/.exec(body)![0];
        const statement = body.slice(lead.length);
        if (
          statement &&
          !INTERCAL_STATEMENT.test(statement) &&
          !/^[.:,;#'"(]/.test(statement)
        ) {
          if (lead) tokens.push({ text: lead });
          tokens.push({ text: statement, kind: "comment" });
          pos = line.length;
          comment = true;
        }
      } else if ((m = new RegExp(`^([.:,;#])([${INTERCAL_UNARY}]?)(\\d+)`).exec(rest))) {
        const kind = m[1] === "#" ? "number" : "variable";
        if (m[2]) {
          tokens.push({ text: m[1], kind });
          tokens.push({ text: m[2], kind: "operator" });
          tokens.push({ text: m[3], kind });
        } else {
          tokens.push({ text: m[0], kind });
        }
        pos += m[0].length;
      } else if ((m = new RegExp(`^(['"])([${INTERCAL_UNARY}]?)`).exec(rest))) {
        tokens.push({ text: m[1], kind: "bracket" });
        if (m[2]) tokens.push({ text: m[2], kind: "operator" });
        pos += m[0].length;
      } else if ((m = /^(?:<-|[$¢~+]|(?:SUB|BY)\b)/i.exec(rest))) {
        tokens.push({ text: m[0], kind: "operator" });
        pos += m[0].length;
      } else if ((m = INTERCAL_STATEMENT.exec(rest))) {
        tokens.push({ text: m[0], kind: "keyword" });
        pos += m[0].length;
      } else if ((m = INTERCAL_GERUND.exec(rest))) {
        tokens.push({ text: m[0], kind: "type" });
        pos += m[0].length;
      } else if ((m = /^\d+/.exec(rest))) {
        tokens.push({ text: m[0], kind: "number" });
        pos += m[0].length;
      } else if ((m = /^[A-Za-z]+/.exec(rest))) {
        tokens.push({ text: m[0] });
        pos += m[0].length;
      } else {
        tokens.push({ text: line[pos++] });
      }
    }
    if (lineIndex < lines.length - 1) tokens.push({ text: "\n" });
  }
  return tokens;
}

function tokenizeWhitespace(source: string): Token[] {
  return [...source].map((ch) => {
    if (ch === " ") return { text: ch, kind: "ws-space" };
    if (ch === "\t") return { text: ch, kind: "ws-tab" };
    return { text: ch };
  });
}

function tokenize(source: string, language: string): Token[] {
  switch (language) {
    case "chef": return tokenizeChef(source);
    case "brainfuck":
    case "bf": return tokenizeBrainfuck(source);
    case "befunge":
    case "befunge93":
    case "b93": return tokenizeBefunge(source);
    case "lolcode":
    case "lol": return tokenizeLolcode(source);
    case "rockstar": return tokenizeRockstar(source);
    case "shakespeare":
    case "spl": return tokenizeShakespeare(source);
    case "intercal":
    case "i": return tokenizeIntercal(source);
    case "whitespace":
    case "ws": return tokenizeWhitespace(source);
    default: return [{ text: source }];
  }
}

function installStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .esolang-token-function    { color: #dcdcaa; }
    .esolang-token-annotation { color: #569cd6; }
    .esolang-token-comment    { color: #6a9955; }
    .esolang-token-number     { color: #b5cea8; }
    .esolang-token-type       { color: #4ec9b0; }
    .esolang-token-keyword    { color: #c586c0; }
    .esolang-token-tag        { color: #9cdcfe; }
    .esolang-token-meta       { color: #d7ba7d; }
    .esolang-token-operator   { color: #d16969; }
    .esolang-token-bracket    { color: #c586c0; }
    .esolang-token-string     { color: #ce9178; }
    .esolang-token-variable   { color: #9cdcfe; }
    .esolang-token-constant   { color: #569cd6; }
    .esolang-token-ws-space   { background: #f4a3a8; }
    .esolang-token-ws-tab     { background: #9999ff; }
    pre code[class*="language-"] { white-space: pre !important; }
  `;
  document.head.appendChild(style);
}

function highlightBlock(code: HTMLElement, language: string): void {
  const marker = `esolangHighlighted${language}`;
  if (code.dataset[marker] === "true") return;

  const fragment = document.createDocumentFragment();
  for (const token of tokenize(code.textContent ?? "", language)) {
    if (!token.kind) {
      fragment.appendChild(document.createTextNode(token.text));
    } else {
      const span = document.createElement("span");
      span.className = `esolang-token-${token.kind}`;
      span.textContent = token.text;
      fragment.appendChild(span);
    }
  }
  code.replaceChildren(fragment);
  code.dataset[marker] = "true";
}

function highlightAll(): void {
  installStyles();
  document.querySelectorAll<HTMLElement>(
    ".jp-RenderedHTMLCommon pre code[class*='language-'], " +
    ".jp-OutputArea pre code[class*='language-'], " +
    "pre code[class*='language-']"
  ).forEach((code) => {
    const match = [...code.classList].find((name) =>
      name.startsWith("language-")
    );
    if (!match) return;
    const language = match.slice("language-".length).toLowerCase();
    const supported = [
      "chef", "brainfuck", "bf", "befunge", "befunge93", "b93",
      "lolcode", "lol", "rockstar", "shakespeare", "spl",
      "intercal", "i", "whitespace", "ws"
    ];
    if (supported.includes(language)) highlightBlock(code, language);
  });
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-esolang-highlighter:plugin",
  description: "Syntax highlighting for Chef and other esoteric languages in Markdown output",
  autoStart: true,
  activate: (_app: JupyterFrontEnd): void => {
    highlightAll();
    const observer = new MutationObserver(() => highlightAll());
    observer.observe(document.body, { childList: true, subtree: true });
  }
};

export default plugin;

