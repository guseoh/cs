var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SmartTypographyPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");

// src/context.ts
var FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
var TAG_START = /^<\/?[A-Za-z][A-Za-z0-9-]*(?=[\s/>]|$)/;
var URL_START = /^<?https?:\/\//;
function protectedRegionAt(text) {
  const lineStart = text.lastIndexOf("\n") + 1;
  const block = blockStateAt(text, lineStart);
  if (block.region)
    return block.region;
  let line = text.slice(lineStart);
  if (block.openSpan !== null) {
    const end = line.indexOf(block.openSpan);
    if (end === -1)
      return block.openSpan === "%>" ? "template" : "html-comment";
    line = line.slice(end + block.openSpan.length);
  }
  return inlineRegionAt(line);
}
function blockStateAt(text, lineStart) {
  const lines = text.slice(0, lineStart).split("\n");
  let inFrontmatter = lines.length > 0 && lines[0] === "---";
  let fence = null;
  let inMathBlock = false;
  let openSpan = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (openSpan !== null) {
      openSpan = openSpanAfter(line, openSpan);
      continue;
    }
    if (inFrontmatter && i > 0 && line === "---") {
      inFrontmatter = false;
      continue;
    }
    if (inFrontmatter)
      continue;
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (fence === null) {
        fence = marker;
        continue;
      }
      if (marker[0] === fence[0] && marker.length >= fence.length && fenceMatch[2].trim() === "") {
        fence = null;
      }
      continue;
    }
    if (fence !== null)
      continue;
    if (line.trim() === "$$") {
      inMathBlock = !inMathBlock;
      continue;
    }
    if (!inMathBlock)
      openSpan = openSpanAfter(line, null);
  }
  let region = null;
  if (inFrontmatter)
    region = "frontmatter";
  else if (fence !== null)
    region = "code-block";
  else if (inMathBlock)
    region = "math-block";
  return { region, openSpan };
}
function openSpanAfter(line, open) {
  var _a;
  let i = 0;
  while (i < line.length) {
    if (open !== null) {
      const end = line.indexOf(open, i);
      if (end === -1)
        return open;
      i = end + open.length;
      open = null;
      continue;
    }
    if (line[i] === "`") {
      const run = runLength(line, i, "`");
      i = (_a = endOf(line, i + run, "`".repeat(run))) != null ? _a : i + run;
      continue;
    }
    if (line.startsWith("<!--", i)) {
      open = "-->";
      i += 4;
      continue;
    }
    if (line.startsWith("<%", i)) {
      open = "%>";
      i += 2;
      continue;
    }
    i++;
  }
  return open;
}
function inlineRegionAt(line) {
  let i = 0;
  while (i < line.length) {
    if (line.startsWith("<!--", i)) {
      const end = endOf(line, i + 4, "-->");
      if (end === null)
        return "html-comment";
      i = end;
      continue;
    }
    if (line.startsWith("<%", i)) {
      const end = endOf(line, i + 2, "%>");
      if (end === null)
        return "template";
      i = end;
      continue;
    }
    if (TAG_START.test(line.slice(i))) {
      const end = endOf(line, i + 1, ">");
      if (end === null)
        return "html-tag";
      i = end;
      continue;
    }
    if (line.startsWith("[[", i)) {
      const end = endOf(line, i + 2, "]]");
      if (end === null)
        return "wikilink";
      i = end;
      continue;
    }
    if (line.startsWith("](", i)) {
      const end = endOf(line, i + 2, ")");
      if (end === null)
        return "link-target";
      i = end;
      continue;
    }
    if (line[i] === "`") {
      const run = runLength(line, i, "`");
      const end = endOf(line, i + run, "`".repeat(run));
      if (end === null)
        return "inline-code";
      i = end;
      continue;
    }
    if (line[i] === "$") {
      const run = runLength(line, i, "$");
      const end = endOf(line, i + run, "$".repeat(run));
      if (end !== null) {
        i = end;
        continue;
      }
      if (run === 1 && !opensMath(line, i)) {
        i++;
        continue;
      }
      return "math";
    }
    if (URL_START.test(line.slice(i))) {
      const rest = line.slice(i);
      const space = rest.search(/\s|>/);
      if (space === -1)
        return "url";
      i += space;
      continue;
    }
    i++;
  }
  return null;
}
function opensMath(line, at) {
  const next = line[at + 1];
  if (next === void 0)
    return false;
  return !/[\s\d]/.test(next);
}
function runLength(line, from, char) {
  let n = 0;
  while (line[from + n] === char)
    n++;
  return n;
}
function endOf(line, from, closer) {
  const at = line.indexOf(closer, from);
  return at === -1 ? null : at + closer.length;
}

// src/custom.ts
var SEPARATOR = " -> ";
function problemWith(sequence, replacement) {
  if (sequence.includes("\n") || sequence.includes("\r"))
    return "the sequence contains a line break";
  if (sequence.length === 0)
    return "the sequence is empty";
  if (sequence.trim().length === 0)
    return "the sequence is only spaces";
  if ([...sequence].length < 2)
    return "the sequence needs at least two characters";
  if (/[\uDC00-\uDFFF]$/.test(sequence))
    return "the sequence ends with an emoji or similar character";
  if (replacement.includes("\n") || replacement.includes("\r"))
    return "the replacement contains a line break";
  if (replacement.length === 0)
    return "the replacement is empty";
  if (replacement === sequence)
    return "the replacement is the same as the sequence";
  return null;
}
function compileCustomRules(setting) {
  const ignored = [];
  const parsed = [];
  const seen = /* @__PURE__ */ new Map();
  setting.split("\n").forEach((raw, index) => {
    const line = index + 1;
    const text = raw.replace(/\r$/, "");
    if (text.trim().length === 0)
      return;
    const at = text.indexOf(SEPARATOR);
    if (at === -1) {
      ignored.push({ line, text, reason: `no "${SEPARATOR.trim()}" between the sequence and the replacement` });
      return;
    }
    const sequence = text.slice(0, at).trim() || text.slice(0, at);
    const replacement = text.slice(at + SEPARATOR.length).trim();
    const problem = problemWith(sequence, replacement);
    if (problem !== null) {
      ignored.push({ line, text, reason: problem });
      return;
    }
    const earlier = seen.get(sequence);
    if (earlier !== void 0) {
      ignored.push({ line, text, reason: `the same sequence is already on line ${earlier}` });
      return;
    }
    seen.set(sequence, line);
    parsed.push({ sequence, replacement, line });
  });
  const rules = [];
  const byLength = [...parsed].sort((a, b) => [...a.sequence].length - [...b.sequence].length);
  for (const { sequence, replacement, line } of byLength) {
    const typed = sequence.slice(-1);
    const before = replay(sequence.slice(0, -1), rules);
    const clash = rules.find((r) => r.before === before && r.typed === typed);
    if (clash) {
      ignored.push({
        line,
        text: `${sequence}${SEPARATOR}${replacement}`,
        reason: `the rule on line ${clash.line} already fires on the same keystrokes`
      });
      continue;
    }
    rules.push({ before, typed, insert: replacement, literal: sequence, line });
  }
  rules.sort((a, b) => a.line - b.line);
  ignored.sort((a, b) => a.line - b.line);
  return { rules, ignored };
}
function replay(keys, rules) {
  let out = "";
  for (const typed of keys) {
    const rule = longestMatch(out, typed, rules, () => true);
    out = rule ? out.slice(0, out.length - rule.before.length) + rule.insert : out + typed;
  }
  return out;
}
function matchCustomRule(before, lineBefore, typed, rules) {
  return longestMatch(before, typed, rules, (rule) => notBlockquoteMarker(rule, lineBefore, typed));
}
function longestMatch(before, typed, rules, allowed) {
  let best = null;
  for (const rule of rules) {
    if (rule.typed !== typed)
      continue;
    if (!before.endsWith(rule.before))
      continue;
    if (best !== null && rule.before.length <= best.before.length)
      continue;
    if (!allowed(rule))
      continue;
    best = rule;
  }
  return best;
}
function notBlockquoteMarker(rule, lineBefore, typed) {
  if (typed !== ">")
    return true;
  return !/^[\s>]*$/.test(lineBefore);
}
function customTriggers(rules) {
  return new Set(rules.map((rule) => rule.typed));
}
var cache = null;
function customRulesFor(setting) {
  if (cache === null || cache.setting !== setting) {
    cache = { setting, compiled: compileCustomRules(setting) };
  }
  return cache.compiled;
}
var PRESETS = [
  {
    id: "guillemets",
    label: "Guillemets << >>",
    rules: [
      ["<<", "\xAB"],
      [">>", "\xBB"]
    ]
  },
  {
    id: "symbols",
    label: "Symbols (c) (r) (tm)",
    rules: [
      ["(c)", "\xA9"],
      ["(r)", "\xAE"],
      ["(tm)", "\u2122"]
    ]
  }
];
function addPreset(setting, preset) {
  const present = /* @__PURE__ */ new Set();
  for (const raw of setting.split("\n")) {
    const at = raw.indexOf(SEPARATOR);
    if (at !== -1)
      present.add(raw.slice(0, at).trim());
  }
  const lines = preset.rules.filter(([sequence]) => !present.has(sequence)).map(([sequence, replacement]) => `${sequence}${SEPARATOR}${replacement}`);
  if (lines.length === 0)
    return { setting, added: 0 };
  const base = setting.replace(/\s+$/, "");
  return { setting: (base ? base + "\n" : "") + lines.join("\n"), added: lines.length };
}

// src/capitalize.ts
var WORD_CHARACTER = /[\p{L}\p{N}]/u;
function isLowercaseLetter(typed) {
  if (typed.length !== 1 || !/^\p{Ll}$/u.test(typed))
    return false;
  return typed.toUpperCase().length === 1;
}
var ABBREVIATIONS = /* @__PURE__ */ new Set([
  "no",
  "nos",
  "co",
  "al",
  "ca",
  "mr",
  "mrs",
  "ms",
  "mx",
  "dr",
  "prof",
  "sr",
  "jr",
  "sra",
  "srta",
  "lic",
  "ing",
  "dra",
  "vs",
  "etc",
  "cf",
  "viz",
  "approx",
  "dept",
  "inc",
  "ltd",
  "corp",
  "est",
  "fig",
  "figs",
  "eq",
  "eqs",
  "vol",
  "vols",
  "pp",
  "ch",
  "sec",
  "ed",
  "eds",
  "rev",
  "gen",
  "col",
  "gov",
  "sen",
  "rep",
  "capt",
  "lt",
  "sgt",
  "cpl",
  "maj",
  "cmdr",
  "hon",
  "st",
  "mt",
  "ft",
  "ave",
  "blvd",
  "jan",
  "feb",
  "mar",
  "apr",
  "jun",
  "jul",
  "aug",
  "sep",
  "sept",
  "oct",
  "nov",
  "dec",
  "ph.d",
  "a.m",
  "p.m",
  "i.e",
  "e.g",
  "u.s",
  "u.k",
  "u.n",
  "e.u"
]);
var CAPITAL_ONLY = /* @__PURE__ */ new Set(["no", "nos", "co", "ca", "sec", "est", "ch", "st", "col", "gen", "rep", "rev", "ed", "mar", "sep", "may", "jan", "dec", "oct", "nov", "feb", "apr", "jun", "jul", "aug", "ing", "inc", "lt", "mt", "ft", "sen", "gov", "hon", "maj", "cpl", "eq", "fig"]);
var CLOSERS = `)\\]}"'\u201D\u2019\xBB\u203A*_~=`;
var OPENERS = `("'\u201C\u2018\xAB\u2039\u201E\u201A*_~=`;
var AFTER_TERMINATOR = new RegExp(
  `([.!?\u203D])[${CLOSERS.replace(/[\]\\]/g, "\\$&")}]*[ \\u00A0]+[${OPENERS.replace(/[\]\\]/g, "\\$&")}]*$`
);
var ONLY_OPENERS = new RegExp(`^[${OPENERS.replace(/[\]\\]/g, "\\$&")}]*$`);
function stripPrefix(line) {
  var _a, _b;
  let rest = line;
  let sawMarker = false;
  let inList = false;
  for (let guard = 0; guard < 12; guard++) {
    let m;
    if (m = /^[ \t]*>[ \t]?/.exec(rest)) {
      rest = rest.slice(m[0].length);
      sawMarker = true;
      inList = false;
    } else if (m = /^[ \t]*(?:[-*+]|\d{1,9}[.)])[ \t]+/.exec(rest)) {
      rest = rest.slice(m[0].length);
      sawMarker = true;
      inList = true;
    } else if (inList && (m = /^\[.\][ \t]+/.exec(rest))) {
      rest = rest.slice(m[0].length);
      inList = false;
    } else if (m = /^[ \t]*#{1,6}[ \t]+/.exec(rest)) {
      rest = rest.slice(m[0].length);
      sawMarker = true;
      break;
    } else
      break;
  }
  if (!sawMarker) {
    const indent = (_b = (_a = /^[ \t]*/.exec(rest)) == null ? void 0 : _a[0]) != null ? _b : "";
    if (indent.includes("	") || indent.length >= 4)
      return { rest, prose: false };
    rest = rest.slice(indent.length);
  } else {
    rest = rest.replace(/^[ \t]+/, "");
  }
  return { rest, prose: true };
}
function fullStopEndsSentence(head) {
  var _a;
  const token = (_a = /(\S+)$/.exec(head)) == null ? void 0 : _a[1];
  if (token === void 0)
    return false;
  const word = token.replace(/^[([{"'“‘«‹„‚*_~=<]+/, "");
  if (word === "")
    return false;
  if (word.endsWith("."))
    return false;
  if (/^[\d.,]+$/.test(word))
    return false;
  if (/^\p{L}$/u.test(word))
    return false;
  if (/^(\p{L}\.)+\p{L}$/u.test(word))
    return false;
  const lower = word.toLowerCase();
  if (ABBREVIATIONS.has(lower) && !(CAPITAL_ONLY.has(lower) && word[0] === word[0].toLowerCase())) {
    return false;
  }
  if (/\d\.\d/.test(word) || /[/\\@]/.test(word) || /\p{L}\p{N}*\.\p{L}/u.test(word))
    return false;
  return true;
}
function startsSentence(lineBefore) {
  const { rest, prose } = stripPrefix(lineBefore);
  if (!prose)
    return false;
  if (ONLY_OPENERS.test(rest))
    return true;
  const m = AFTER_TERMINATOR.exec(rest);
  if (!m)
    return false;
  const head = rest.slice(0, m.index);
  if (head.trim() === "")
    return false;
  if (m[1] === ".") {
    if (!fullStopEndsSentence(head))
      return false;
  } else if (/\s$/.test(head)) {
    return false;
  }
  return true;
}
function capitalizeInsert(lineBefore, after, typed) {
  if (!isLowercaseLetter(typed))
    return null;
  if (after !== "" && WORD_CHARACTER.test(after[0]))
    return null;
  if (!startsSentence(lineBefore))
    return null;
  return typed.toUpperCase();
}
function urlStart(lineBefore) {
  const m = /H(ttps?:)$/.exec(lineBefore);
  if (!m)
    return null;
  return startsSentence(lineBefore.slice(0, m.index)) ? m.index : null;
}

// src/rules.ts
var hyphensAreProse = (lineBefore) => {
  const body = lineBefore.replace(/^\s*(?:>\s*)*/, "");
  if (/^-*$/.test(body))
    return false;
  if (body.includes("|") && /^[\s|:-]*$/.test(body))
    return false;
  return !lineBefore.endsWith("<!-");
};
var RULES = [
  // ...
  { before: "..", typed: ".", insert: "\u2026", literal: "...", group: "ellipsis" },
  // -- and ---
  {
    before: "\u2013",
    typed: "-",
    insert: "\u2014",
    literal: "---",
    group: "dashes",
    guard: hyphensAreProse
  },
  {
    before: "-",
    typed: "-",
    insert: "\u2013",
    literal: "--",
    group: "dashes",
    guard: hyphensAreProse
  },
  // >= != /= +- +/-
  { before: "+/", typed: "-", insert: "\xB1", literal: "+/-", group: "math" },
  { before: ">", typed: "=", insert: "\u2265", literal: ">=", group: "math" },
  { before: "<", typed: "=", insert: "\u2264", literal: "<=", group: "math" },
  { before: "!", typed: "=", insert: "\u2260", literal: "!=", group: "math" },
  { before: "/", typed: "=", insert: "\u2260", literal: "/=", group: "math" },
  { before: "+", typed: "-", insert: "\xB1", literal: "+-", group: "math" },
  // Arrows. The three that chain off a character this table produced come
  // first, because their `before` is one of those characters.
  { before: "\u2190", typed: ">", insert: "\u2194", literal: "<->", group: "arrows" },
  { before: "\u2264", typed: ">", insert: "\u21D4", literal: "<=>", group: "arrows" },
  { before: "\u21D0", typed: ">", insert: "\u21D4", literal: "<=>", group: "arrows" },
  { before: "\u2264", typed: "=", insert: "\u21D0", literal: "<==", group: "arrows" },
  { before: "\u2190", typed: "-", insert: "\u2190", literal: "<--", group: "arrows" },
  // `--` has already become an en dash by the time the `>` arrives, so
  // `-->` reaches this rule and not the one below it.
  { before: "\u2013", typed: ">", insert: "\u2192", literal: "-->", group: "arrows" },
  { before: "\u2014", typed: ">", insert: "\u2192", literal: "--->", group: "arrows" },
  { before: "-", typed: ">", insert: "\u2192", literal: "->", group: "arrows" },
  { before: "=", typed: ">", insert: "\u21D2", literal: "=>", group: "arrows" },
  { before: "<", typed: "-", insert: "\u2190", literal: "<-", group: "arrows" },
  // Only reached when the maths group is off; otherwise `<=` is U+2264.
  { before: "<", typed: "=", insert: "\u21D0", literal: "<=", group: "arrows" }
];
function matchRule(before, lineBefore, typed, enabled) {
  for (const rule of RULES) {
    if (rule.typed !== typed)
      continue;
    if (!enabled(rule.group))
      continue;
    if (!before.endsWith(rule.before))
      continue;
    if (rule.guard && !rule.guard(lineBefore))
      continue;
    return rule;
  }
  return null;
}

// src/settings.ts
var APOSTROPHE = "\u2019";
var QUOTE_CONVENTIONS = [
  {
    id: "english",
    label: "English \u201C \u201D \u2018 \u2019",
    doubleOpen: "\u201C",
    doubleClose: "\u201D",
    singleOpen: "\u2018",
    singleClose: "\u2019",
    padding: ""
  },
  {
    id: "german",
    label: "German \u201E \u201C \u201A \u2018",
    doubleOpen: "\u201E",
    doubleClose: "\u201C",
    singleOpen: "\u201A",
    singleClose: "\u2018",
    padding: ""
  },
  {
    id: "french",
    label: "French \xAB \xBB \u2039 \u203A",
    doubleOpen: "\xAB",
    doubleClose: "\xBB",
    singleOpen: "\u2039",
    singleClose: "\u203A",
    // U+00A0, not the narrow U+202F: plenty of fonts still have no glyph
    // for the narrow one, and a missing glyph in body text is worse than a
    // slightly wide space.
    padding: "\xA0"
  },
  {
    id: "spanish",
    label: "Spanish \xAB \xBB \u201C \u201D",
    doubleOpen: "\xAB",
    doubleClose: "\xBB",
    singleOpen: "\u201C",
    singleClose: "\u201D",
    padding: ""
  },
  {
    id: "swedish",
    label: "Swedish \u201D \u201D \u2019 \u2019",
    doubleOpen: "\u201D",
    doubleClose: "\u201D",
    singleOpen: "\u2019",
    singleClose: "\u2019",
    padding: ""
  },
  {
    id: "polish",
    label: "Polish \u201E \u201D \u201A \u2019",
    doubleOpen: "\u201E",
    doubleClose: "\u201D",
    singleOpen: "\u201A",
    singleClose: "\u2019",
    padding: ""
  },
  {
    id: "russian",
    label: "Russian \xAB \xBB \u201E \u201C",
    doubleOpen: "\xAB",
    doubleClose: "\xBB",
    singleOpen: "\u201E",
    singleClose: "\u201C",
    padding: ""
  }
];
var DEFAULT_SETTINGS = {
  quoteStyle: "english",
  smartApostrophes: true,
  dashes: true,
  ellipsis: true,
  arrows: true,
  mathSymbols: true,
  skipClosingQuote: true,
  excludedFolders: "",
  customRules: "",
  capitalizeSentences: false,
  tabOut: true,
  wrapSelection: true,
  presetPrompted: false
};
function conventionFor(id) {
  var _a;
  return (_a = QUOTE_CONVENTIONS.find((c) => c.id === id)) != null ? _a : null;
}

// src/substitute.ts
var OPENS_AFTER = /[\s\u00A0([{<>*_~\-–—…"'“„«‹‘‚]/;
var WORD_CHARACTER2 = /[\p{L}\p{N}]/u;
function substitutionFor(before, after, typed, settings) {
  if (!mightSubstitute(typed, settings))
    return null;
  const action = candidateFor(before, after, typed, settings);
  if (action === null || protectedRegionAt(before) !== null)
    return null;
  if (action.kind === "replace" && action.rule === "custom" && protectedRegionAt(before.slice(0, action.from)) !== null) {
    return null;
  }
  return action;
}
var TRIGGERS = /* @__PURE__ */ new Set(['"', "'", ..."0123456789", ...RULES.map((rule) => rule.typed)]);
function mightSubstitute(typed, settings) {
  if (typed.length !== 1)
    return false;
  if (TRIGGERS.has(typed))
    return true;
  if ((settings == null ? void 0 : settings.capitalizeSentences) && (typed === "/" || isLowercaseLetter(typed)))
    return true;
  if (!(settings == null ? void 0 : settings.customRules))
    return false;
  return customTriggers(customRulesFor(settings.customRules).rules).has(typed);
}
function candidateFor(before, after, typed, settings) {
  const action = ruleCandidateFor(before, after, typed, settings);
  if (action !== null || !settings.capitalizeSentences)
    return action;
  const lineBefore = before.slice(before.lastIndexOf("\n") + 1);
  return capitalizeAction(before, after, lineBefore, typed);
}
function ruleCandidateFor(before, after, typed, settings) {
  var _a;
  const pos = before.length;
  const convention = conventionFor(settings.quoteStyle);
  const lineBefore = before.slice(before.lastIndexOf("\n") + 1);
  if (typed === '"' || typed === "'") {
    return (_a = quoteAction(before, after, typed, settings, convention)) != null ? _a : customAction(before, after, lineBefore, typed, settings);
  }
  if (settings.smartApostrophes && convention && /[0-9]/.test(typed)) {
    const decade = decadeAction(before, typed, convention);
    if (decade)
      return decade;
  }
  const rule = matchRule(before, lineBefore, typed, (group) => groupEnabled(group, settings));
  if (!rule)
    return customAction(before, after, lineBefore, typed, settings);
  return {
    kind: "replace",
    from: pos - rule.before.length,
    to: pos,
    insert: rule.insert,
    literal: rule.literal,
    rule: rule.group
  };
}
function capitalizeAction(before, after, lineBefore, typed) {
  const pos = before.length;
  if (typed === "/") {
    const at = urlStart(lineBefore);
    if (at === null)
      return null;
    const written = lineBefore.slice(at);
    return {
      kind: "replace",
      from: pos - written.length,
      to: pos,
      insert: "h" + written.slice(1) + "/",
      literal: written + "/",
      rule: "capitalize-url"
    };
  }
  const insert = capitalizeInsert(lineBefore, after, typed);
  if (insert === null)
    return null;
  return { kind: "replace", from: pos, to: pos, insert, literal: typed, rule: "capitalize" };
}
function cannotCapitalize(typed, lineBefore, settings) {
  if (!settings.capitalizeSentences || !isLowercaseLetter(typed))
    return false;
  if (TRIGGERS.has(typed) || settings.customRules && mightSubstituteCustom(typed, settings))
    return false;
  return !startsSentence(lineBefore);
}
function mightSubstituteCustom(typed, settings) {
  return customTriggers(customRulesFor(settings.customRules).rules).has(typed);
}
function customAction(before, after, lineBefore, typed, settings) {
  if (!settings.customRules)
    return null;
  const rules = customRulesFor(settings.customRules).rules;
  const rule = matchCustomRule(before, lineBefore, typed, rules);
  if (!rule)
    return null;
  const pos = before.length;
  return {
    kind: "replace",
    from: pos - rule.before.length,
    to: pos + (autoPairedCloser(rule.before, after, typed) ? 1 : 0),
    insert: rule.insert,
    literal: rule.literal,
    rule: "custom"
  };
}
var OPENER = { ")": "(", "]": "[", "}": "{" };
function autoPairedCloser(sequenceBefore, after, typed) {
  const opener = OPENER[typed];
  if (opener === void 0 || !after.startsWith(typed))
    return false;
  const opened = sequenceBefore.split(opener).length - 1;
  const closed = sequenceBefore.split(typed).length - 1;
  return opened > closed;
}
function groupEnabled(group, settings) {
  switch (group) {
    case "dashes":
      return settings.dashes;
    case "ellipsis":
      return settings.ellipsis;
    case "arrows":
      return settings.arrows;
    case "math":
      return settings.mathSymbols;
  }
}
function quoteAction(before, after, typed, settings, convention) {
  const pos = before.length;
  const prev = pos > 0 ? before[pos - 1] : null;
  const closingAQuotation = convention !== null && convention.singleClose !== APOSTROPHE && singleQuoteIsOpen(before, convention);
  if (typed === "'" && settings.smartApostrophes && prev !== null && WORD_CHARACTER2.test(prev) && !closingAQuotation) {
    return {
      kind: "replace",
      from: pos,
      to: pos,
      insert: APOSTROPHE,
      literal: "'",
      rule: "apostrophe"
    };
  }
  if (!convention)
    return null;
  const open = typed === '"' ? convention.doubleOpen : convention.singleOpen;
  const close = typed === '"' ? convention.doubleClose : convention.singleClose;
  const pad = convention.padding;
  if (prev === null || OPENS_AFTER.test(prev)) {
    return {
      kind: "replace",
      from: pos,
      to: pos,
      insert: open + pad,
      literal: typed,
      rule: "quote-open"
    };
  }
  if (settings.skipClosingQuote) {
    for (const ahead of [pad + close, close]) {
      if (ahead.length > 0 && after.startsWith(ahead)) {
        return { kind: "skip", to: pos + ahead.length, rule: "quote-skip" };
      }
    }
  }
  return {
    kind: "replace",
    from: pos,
    to: pos,
    insert: pad + close,
    literal: typed,
    rule: "quote-close"
  };
}
function singleQuoteIsOpen(before, convention) {
  const line = before.slice(before.lastIndexOf("\n") + 1);
  return count(line, convention.singleOpen) > count(line, convention.singleClose);
}
function count(text, character) {
  let total = 0;
  for (const c of text)
    if (c === character)
      total++;
  return total;
}
function decadeAction(before, typed, convention) {
  const pos = before.length;
  if (before[pos - 1] !== convention.singleOpen)
    return null;
  const beforeQuote = pos >= 2 ? before[pos - 2] : null;
  if (beforeQuote !== null && !/[\s([{]/.test(beforeQuote))
    return null;
  return {
    kind: "replace",
    from: pos - 1,
    to: pos,
    insert: APOSTROPHE + typed,
    literal: "'" + typed,
    rule: "decade"
  };
}

// src/apply.ts
function typographize(text, settings, before = "") {
  const replay2 = { ...settings, skipClosingQuote: false };
  let out = before;
  for (let i = 0; i < text.length; i++) {
    const typed = text[i];
    const action = substitutionFor(out, "", typed, replay2);
    if ((action == null ? void 0 : action.kind) === "replace" && action.from >= before.length) {
      out = out.slice(0, action.from) + action.insert;
    } else {
      out += typed;
    }
  }
  return out.slice(before.length);
}
function changesBetween(original, result, offset = 0) {
  if (original === result)
    return [];
  const a = original.split("\n");
  const b = result.split("\n");
  if (a.length !== b.length) {
    return [{ from: offset, to: offset + original.length, insert: result }];
  }
  const changes = [];
  let pos = offset;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (x !== y) {
      let start = 0;
      while (start < x.length && start < y.length && x[start] === y[start])
        start++;
      let endX = x.length;
      let endY = y.length;
      while (endX > start && endY > start && x[endX - 1] === y[endY - 1]) {
        endX--;
        endY--;
      }
      changes.push({ from: pos + start, to: pos + endX, insert: y.slice(start, endY) });
    }
    pos += x.length + 1;
  }
  return changes;
}

// src/compose.ts
var LOOKAHEAD = 4;
function curlComposedQuotes(doc, from, to, settings) {
  const changes = [];
  let before = doc.slice(0, from);
  for (let pos = from; pos < to; pos++) {
    const typed = doc[pos];
    if (typed === '"' || typed === "'") {
      const after = doc.slice(pos + 1, pos + 1 + LOOKAHEAD);
      const action = substitutionFor(before, after, typed, settings);
      if ((action == null ? void 0 : action.kind) === "replace" && action.from === before.length && action.to === before.length) {
        changes.push({ from: pos, to: pos + 1, insert: action.insert });
        before += action.insert;
        continue;
      }
    }
    before += typed;
  }
  return changes;
}

// src/revert.ts
function revertFor(last, doc, selectionFrom, selectionTo) {
  if (last === null)
    return null;
  if (selectionFrom !== selectionTo)
    return null;
  if (selectionFrom !== last.to)
    return null;
  if (doc.slice(last.from, last.to) !== last.inserted)
    return null;
  if (last.inserted === last.literal)
    return null;
  return { from: last.from, to: last.to, insert: last.literal };
}

// src/scope.ts
var NOTE_PROPERTY = "typography";
function folderList(setting) {
  return setting.split(/\r?\n/).map((line) => line.trim().replace(/^\/+|\/+$/g, "")).filter((line) => line !== "");
}
function inFolder(path, folders) {
  return folders.some((folder) => path === folder || path.startsWith(folder + "/"));
}
function isOff(value) {
  if (value === false)
    return true;
  return typeof value === "string" && /^(off|false|no)$/i.test(value.trim());
}
var PROPERTY_LINE = new RegExp(`^${NOTE_PROPERTY}[ \\t]*:.*$`);
function frontMatter(text) {
  const open = /^---[ \t]*\r?\n/.exec(text);
  if (!open)
    return null;
  let at = open[0].length;
  while (at <= text.length) {
    const end = text.indexOf("\n", at);
    const line = text.slice(at, end === -1 ? text.length : end).replace(/\r$/, "");
    if (/^(---|\.\.\.)[ \t]*$/.test(line))
      return { bodyFrom: open[0].length, closeFrom: at };
    if (end === -1)
      return null;
    at = end + 1;
  }
  return null;
}
function noteIsOff(text) {
  const fm = frontMatter(text);
  if (!fm)
    return false;
  for (const line of text.slice(fm.bodyFrom, fm.closeFrom).split(/\r?\n/)) {
    if (PROPERTY_LINE.test(line))
      return isOff(line.slice(line.indexOf(":") + 1).replace(/^\s*(["']?)(.*?)\1\s*$/, "$2"));
  }
  return false;
}
function setNoteOff(text, off) {
  const fm = frontMatter(text);
  if (off) {
    if (!fm)
      return { from: 0, to: 0, insert: `---
${NOTE_PROPERTY}: off
---
` };
    let at2 = fm.bodyFrom;
    while (at2 < fm.closeFrom) {
      const end = text.indexOf("\n", at2);
      const line = text.slice(at2, end).replace(/\r$/, "");
      if (PROPERTY_LINE.test(line)) {
        return isOff(line.slice(line.indexOf(":") + 1).trim()) ? null : { from: at2, to: at2 + line.length, insert: `${NOTE_PROPERTY}: off` };
      }
      at2 = end + 1;
    }
    return { from: fm.closeFrom, to: fm.closeFrom, insert: `${NOTE_PROPERTY}: off
` };
  }
  if (!fm)
    return null;
  let at = fm.bodyFrom;
  while (at < fm.closeFrom) {
    const end = text.indexOf("\n", at);
    const line = text.slice(at, end).replace(/\r$/, "");
    if (PROPERTY_LINE.test(line)) {
      const others = text.slice(fm.bodyFrom, at) + text.slice(end + 1, fm.closeFrom);
      if (others.trim() === "") {
        const close = text.indexOf("\n", fm.closeFrom);
        return { from: 0, to: close === -1 ? text.length : close + 1, insert: "" };
      }
      return { from: at, to: end + 1, insert: "" };
    }
    at = end + 1;
  }
  return null;
}

// src/presets.ts
var STYLE_PRESETS = [
  {
    id: "default",
    label: "Default",
    desc: "Curly quotes, dashes, ellipsis, arrows and symbols. No automatic capitals.",
    values: {
      smartApostrophes: DEFAULT_SETTINGS.smartApostrophes,
      skipClosingQuote: DEFAULT_SETTINGS.skipClosingQuote,
      dashes: DEFAULT_SETTINGS.dashes,
      ellipsis: DEFAULT_SETTINGS.ellipsis,
      arrows: DEFAULT_SETTINGS.arrows,
      mathSymbols: DEFAULT_SETTINGS.mathSymbols,
      capitalizeSentences: DEFAULT_SETTINGS.capitalizeSentences,
      tabOut: DEFAULT_SETTINGS.tabOut,
      wrapSelection: DEFAULT_SETTINGS.wrapSelection
    }
  },
  {
    id: "writer",
    label: "Writer",
    desc: "Prose: curly quotes, dashes, ellipsis and a capital at the start of each sentence. No arrows or math symbols.",
    values: {
      smartApostrophes: true,
      skipClosingQuote: true,
      dashes: true,
      ellipsis: true,
      arrows: false,
      mathSymbols: false,
      capitalizeSentences: true,
      tabOut: true,
      wrapSelection: true
    }
  },
  {
    id: "academic",
    label: "Academic",
    desc: "Everything on, including arrows and math symbols, plus automatic capitals.",
    values: {
      smartApostrophes: true,
      skipClosingQuote: true,
      dashes: true,
      ellipsis: true,
      arrows: true,
      mathSymbols: true,
      capitalizeSentences: true,
      tabOut: true,
      wrapSelection: true
    }
  },
  {
    id: "developer",
    label: "Developer (quiet)",
    desc: "Straight quotes and plain hyphens stay as typed. Only arrows and math symbols are converted.",
    values: {
      quoteStyle: "off",
      smartApostrophes: false,
      skipClosingQuote: true,
      dashes: false,
      ellipsis: false,
      arrows: true,
      mathSymbols: true,
      capitalizeSentences: false,
      tabOut: true,
      wrapSelection: false
    }
  }
];
function applyStylePreset(settings, preset) {
  return { ...settings, ...preset.values };
}
function shouldPromptForPreset(stored) {
  if (stored === null || stored === void 0 || typeof stored !== "object")
    return true;
  return stored.presetPrompted === false;
}

// src/tabout.ts
var BRACKET_CLOSERS = [")", "]", "}", "\xBB"];
function quoteCount(text, ch) {
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== ch)
      continue;
    const between = i > 0 && i < text.length - 1 && /\p{L}/u.test(text[i - 1]) && /\p{L}/u.test(text[i + 1]);
    if (ch === "'" && between)
      continue;
    n++;
  }
  return n;
}
function count2(text, ch) {
  let n = 0;
  for (const c of text)
    if (c === ch)
      n++;
  return n;
}
function closerLength(lineBefore, after, settings) {
  if (after === "")
    return 0;
  const convention = conventionFor(settings.quoteStyle);
  if (convention && convention.padding !== "") {
    const padded = convention.padding;
    for (const close of [convention.doubleClose, convention.singleClose]) {
      if (after.startsWith(padded + close))
        return padded.length + close.length;
    }
  }
  const ch = after[0];
  if (BRACKET_CLOSERS.includes(ch))
    return 1;
  if (ch === '"' || ch === "'") {
    return quoteCount(lineBefore, ch) % 2 === 1 ? 1 : 0;
  }
  if (convention) {
    if (ch === convention.doubleClose && ch !== convention.doubleOpen)
      return 1;
    if (ch === convention.singleClose && ch !== convention.singleOpen) {
      if (ch === APOSTROPHE) {
        return count2(lineBefore, convention.singleOpen) > count2(lineBefore, ch) ? 1 : 0;
      }
      return 1;
    }
    if (ch === convention.doubleClose)
      return count2(lineBefore, ch) % 2 === 1 ? 1 : 0;
  }
  return 0;
}
function tabOutTarget(docBefore, after, settings) {
  if (!settings.tabOut)
    return null;
  const lineStart = docBefore.lastIndexOf("\n") + 1;
  const lineBefore = docBefore.slice(lineStart);
  const lineAfter = after.split("\n", 1)[0];
  const n = closerLength(lineBefore, lineAfter, settings);
  if (n === 0)
    return null;
  if (lineBefore.includes("|") || lineAfter.includes("|"))
    return null;
  if (/^[ \t]*(?:[-*+]|\d{1,9}[.)])[ \t]+(?:\[.\][ \t]+)?$/.test(lineBefore))
    return null;
  if (lineBefore.trim() === "")
    return null;
  if (protectedRegionAt(docBefore) !== null)
    return null;
  return docBefore.length + n;
}

// src/wrap.ts
var CLOSER_OF = {
  "\u201C": "\u201D",
  "\u2018": "\u2019",
  "\u201E": "\u201C",
  "\u201A": "\u2018",
  "\xAB": "\xBB",
  "\u2039": "\u203A"
};
function wrapFor(typed, settings) {
  if (!settings.wrapSelection)
    return null;
  const convention = conventionFor(settings.quoteStyle);
  if (typed === '"' || typed === "'") {
    if (!convention)
      return null;
    const pad2 = convention.padding;
    return typed === '"' ? { open: convention.doubleOpen + pad2, close: pad2 + convention.doubleClose } : { open: convention.singleOpen + pad2, close: pad2 + convention.singleClose };
  }
  const close = CLOSER_OF[typed];
  if (close === void 0)
    return null;
  const pad = convention && convention.doubleOpen === "\xAB" && typed === "\xAB" ? convention.padding : "";
  return { open: typed + pad, close: pad + close };
}

// main.ts
var LOOKAHEAD2 = 4;
var COMPOSITION_POLL = 400;
var rememberSubstitution = import_state.StateEffect.define();
var lastSubstitution = import_state.StateField.define({
  create: () => null,
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(rememberSubstitution))
        return effect.value;
    }
    return null;
  }
});
var SmartTypographyPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.showPresetPrompt = false;
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SmartTypographySettingTab(this.app, this));
    this.registerEditorExtension(this.editorExtension());
    if (this.showPresetPrompt) {
      this.showPresetPrompt = false;
      this.settings.presetPrompted = true;
      this.app.workspace.onLayoutReady(() => {
        new PresetModal(this.app, this).open();
        void this.saveSettings();
      });
    }
    this.addCommand({
      id: "toggle-note",
      name: "Turn substitutions off or on in this note",
      icon: "toggle-right",
      editorCallback: async (editor, ctx) => {
        const text = editor.getValue();
        const off = !noteIsOff(text);
        const fileManager = this.app.fileManager;
        if (ctx.file && typeof fileManager.processFrontMatter === "function") {
          await fileManager.processFrontMatter(ctx.file, (frontmatter) => {
            if (off)
              frontmatter[NOTE_PROPERTY] = "off";
            else
              delete frontmatter[NOTE_PROPERTY];
          });
        } else {
          const edit = setNoteOff(text, off);
          if (edit) {
            editor.transaction({
              changes: [{ from: editor.offsetToPos(edit.from), to: editor.offsetToPos(edit.to), text: edit.insert }]
            });
          }
        }
        const folder = ctx.file && inFolder(ctx.file.path, folderList(this.settings.excludedFolders));
        new import_obsidian.Notice(
          off ? "Typography: substitutions are off in this note." : folder ? "Typography: removed the property, but this note is in an excluded folder, so substitutions stay off." : "Typography: substitutions are on in this note."
        );
      }
    });
    this.addCommand({
      id: "apply-to-text",
      name: "Apply typography to the selection or the whole note",
      icon: "wand-sparkles",
      editorCallback: (editor) => {
        const text = editor.getValue();
        const ranges = editor.somethingSelected() ? editor.listSelections().map((s) => {
          const a = editor.posToOffset(s.anchor);
          const b = editor.posToOffset(s.head);
          return [Math.min(a, b), Math.max(a, b)];
        }) : [[0, text.length]];
        const changes = [];
        for (const [from, to] of ranges) {
          const original = text.slice(from, to);
          const result = typographize(original, this.settings, text.slice(0, from));
          changes.push(...changesBetween(original, result, from));
        }
        if (changes.length === 0) {
          new import_obsidian.Notice("Typography: nothing to change.");
          return;
        }
        editor.transaction({
          changes: changes.map((c) => ({ from: editor.offsetToPos(c.from), to: editor.offsetToPos(c.to), text: c.insert }))
        });
        new import_obsidian.Notice(`Typography: changed ${changes.length} ${changes.length === 1 ? "line" : "lines"}.`);
      }
    });
  }
  /**
   * Whether the note in this editor is one the substitutions keep out of:
   * it is in an excluded folder, or its `typography` property is `off`.
   * The property is read from the metadata cache, which is a lookup, and
   * this only runs for the few characters a rule reacts to.
   */
  leftAlone(state) {
    var _a, _b;
    const file = (_a = state.field(import_obsidian.editorInfoField, false)) == null ? void 0 : _a.file;
    if (!file)
      return false;
    if (this.settings.excludedFolders && inFolder(file.path, folderList(this.settings.excludedFolders)))
      return true;
    const frontmatter = (_b = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _b.frontmatter;
    return isOff(frontmatter == null ? void 0 : frontmatter[NOTE_PROPERTY]);
  }
  async loadSettings() {
    const stored = await this.loadData();
    this.showPresetPrompt = shouldPromptForPreset(stored);
    this.settings = { ...DEFAULT_SETTINGS, ...stored };
    if (!this.showPresetPrompt)
      this.settings.presetPrompted = true;
    if (typeof this.settings.customRules !== "string")
      this.settings.customRules = "";
  }
  /** Applies a style preset and saves; used by the first-run prompt and the settings tab. */
  async applyStylePreset(preset) {
    this.settings = applyStylePreset(this.settings, preset);
    await this.saveSettings();
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  /**
   * The settings are read at keystroke time rather than baked into the
   * extension, so a change in the settings tab takes effect in open notes
   * without reconfiguring anything.
   */
  editorExtension() {
    return [
      lastSubstitution,
      // Highest precedence, or Obsidian's "Auto-pair brackets" (on by
      // default) claims every `"` and `'` first and inserts a straight
      // pair, so no quotation mark is ever curled. Where this handler
      // declines, in code or a link target, auto-pairing still runs.
      import_state.Prec.highest(
        import_view.EditorView.inputHandler.of((view, from, to, text) => this.handleInput(view, from, to, text))
      ),
      import_state.Prec.highest(
        import_view.keymap.of([
          { key: "Backspace", run: (view) => this.handleBackspace(view) },
          { key: "Tab", run: (view) => this.handleTab(view) }
        ])
      ),
      this.composedQuotes()
    ];
  }
  /**
   * Curls the quotes in text that an input method composed, once the
   * composition is over. `src/compose.ts` says why it cannot happen as the
   * quote is typed.
   */
  composedQuotes() {
    const settings = () => this.settings;
    const leftAlone = (state) => this.leftAlone(state);
    return import_view.ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.view = view;
          /** Where the text composed since the last check is, or null. */
          this.range = null;
          this.timer = null;
        }
        update(update) {
          for (const tr of update.transactions) {
            if (this.range && tr.docChanged) {
              this.range = {
                from: tr.changes.mapPos(this.range.from, -1),
                to: tr.changes.mapPos(this.range.to, 1)
              };
            }
            if (!tr.isUserEvent("input.type.compose"))
              continue;
            tr.changes.iterChangedRanges((_fromA, _toA, fromB, toB) => {
              this.range = this.range ? { from: Math.min(this.range.from, fromB), to: Math.max(this.range.to, toB) } : { from: fromB, to: toB };
            });
          }
          if (this.range)
            this.schedule(0);
        }
        destroy() {
          if (this.timer !== null)
            window.clearTimeout(this.timer);
        }
        schedule(delay) {
          if (this.timer !== null)
            window.clearTimeout(this.timer);
          this.timer = window.setTimeout(() => this.check(), delay);
        }
        check() {
          this.timer = null;
          const { view } = this;
          if (!this.range)
            return;
          if (view.compositionStarted) {
            this.schedule(COMPOSITION_POLL);
            return;
          }
          const { state } = view;
          const from = Math.max(0, this.range.from);
          const to = Math.min(state.doc.length, this.range.to);
          this.range = null;
          if (state.readOnly || from >= to || leftAlone(state))
            return;
          const composed = state.doc.sliceString(from, to);
          if (!composed.includes('"') && !composed.includes("'"))
            return;
          const changes = curlComposedQuotes(
            state.doc.sliceString(0, Math.min(state.doc.length, to + LOOKAHEAD2)),
            from,
            to,
            settings()
          );
          if (changes.length > 0)
            view.dispatch({ changes, userEvent: "input.type" });
        }
      }
    );
  }
  handleInput(view, from, to, text) {
    if (view.composing)
      return false;
    if (view.state.readOnly)
      return false;
    if (from !== to && text.length === 1)
      return this.handleWrap(view, from, to, text);
    if (from !== to || text.length !== 1)
      return false;
    if (!mightSubstitute(text, this.settings))
      return false;
    if (this.settings.capitalizeSentences) {
      const line = view.state.doc.lineAt(from);
      if (cannotCapitalize(text, line.text.slice(0, from - line.from), this.settings))
        return false;
    }
    if (this.leftAlone(view.state))
      return false;
    const { state } = view;
    const action = substitutionFor(
      state.doc.sliceString(0, from),
      state.doc.sliceString(from, Math.min(from + LOOKAHEAD2, state.doc.length)),
      text,
      this.settings
    );
    if (action === null)
      return false;
    if (action.kind === "skip") {
      view.dispatch({
        selection: { anchor: action.to },
        userEvent: "move.character"
      });
      return true;
    }
    const cursor = action.from + action.insert.length;
    view.dispatch({
      changes: { from: action.from, to: action.to, insert: action.insert },
      selection: { anchor: cursor },
      userEvent: "input.type",
      effects: rememberSubstitution.of({
        from: action.from,
        to: cursor,
        inserted: action.insert,
        literal: action.literal
      })
    });
    return true;
  }
  handleWrap(view, from, to, text) {
    const { state } = view;
    const main = state.selection.main;
    if (state.selection.ranges.length !== 1 || main.from !== from || main.to !== to)
      return false;
    if (view.compositionStarted || view.composing)
      return false;
    const wrap = wrapFor(text, this.settings);
    if (wrap === null || this.leftAlone(state))
      return false;
    if (protectedRegionAt(state.doc.sliceString(0, from)) !== null)
      return false;
    if (protectedRegionAt(state.doc.sliceString(0, to)) !== null)
      return false;
    view.dispatch({
      changes: [
        { from, insert: wrap.open },
        { from: to, insert: wrap.close }
      ],
      selection: { anchor: from + wrap.open.length, head: to + wrap.open.length },
      userEvent: "input.type"
    });
    return true;
  }
  handleTab(view) {
    const { state } = view;
    if (!this.settings.tabOut || state.readOnly || view.composing)
      return false;
    const selection = state.selection;
    if (selection.ranges.length !== 1 || !selection.main.empty)
      return false;
    const head = selection.main.head;
    const line = state.doc.lineAt(head);
    if (head === line.to)
      return false;
    if (this.leftAlone(state))
      return false;
    const target = tabOutTarget(
      state.doc.sliceString(0, head),
      state.doc.sliceString(head, line.to),
      this.settings
    );
    if (target === null)
      return false;
    view.dispatch({ selection: { anchor: target }, userEvent: "move.character", scrollIntoView: true });
    return true;
  }
  handleBackspace(view) {
    var _a;
    const { state } = view;
    const selection = state.selection.main;
    const last = (_a = state.field(lastSubstitution, false)) != null ? _a : null;
    const revert = revertFor(last, state.doc.toString(), selection.from, selection.to);
    if (revert === null)
      return false;
    view.dispatch({
      changes: { from: revert.from, to: revert.to, insert: revert.insert },
      selection: { anchor: revert.from + revert.insert.length },
      userEvent: "delete.backward"
    });
    return true;
  }
};
function quoteStyleOptions() {
  const options = { off: "Leave straight quotes alone" };
  for (const convention of QUOTE_CONVENTIONS)
    options[convention.id] = convention.label;
  return options;
}
var SETTING_TEXT = {
  quoteStyle: {
    name: "Quotation marks",
    desc: "Which convention straight quotes are turned into. Apostrophes are the same character in every convention and are set separately."
  },
  smartApostrophes: {
    name: "Apostrophes",
    desc: "it's becomes it\u2019s. Works whether or not quotation marks are set."
  },
  skipClosingQuote: {
    name: "Step over a closing quote",
    desc: "Typing a closing quote where one already sits moves the cursor past it instead of adding a second one."
  },
  capitalizeSentences: {
    name: "Capitalize sentences",
    desc: "Types a capital for the first letter of a line or of a sentence after . ! or ?. It keeps out of code, links, tags and paths, and after abbreviations such as Mr., e.g. or etc. Backspace right after puts back the lowercase letter."
  },
  tabOut: {
    name: "Tab to jump out",
    desc: "With the cursor right before a closing quote or bracket, Tab moves past it. Tab still indents in lists and moves between cells in tables."
  },
  wrapSelection: {
    name: "Wrap a selection in quotes",
    desc: "With text selected, typing a quote puts curly quotes around it instead of replacing it."
  },
  dashes: { name: "Dashes", desc: "-- becomes \u2013 and --- becomes \u2014." },
  ellipsis: { name: "Ellipsis", desc: "... becomes \u2026." },
  arrows: {
    name: "Arrows",
    desc: "-> becomes \u2192, <- becomes \u2190, <-> becomes \u2194, => becomes \u21D2."
  },
  mathSymbols: {
    name: "Mathematical symbols",
    desc: ">= becomes \u2265, <= becomes \u2264, != becomes \u2260, +- becomes \xB1."
  },
  excludedFolders: {
    name: "Excluded folders",
    desc: 'Nothing is substituted in notes inside these folders, one folder per line (for example Code or Templates/Raw). A single note can opt out with the property "typography: off", or the command "Turn substitutions off or on in this note".'
  },
  customRules: {
    name: "Your own replacements",
    desc: 'One rule per line, the characters you type, then " -> ", then what they become: (c) -> \xA9. A rule fires as you type the last character of its sequence, in the same places as the rules above, and Backspace straight after puts back what you typed. The rules above go first: a sequence they also handle only uses yours while their switch is off. A sequence needs at least two characters.'
  }
};
var CUSTOM_STATUS = { name: "Rules in use" };
var PRESET_TEXT = {
  name: "Add a preset",
  desc: "Adds a ready-made set of rules to your list; rules already in it are left alone. >> is never replaced at the start of a line, where it opens a nested quote."
};
var KEEPS_OUT_NOTE = {
  name: "Where nothing is substituted",
  desc: "Code blocks, inline code, formulas, link targets, frontmatter, HTML tags and comments, and Templater expressions are left exactly as typed. Backspace straight after a substitution puts back what you typed."
};
var TOGGLE_KEYS = [
  "smartApostrophes",
  "skipClosingQuote",
  "dashes",
  "ellipsis",
  "arrows",
  "mathSymbols",
  "capitalizeSentences",
  "tabOut",
  "wrapSelection"
];
var STYLE_PRESET_TEXT = {
  name: "Style preset",
  desc: "Sets the switches above in one go: Writer, Academic, Developer (quiet) or Default. Your folders, quote style (except Developer) and own replacements are kept."
};
var SmartTypographySettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    /** Where the custom rules' status is written, while the tab is open. */
    this.statusEl = null;
    /** Set once Obsidian has drawn the tab through `display()`, which it does only before 1.13. */
    this.legacy = false;
  }
  /**
   * The settings, described rather than drawn.
   *
   * Obsidian 1.13 and later renders this itself and, the reason for writing
   * it, indexes it so the settings turn up in the settings search. Older
   * versions know nothing about this method and fall back to `display()`.
   */
  getSettingDefinitions() {
    return [
      {
        ...SETTING_TEXT.quoteStyle,
        control: {
          type: "dropdown",
          key: "quoteStyle",
          options: quoteStyleOptions(),
          defaultValue: DEFAULT_SETTINGS.quoteStyle
        }
      },
      {
        ...STYLE_PRESET_TEXT,
        searchable: true,
        render: (setting) => this.stylePresetButtons(setting)
      },
      ...TOGGLE_KEYS.map((key) => ({
        ...SETTING_TEXT[key],
        control: {
          type: "toggle",
          key,
          defaultValue: DEFAULT_SETTINGS[key]
        }
      })),
      {
        ...SETTING_TEXT.excludedFolders,
        control: {
          type: "textarea",
          key: "excludedFolders",
          placeholder: "Code\nTemplates",
          rows: 3,
          defaultValue: DEFAULT_SETTINGS.excludedFolders
        }
      },
      {
        ...SETTING_TEXT.customRules,
        control: {
          type: "textarea",
          key: "customRules",
          placeholder: ":check: -> \u2713",
          rows: 4,
          defaultValue: DEFAULT_SETTINGS.customRules
        }
      },
      {
        ...CUSTOM_STATUS,
        searchable: false,
        render: (setting) => {
          this.statusEl = setting.descEl;
          this.showStatus();
          return () => {
            this.statusEl = null;
          };
        }
      },
      {
        ...PRESET_TEXT,
        render: (setting) => this.presetButtons(setting)
      },
      // No control: a row that is only an explanation, which also puts the
      // sentence in the settings search.
      KEEPS_OUT_NOTE
    ];
  }
  /** Says how many custom rules are in use and which lines are ignored, and why. */
  showStatus() {
    const el = this.statusEl;
    if (!el)
      return;
    el.empty();
    const { rules, ignored } = customRulesFor(this.plugin.settings.customRules);
    el.createDiv({
      text: rules.length === 0 ? "No rules yet." : `${rules.length} ${rules.length === 1 ? "rule" : "rules"} in use.`
    });
    for (const item of ignored) {
      el.createDiv({
        cls: "mod-warning",
        text: `Ignored, line ${item.line} (${item.text.trim()}): ${item.reason}.`
      });
    }
  }
  stylePresetButtons(setting) {
    for (const preset of STYLE_PRESETS) {
      setting.addButton(
        (button) => button.setButtonText(preset.label).onClick(() => void this.applyStyle(preset))
      );
    }
  }
  async applyStyle(preset) {
    var _a;
    await this.plugin.applyStylePreset(preset);
    new import_obsidian.Notice(`Typography: ${preset.label} preset applied.`);
    if (this.legacy) {
      this.display();
      return;
    }
    const tab = this;
    (_a = tab.update) == null ? void 0 : _a.call(tab);
  }
  presetButtons(setting) {
    for (const preset of PRESETS) {
      setting.addButton(
        (button) => button.setButtonText(preset.label).onClick(() => void this.addPreset(preset))
      );
    }
  }
  async addPreset(preset) {
    var _a;
    const { setting, added } = addPreset(this.plugin.settings.customRules, preset);
    if (added === 0) {
      new import_obsidian.Notice("Typography: those rules are already in your list.");
      return;
    }
    this.plugin.settings.customRules = setting;
    await this.plugin.saveSettings();
    new import_obsidian.Notice(`Typography: added ${added} ${added === 1 ? "rule" : "rules"}.`);
    if (this.legacy) {
      this.display();
      return;
    }
    const tab = this;
    (_a = tab.update) == null ? void 0 : _a.call(tab);
  }
  /**
   * Persists a change made through a declarative control.
   *
   * The inherited version writes to `plugin.settings` too, but routing it
   * through `saveSettings()` keeps one path to disk for both renderings.
   */
  async setControlValue(key, value) {
    Object.assign(this.plugin.settings, { [key]: value });
    await this.plugin.saveSettings();
    if (key === "customRules")
      this.showStatus();
  }
  /**
   * The pre-1.13 rendering. Obsidian skips this entirely once
   * `getSettingDefinitions()` returns anything, so it is dead code on a
   * current app and only runs for users below the 1.13 line.
   */
  display() {
    this.legacy = true;
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.quoteStyle.name).setDesc(SETTING_TEXT.quoteStyle.desc).addDropdown((dropdown) => {
      for (const [value, label] of Object.entries(quoteStyleOptions())) {
        dropdown.addOption(value, label);
      }
      dropdown.setValue(this.plugin.settings.quoteStyle);
      dropdown.onChange(async (value) => {
        this.plugin.settings.quoteStyle = value;
        await this.plugin.saveSettings();
      });
    });
    this.stylePresetButtons(
      new import_obsidian.Setting(containerEl).setName(STYLE_PRESET_TEXT.name).setDesc(STYLE_PRESET_TEXT.desc)
    );
    for (const key of TOGGLE_KEYS)
      this.addToggle(key);
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.excludedFolders.name).setDesc(SETTING_TEXT.excludedFolders.desc).addTextArea((area) => {
      area.setPlaceholder("Code\nTemplates").setValue(this.plugin.settings.excludedFolders);
      area.onChange(async (value) => {
        this.plugin.settings.excludedFolders = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName(SETTING_TEXT.customRules.name).setDesc(SETTING_TEXT.customRules.desc).addTextArea((area) => {
      area.setPlaceholder(":check: -> \u2713").setValue(this.plugin.settings.customRules);
      area.onChange(async (value) => {
        this.plugin.settings.customRules = value;
        await this.plugin.saveSettings();
        this.showStatus();
      });
    });
    const status = new import_obsidian.Setting(containerEl).setName(CUSTOM_STATUS.name);
    this.statusEl = status.descEl;
    this.showStatus();
    this.presetButtons(new import_obsidian.Setting(containerEl).setName(PRESET_TEXT.name).setDesc(PRESET_TEXT.desc));
    containerEl.createEl("p", {
      text: `${KEEPS_OUT_NOTE.name}. ${KEEPS_OUT_NOTE.desc}`,
      cls: "setting-item-description"
    });
  }
  addToggle(key) {
    new import_obsidian.Setting(this.containerEl).setName(SETTING_TEXT[key].name).setDesc(SETTING_TEXT[key].desc).addToggle((toggle) => {
      toggle.setValue(this.plugin.settings[key]);
      toggle.onChange(async (value) => {
        this.plugin.settings[key] = value;
        await this.plugin.saveSettings();
      });
    });
  }
};
var PresetModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    this.setTitle("Choose a typography style");
    contentEl.createEl("p", {
      text: "Pick a starting point. You can change every switch later in the plugin settings, where these presets are also listed."
    });
    for (const preset of STYLE_PRESETS) {
      new import_obsidian.Setting(contentEl).setName(preset.label).setDesc(preset.desc).addButton(
        (button) => button.setButtonText(preset.id === "default" ? "Keep default" : "Use " + preset.label).onClick(() => {
          void this.plugin.applyStylePreset(preset);
          this.close();
        })
      );
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};

/* nosourcemap */