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
var FENCE = /^((?:[ \t]*>[ \t]?)*)[ \t]*(?:(?:[-*+]|\d{1,9}[.)])[ \t]+)?(`{3,}|~{3,})(.*)$/;
function quoteDepth(line) {
  var _a, _b;
  const markers = (_b = (_a = /^(?:[ \t]*>[ \t]?)*/.exec(line)) == null ? void 0 : _a[0]) != null ? _b : "";
  return markers.split(">").length - 1;
}
function isFenceLine(line) {
  const m = FENCE.exec(line);
  return m !== null && !(m[2][0] === "`" && m[3].includes("`"));
}
var TAG_START = /^<\/?[A-Za-z][A-Za-z0-9-]*(?=[\s/>]|$)/;
var URL_START = /^<?https?:\/\//;
function protectedRegionAt(text) {
  const lineStart = text.lastIndexOf("\n") + 1;
  const block = blockStateAt(text, lineStart);
  if (block.region)
    return block.region;
  if (block.openSpan === null && isFenceLine(text.slice(lineStart)))
    return "code-block";
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
  lines.pop();
  let inFrontmatter = lines.length > 0 && lines[0] === "---";
  let fence = null;
  let fenceDepth = 0;
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
    if (fence !== null && quoteDepth(line) < fenceDepth)
      fence = null;
    const fenceMatch = isFenceLine(line) ? FENCE.exec(line) : null;
    if (fenceMatch) {
      const marker = fenceMatch[2];
      if (fence === null) {
        fence = marker;
        fenceDepth = quoteDepth(line);
        continue;
      }
      if (marker[0] === fence[0] && marker.length >= fence.length && fenceMatch[3].trim() === "" && quoteDepth(line) === fenceDepth) {
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

// src/locales/de.ts
var de = {
  // Commands
  "command.toggleNote": "Ersetzungen in dieser Notiz aus- oder einschalten",
  "command.setQuotes": "Anf\xFChrungszeichen f\xFCr diese Notiz festlegen\u2026",
  "command.applyToText": "Typografie auf die Auswahl oder die ganze Notiz anwenden",
  // Notices
  "notice.substitutionsOff": "Typography: Ersetzungen sind in dieser Notiz ausgeschaltet.",
  "notice.substitutionsOn": "Typography: Ersetzungen sind in dieser Notiz eingeschaltet.",
  "notice.removedButExcluded": "Typography: Die Eigenschaft wurde entfernt, aber diese Notiz liegt in einem ausgeschlossenen Ordner, daher bleiben die Ersetzungen aus.",
  "notice.nothingToChange": "Typography: Nichts zu \xE4ndern.",
  "notice.changedLines.one": "Typography: 1 Zeile ge\xE4ndert.",
  "notice.changedLines.other": "Typography: {count} Zeilen ge\xE4ndert.",
  "notice.quotesFollowFolder": "Typography: Diese Notiz folgt wieder den Anf\xFChrungszeichen des Ordners und der globalen Einstellung.",
  "notice.quotesSet": "Typography: Die Anf\xFChrungszeichen dieser Notiz sind jetzt: {style}.",
  "notice.quotesStraight": "Typography: Die Anf\xFChrungszeichen dieser Notiz sind jetzt gerade.",
  "notice.presetApplied": "Typography: Voreinstellung \u201E{preset}\u201C angewendet.",
  "notice.presetRulesPresent": "Typography: Diese Regeln stehen bereits in deiner Liste.",
  "notice.rulesAdded.one": "Typography: 1 Regel hinzugef\xFCgt.",
  "notice.rulesAdded.other": "Typography: {count} Regeln hinzugef\xFCgt.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "Englisch \u201C \u201D \u2018 \u2019",
  "convention.german": "Deutsch \u201E \u201C \u201A \u2018",
  "convention.french": "Franz\xF6sisch \xAB \xBB \u2039 \u203A",
  "convention.spanish": "Spanisch \xAB \xBB \u201C \u201D",
  "convention.swedish": "Schwedisch \u201D \u201D \u2019 \u2019",
  "convention.polish": "Polnisch \u201E \u201D \u201A \u2019",
  "convention.russian": "Russisch \xAB \xBB \u201E \u201C",
  "convention.off": "Gerade Anf\xFChrungszeichen unver\xE4ndert lassen",
  // Style presets
  "stylePreset.default.label": "Standard",
  "stylePreset.default.desc": "Typografische Anf\xFChrungszeichen, Gedankenstriche, Auslassungspunkte, Pfeile und Symbole. Keine automatische Gro\xDFschreibung.",
  "stylePreset.writer.label": "Schreiben",
  "stylePreset.writer.desc": "Flie\xDFtext: typografische Anf\xFChrungszeichen, Gedankenstriche, Auslassungspunkte und Gro\xDFbuchstabe am Satzanfang. Keine Pfeile oder mathematischen Symbole.",
  "stylePreset.academic.label": "Akademisch",
  "stylePreset.academic.desc": "Alles eingeschaltet, auch Pfeile und mathematische Symbole, dazu automatische Gro\xDFschreibung.",
  "stylePreset.developer.label": "Entwicklung (dezent)",
  "stylePreset.developer.desc": "Gerade Anf\xFChrungszeichen und einfache Bindestriche bleiben, wie getippt. Nur Pfeile und mathematische Symbole werden umgewandelt.",
  // Rule presets
  "rulePreset.guillemets": "Guillemets << >>",
  "rulePreset.symbols": "Symbole (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "Anf\xFChrungszeichen",
  "setting.quoteStyle.desc": "In welche Konvention gerade Anf\xFChrungszeichen umgewandelt werden. Apostrophe sind in jeder Konvention dasselbe Zeichen und werden separat eingestellt.",
  "setting.smartApostrophes.name": "Apostrophe",
  "setting.smartApostrophes.desc": "it's wird zu it\u2019s. Funktioniert unabh\xE4ngig von den Anf\xFChrungszeichen.",
  "setting.skipClosingQuote.name": "Schlie\xDFendes Anf\xFChrungszeichen \xFCberspringen",
  "setting.skipClosingQuote.desc": "Wer ein schlie\xDFendes Anf\xFChrungszeichen tippt, wo schon eines steht, springt mit dem Cursor dahinter, statt ein zweites einzuf\xFCgen.",
  "setting.capitalizeSentences.name": "S\xE4tze gro\xDFschreiben",
  "setting.capitalizeSentences.desc": "Schreibt den ersten Buchstaben einer Zeile oder eines Satzes nach . ! oder ? gro\xDF. Nicht in Code, Links, Tags und Pfaden und nicht nach Abk\xFCrzungen wie Mr., e.g. oder etc. Die R\xFCcktaste direkt danach stellt den Kleinbuchstaben wieder her.",
  "setting.tabOut.name": "Mit Tab herausspringen",
  "setting.tabOut.desc": "Steht der Cursor direkt vor einem schlie\xDFenden Anf\xFChrungszeichen oder einer schlie\xDFenden Klammer, springt Tab dahinter. In Listen r\xFCckt Tab weiterhin ein, in Tabellen wechselt es weiterhin die Zelle.",
  "setting.wrapSelection.name": "Auswahl in Anf\xFChrungszeichen setzen",
  "setting.wrapSelection.desc": "Wenn Text ausgew\xE4hlt ist, setzt das Tippen eines Anf\xFChrungszeichens typografische Anf\xFChrungszeichen darum, statt den Text zu ersetzen.",
  "setting.dashes.name": "Striche",
  "setting.dashes.desc": "-- wird zu \u2013 und --- wird zu \u2014.",
  "setting.ellipsis.name": "Auslassungspunkte",
  "setting.ellipsis.desc": "... wird zu \u2026.",
  "setting.arrows.name": "Pfeile",
  "setting.arrows.desc": "-> wird zu \u2192, <- wird zu \u2190, <-> wird zu \u2194, => wird zu \u21D2.",
  "setting.mathSymbols.name": "Mathematische Symbole",
  "setting.mathSymbols.desc": ">= wird zu \u2265, <= wird zu \u2264, != wird zu \u2260, +- wird zu \xB1.",
  "setting.excludedFolders.name": "Ausgeschlossene Ordner",
  "setting.excludedFolders.desc": 'In Notizen dieser Ordner wird nichts ersetzt, ein Ordner pro Zeile (zum Beispiel Code oder Templates/Raw). Eine einzelne Notiz kann mit der Eigenschaft "typography: off" oder dem Befehl \u201EErsetzungen in dieser Notiz aus- oder einschalten\u201C ausgenommen werden.',
  "setting.useLangProperty.name": "Eigenschaft lang der Notiz verwenden",
  "setting.useLangProperty.desc": 'Eine Notiz mit einer Eigenschaft wie "lang: de" erh\xE4lt die Anf\xFChrungszeichen dieser Sprache (Englisch, Deutsch, Franz\xF6sisch, Spanisch, Schwedisch, Polnisch, Russisch), sofern sie nicht ihr eigenes "typography-quotes" hat. Standardm\xE4\xDFig aus, weil deine vorhandenen Notizen schon eine Eigenschaft lang haben k\xF6nnen.',
  "setting.quotesByFolder.name": "Anf\xFChrungszeichen pro Ordner",
  "setting.quotesByFolder.desc": 'Ein Ordner pro Zeile, dann " -> ", dann die Konvention: Deutsch -> german. Der spezifischste Ordner gewinnt. Die Eigenschaft "lang" der Notiz (wenn der Schalter oben an ist) und ihre Eigenschaft "typography-quotes" haben Vorrang vor dem Ordner. Konventionen: english, german, french, spanish, swedish, polish, russian oder off f\xFCr gerade Anf\xFChrungszeichen.',
  "setting.customRules.name": "Eigene Ersetzungen",
  "setting.customRules.desc": 'Eine Regel pro Zeile: die getippten Zeichen, dann " -> ", dann was daraus wird: (c) -> \xA9. Eine Regel greift, sobald du das letzte Zeichen ihrer Zeichenfolge tippst, an denselben Stellen wie die Regeln oben, und die R\xFCcktaste direkt danach stellt das Getippte wieder her. Die Regeln oben haben Vorrang: Eine Zeichenfolge, die auch sie behandeln, nutzt deine Regel nur, solange ihr Schalter aus ist. Eine Zeichenfolge braucht mindestens zwei Zeichen.',
  "setting.stylePreset.name": "Stilvoreinstellung",
  "setting.stylePreset.desc": "Stellt die Schalter oben in einem Schritt ein: Schreiben, Akademisch, Entwicklung (dezent) oder Standard. Deine Ordner, der Anf\xFChrungszeichen-Stil (au\xDFer bei Entwicklung) und deine eigenen Ersetzungen bleiben erhalten.",
  "setting.rulePreset.name": "Voreinstellung hinzuf\xFCgen",
  "setting.rulePreset.desc": "F\xFCgt deiner Liste einen fertigen Regelsatz hinzu; vorhandene Regeln bleiben unber\xFChrt. >> wird am Zeilenanfang nie ersetzt, weil es dort ein verschachteltes Zitat einleitet.",
  "setting.keepsOut.name": "Wo nichts ersetzt wird",
  "setting.keepsOut.desc": "Codebl\xF6cke, Inline-Code, Formeln, Linkziele, Frontmatter, HTML-Tags und -Kommentare sowie Templater-Ausdr\xFCcke bleiben genau so, wie sie getippt wurden. Die R\xFCcktaste direkt nach einer Ersetzung stellt das Getippte wieder her.",
  "setting.folderStatus.name": "Verwendete Ordner",
  "setting.rulesStatus.name": "Verwendete Regeln",
  // Status lines under the text areas
  "status.noFolders": "Noch keine Ordner.",
  "status.folders.one": "1 Ordner wird verwendet.",
  "status.folders.other": "{count} Ordner werden verwendet.",
  "status.noRules": "Noch keine Regeln.",
  "status.rules.one": "1 Regel wird verwendet.",
  "status.rules.other": "{count} Regeln werden verwendet.",
  "status.ignored": "Ignoriert, Zeile {line} ({text}): {reason}.",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": 'Zwischen Zeichenfolge und Ersatz fehlt "{separator}"',
  "reason.sequenceLineBreak": "Die Zeichenfolge enth\xE4lt einen Zeilenumbruch",
  "reason.sequenceEmpty": "Die Zeichenfolge ist leer",
  "reason.sequenceSpaces": "Die Zeichenfolge besteht nur aus Leerzeichen",
  "reason.sequenceShort": "Die Zeichenfolge braucht mindestens zwei Zeichen",
  "reason.sequenceEmoji": "Die Zeichenfolge endet mit einem Emoji oder \xE4hnlichen Zeichen",
  "reason.replacementLineBreak": "Der Ersatz enth\xE4lt einen Zeilenumbruch",
  "reason.replacementEmpty": "Der Ersatz ist leer",
  "reason.replacementSame": "Der Ersatz ist mit der Zeichenfolge identisch",
  "reason.duplicate": "Dieselbe Zeichenfolge steht schon in Zeile {line}",
  "reason.clash": "Die Regel in Zeile {line} greift bereits bei denselben Tasten",
  "reason.folderFormat": 'Erst den Ordner schreiben, dann " -> ", dann die Konvention',
  "reason.noFolder": 'Kein Ordner vor "->"',
  "reason.unknownConvention": "Unbekannte Konvention",
  // Modals
  "modal.preset.title": "Typografie-Stil w\xE4hlen",
  "modal.preset.intro": "W\xE4hle einen Ausgangspunkt. Jeden Schalter kannst du sp\xE4ter in den Einstellungen der Erweiterung \xE4ndern; dort sind diese Voreinstellungen ebenfalls aufgef\xFChrt.",
  "modal.preset.keepDefault": "Standard beibehalten",
  "modal.preset.use": "{preset} verwenden",
  "modal.quotes.placeholder": "Anf\xFChrungszeichen f\xFCr diese Notiz",
  "modal.quotes.follow": "Ordner und globaler Einstellung folgen (Eigenschaft entfernen)",
  "modal.quotes.straight": "Gerade Anf\xFChrungszeichen (aus)"
};
var de_default = de;

// src/locales/en.ts
var en = {
  // Commands
  "command.toggleNote": "Turn substitutions off or on in this note",
  "command.setQuotes": "Set quotation marks for this note\u2026",
  "command.applyToText": "Apply typography to the selection or the whole note",
  // Notices
  "notice.substitutionsOff": "Typography: substitutions are off in this note.",
  "notice.substitutionsOn": "Typography: substitutions are on in this note.",
  "notice.removedButExcluded": "Typography: removed the property, but this note is in an excluded folder, so substitutions stay off.",
  "notice.nothingToChange": "Typography: nothing to change.",
  "notice.changedLines.one": "Typography: changed 1 line.",
  "notice.changedLines.other": "Typography: changed {count} lines.",
  "notice.quotesFollowFolder": "Typography: this note follows your folder and global quotation marks again.",
  "notice.quotesSet": "Typography: quotation marks in this note are now {style}.",
  "notice.quotesStraight": "Typography: quotation marks in this note are now straight.",
  "notice.presetApplied": "Typography: {preset} preset applied.",
  "notice.presetRulesPresent": "Typography: those rules are already in your list.",
  "notice.rulesAdded.one": "Typography: added 1 rule.",
  "notice.rulesAdded.other": "Typography: added {count} rules.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "English \u201C \u201D \u2018 \u2019",
  "convention.german": "German \u201E \u201C \u201A \u2018",
  "convention.french": "French \xAB \xBB \u2039 \u203A",
  "convention.spanish": "Spanish \xAB \xBB \u201C \u201D",
  "convention.swedish": "Swedish \u201D \u201D \u2019 \u2019",
  "convention.polish": "Polish \u201E \u201D \u201A \u2019",
  "convention.russian": "Russian \xAB \xBB \u201E \u201C",
  "convention.off": "Leave straight quotes alone",
  // Style presets
  "stylePreset.default.label": "Default",
  "stylePreset.default.desc": "Curly quotes, dashes, ellipsis, arrows and symbols. No automatic capitals.",
  "stylePreset.writer.label": "Writer",
  "stylePreset.writer.desc": "Prose: curly quotes, dashes, ellipsis and a capital at the start of each sentence. No arrows or math symbols.",
  "stylePreset.academic.label": "Academic",
  "stylePreset.academic.desc": "Everything on, including arrows and math symbols, plus automatic capitals.",
  "stylePreset.developer.label": "Developer (quiet)",
  "stylePreset.developer.desc": "Straight quotes and plain hyphens stay as typed. Only arrows and math symbols are converted.",
  // Rule presets
  "rulePreset.guillemets": "Guillemets << >>",
  "rulePreset.symbols": "Symbols (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "Quotation marks",
  "setting.quoteStyle.desc": "Which convention straight quotes are turned into. Apostrophes are the same character in every convention and are set separately.",
  "setting.smartApostrophes.name": "Apostrophes",
  "setting.smartApostrophes.desc": "Turns it's into it\u2019s. Works whether or not quotation marks are set.",
  "setting.skipClosingQuote.name": "Step over a closing quote",
  "setting.skipClosingQuote.desc": "Typing a closing quote where one already sits steps over it instead of adding a second one.",
  "setting.capitalizeSentences.name": "Capitalize sentences",
  "setting.capitalizeSentences.desc": "Types a capital for the first letter of a line or of a sentence after a period, an exclamation mark or a question mark. It keeps out of code, links, tags and paths, and after common abbreviations. Backspace right after puts back the lowercase letter.",
  "setting.tabOut.name": "Tab to jump out",
  "setting.tabOut.desc": "Tab moves past a closing quote or bracket when the caret is right before it. Tab still indents in lists and moves between cells in tables.",
  "setting.wrapSelection.name": "Wrap a selection in quotes",
  "setting.wrapSelection.desc": "With text selected, typing a quote puts curly quotes around it instead of replacing it.",
  "setting.dashes.name": "Dashes",
  "setting.dashes.desc": "Turns -- into \u2013 and --- into \u2014.",
  "setting.ellipsis.name": "Ellipsis",
  "setting.ellipsis.desc": "Turns three dots into \u2026.",
  "setting.arrows.name": "Arrows",
  "setting.arrows.desc": "Turns -> into \u2192, <- into \u2190, <-> into \u2194 and => into \u21D2.",
  "setting.mathSymbols.name": "Mathematical symbols",
  "setting.mathSymbols.desc": "Turns >= into \u2265, <= into \u2264, != into \u2260 and +- into \xB1.",
  "setting.excludedFolders.name": "Excluded folders",
  "setting.excludedFolders.desc": 'Nothing is substituted in notes inside these folders, one folder per line (for example Code or Templates/Raw). A single note can opt out with the property "typography: off", or the command "Turn substitutions off or on in this note".',
  "setting.useLangProperty.name": "Use the note's lang property",
  "setting.useLangProperty.desc": `A note with a property such as "lang: de" gets that language's quotation marks (English, German, French, Spanish, Swedish, Polish, Russian), unless it has its own "typography-quotes". Off by default, because notes you already have may carry a lang property.`,
  "setting.quotesByFolder.name": "Quotes per folder",
  "setting.quotesByFolder.desc": `One folder per line, then " -> ", then the convention: Deutsch -> german. The most specific folder wins. A note's "lang" property (if the switch above is on) and its "typography-quotes" property beat the folder. Conventions: english, german, french, spanish, swedish, polish, russian, or off for straight quotes.`,
  "setting.customRules.name": "Your own replacements",
  "setting.customRules.desc": 'One rule per line, the characters you type, then " -> ", then what they become: (c) -> \xA9. A rule fires as you type the last character of its sequence, in the same places as the rules above. Backspace straight after puts back what you typed. The rules above go first: a sequence they also handle only uses yours while their switch is off. A sequence needs at least two characters.',
  "setting.stylePreset.name": "Style preset",
  "setting.stylePreset.desc": "Sets the switches above in one go: Writer, Academic, Developer (quiet) or Default. Your folders, quote style (except Developer) and own replacements are kept.",
  "setting.rulePreset.name": "Add a preset",
  "setting.rulePreset.desc": "Adds a ready-made set of rules to your list; rules already in it are left alone. >> is never replaced at the start of a line, where it opens a nested quote.",
  "setting.keepsOut.name": "Where nothing is substituted",
  "setting.keepsOut.desc": "Code blocks, inline code, formulas, link targets, frontmatter, HTML tags and comments, and Templater expressions are left exactly as typed. Backspace straight after a substitution puts back what you typed.",
  "setting.folderStatus.name": "Folders in use",
  "setting.rulesStatus.name": "Rules in use",
  // Status lines under the text areas
  "status.noFolders": "No folders yet.",
  "status.folders.one": "One folder in use.",
  "status.folders.other": "{count} folders in use.",
  "status.noRules": "No rules yet.",
  "status.rules.one": "One rule in use.",
  "status.rules.other": "{count} rules in use.",
  "status.ignored": "Ignored, line {line} ({text}): {reason}.",
  // Why a line of the custom rules is ignored (a fragment after "Ignored, line n (...):")
  "reason.noSeparator": 'No "{separator}" between the sequence and the replacement',
  "reason.sequenceLineBreak": "The sequence contains a line break",
  "reason.sequenceEmpty": "The sequence is empty",
  "reason.sequenceSpaces": "The sequence is only spaces",
  "reason.sequenceShort": "The sequence needs at least two characters",
  "reason.sequenceEmoji": "The sequence ends with an emoji or similar character",
  "reason.replacementLineBreak": "The replacement contains a line break",
  "reason.replacementEmpty": "The replacement is empty",
  "reason.replacementSame": "The replacement is the same as the sequence",
  "reason.duplicate": "The same sequence is already on line {line}",
  "reason.clash": "The rule on line {line} already fires on the same keystrokes",
  "reason.folderFormat": 'Write the folder, then " -> ", then the convention',
  "reason.noFolder": 'No folder before "->"',
  "reason.unknownConvention": "Unknown convention",
  // Modals
  "modal.preset.title": "Choose a typography style",
  "modal.preset.intro": "Pick a starting point. You can change every switch later in the plugin settings, where these presets are also listed.",
  "modal.preset.keepDefault": "Keep default",
  "modal.preset.use": "Use {preset}",
  "modal.quotes.placeholder": "Quotation marks for this note",
  "modal.quotes.follow": "Follow the folder and global setting (remove the property)",
  "modal.quotes.straight": "Straight quotes (off)"
};
var en_default = en;

// src/locales/es.ts
var es = {
  // Commands
  "command.toggleNote": "Desactivar o activar las sustituciones en esta nota",
  "command.setQuotes": "Definir las comillas de esta nota\u2026",
  "command.applyToText": "Aplicar la tipograf\xEDa a la selecci\xF3n o a toda la nota",
  // Notices
  "notice.substitutionsOff": "Typography: las sustituciones est\xE1n desactivadas en esta nota.",
  "notice.substitutionsOn": "Typography: las sustituciones est\xE1n activadas en esta nota.",
  "notice.removedButExcluded": "Typography: se quit\xF3 la propiedad, pero esta nota est\xE1 en una carpeta excluida, as\xED que las sustituciones siguen desactivadas.",
  "notice.nothingToChange": "Typography: no hay nada que cambiar.",
  "notice.changedLines.one": "Typography: se cambi\xF3 1 l\xEDnea.",
  "notice.changedLines.other": "Typography: se cambiaron {count} l\xEDneas.",
  "notice.quotesFollowFolder": "Typography: esta nota vuelve a seguir las comillas de la carpeta y las globales.",
  "notice.quotesSet": "Typography: las comillas de esta nota ahora son: {style}.",
  "notice.quotesStraight": "Typography: las comillas de esta nota ahora son rectas.",
  "notice.presetApplied": "Typography: se aplic\xF3 el ajuste predefinido \xAB{preset}\xBB.",
  "notice.presetRulesPresent": "Typography: esas reglas ya est\xE1n en tu lista.",
  "notice.rulesAdded.one": "Typography: se a\xF1adi\xF3 1 regla.",
  "notice.rulesAdded.other": "Typography: se a\xF1adieron {count} reglas.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "Ingl\xE9s \u201C \u201D \u2018 \u2019",
  "convention.german": "Alem\xE1n \u201E \u201C \u201A \u2018",
  "convention.french": "Franc\xE9s \xAB \xBB \u2039 \u203A",
  "convention.spanish": "Espa\xF1ol \xAB \xBB \u201C \u201D",
  "convention.swedish": "Sueco \u201D \u201D \u2019 \u2019",
  "convention.polish": "Polaco \u201E \u201D \u201A \u2019",
  "convention.russian": "Ruso \xAB \xBB \u201E \u201C",
  "convention.off": "Dejar las comillas rectas como est\xE1n",
  // Style presets
  "stylePreset.default.label": "Predeterminado",
  "stylePreset.default.desc": "Comillas tipogr\xE1ficas, rayas, puntos suspensivos, flechas y s\xEDmbolos. Sin may\xFAsculas autom\xE1ticas.",
  "stylePreset.writer.label": "Escritor",
  "stylePreset.writer.desc": "Prosa: comillas tipogr\xE1ficas, rayas, puntos suspensivos y may\xFAscula al comienzo de cada frase. Sin flechas ni s\xEDmbolos matem\xE1ticos.",
  "stylePreset.academic.label": "Acad\xE9mico",
  "stylePreset.academic.desc": "Todo activado, incluidas las flechas y los s\xEDmbolos matem\xE1ticos, adem\xE1s de las may\xFAsculas autom\xE1ticas.",
  "stylePreset.developer.label": "Desarrollador (discreto)",
  "stylePreset.developer.desc": "Las comillas rectas y los guiones simples se quedan como se escriben. Solo se convierten las flechas y los s\xEDmbolos matem\xE1ticos.",
  // Rule presets
  "rulePreset.guillemets": "Comillas angulares << >>",
  "rulePreset.symbols": "S\xEDmbolos (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "Comillas",
  "setting.quoteStyle.desc": "En qu\xE9 convenci\xF3n se convierten las comillas rectas. El ap\xF3strofo es el mismo car\xE1cter en todas las convenciones y se configura aparte.",
  "setting.smartApostrophes.name": "Ap\xF3strofos",
  "setting.smartApostrophes.desc": "it's se convierte en it\u2019s. Funciona tengas o no definidas las comillas.",
  "setting.skipClosingQuote.name": "Saltar la comilla de cierre",
  "setting.skipClosingQuote.desc": "Al escribir una comilla de cierre donde ya hay una, el cursor pasa por encima en lugar de a\xF1adir una segunda.",
  "setting.capitalizeSentences.name": "Poner may\xFAscula al inicio de las frases",
  "setting.capitalizeSentences.desc": "Escribe en may\xFAscula la primera letra de una l\xEDnea o de una frase que sigue a . ! o ?. No act\xFAa en c\xF3digo, enlaces, etiquetas ni rutas, ni despu\xE9s de abreviaturas como Mr., e.g. o etc. Retroceso justo despu\xE9s devuelve la min\xFAscula.",
  "setting.tabOut.name": "Tabulador para salir",
  "setting.tabOut.desc": "Con el cursor justo antes de una comilla o un par\xE9ntesis de cierre, el tabulador pasa por encima. En las listas sigue sangrando y en las tablas sigue movi\xE9ndose entre celdas.",
  "setting.wrapSelection.name": "Envolver la selecci\xF3n entre comillas",
  "setting.wrapSelection.desc": "Con texto seleccionado, escribir una comilla pone comillas tipogr\xE1ficas alrededor en lugar de reemplazarlo.",
  "setting.dashes.name": "Rayas",
  "setting.dashes.desc": "-- se convierte en \u2013 y --- en \u2014.",
  "setting.ellipsis.name": "Puntos suspensivos",
  "setting.ellipsis.desc": "... se convierte en \u2026.",
  "setting.arrows.name": "Flechas",
  "setting.arrows.desc": "-> se convierte en \u2192, <- en \u2190, <-> en \u2194 y => en \u21D2.",
  "setting.mathSymbols.name": "S\xEDmbolos matem\xE1ticos",
  "setting.mathSymbols.desc": ">= se convierte en \u2265, <= en \u2264, != en \u2260 y +- en \xB1.",
  "setting.excludedFolders.name": "Carpetas excluidas",
  "setting.excludedFolders.desc": 'No se sustituye nada en las notas de estas carpetas; una carpeta por l\xEDnea (por ejemplo, Code o Templates/Raw). Una nota concreta puede excluirse con la propiedad "typography: off" o con el comando "Desactivar o activar las sustituciones en esta nota".',
  "setting.useLangProperty.name": "Usar la propiedad lang de la nota",
  "setting.useLangProperty.desc": 'Una nota con una propiedad como "lang: de" recibe las comillas de ese idioma (ingl\xE9s, alem\xE1n, franc\xE9s, espa\xF1ol, sueco, polaco, ruso), salvo que tenga su propia propiedad "typography-quotes". Desactivado por defecto, porque tus notas actuales pueden tener una propiedad lang.',
  "setting.quotesByFolder.name": "Comillas por carpeta",
  "setting.quotesByFolder.desc": 'Una carpeta por l\xEDnea, luego " -> " y luego la convenci\xF3n: Deutsch -> german. Gana la carpeta m\xE1s espec\xEDfica. La propiedad "lang" de la nota (si el interruptor de arriba est\xE1 activado) y su propiedad "typography-quotes" tienen prioridad sobre la carpeta. Convenciones: english, german, french, spanish, swedish, polish, russian, u off para comillas rectas.',
  "setting.customRules.name": "Tus propias sustituciones",
  "setting.customRules.desc": 'Una regla por l\xEDnea: los caracteres que escribes, luego " -> " y luego en qu\xE9 se convierten: (c) -> \xA9. Una regla se activa al escribir el \xFAltimo car\xE1cter de su secuencia, en los mismos lugares que las reglas de arriba, y Retroceso justo despu\xE9s devuelve lo que escribiste. Las reglas de arriba van primero: una secuencia que ellas tambi\xE9n gestionan solo usa la tuya mientras su interruptor est\xE9 desactivado. Una secuencia necesita al menos dos caracteres.',
  "setting.stylePreset.name": "Estilo predefinido",
  "setting.stylePreset.desc": "Ajusta de una vez los interruptores de arriba: Escritor, Acad\xE9mico, Desarrollador (discreto) o Predeterminado. Se conservan tus carpetas, el estilo de comillas (salvo en Desarrollador) y tus sustituciones.",
  "setting.rulePreset.name": "A\xF1adir un conjunto de reglas",
  "setting.rulePreset.desc": "A\xF1ade a tu lista un conjunto de reglas ya hecho; las reglas que ya est\xE9n en ella no se tocan. >> nunca se sustituye al comienzo de una l\xEDnea, donde abre una cita anidada.",
  "setting.keepsOut.name": "D\xF3nde no se sustituye nada",
  "setting.keepsOut.desc": "Los bloques de c\xF3digo, el c\xF3digo en l\xEDnea, las f\xF3rmulas, los destinos de enlaces, el frontmatter, las etiquetas y comentarios HTML y las expresiones de Templater se quedan exactamente como se escribieron. Retroceso justo despu\xE9s de una sustituci\xF3n devuelve lo que escribiste.",
  "setting.folderStatus.name": "Carpetas en uso",
  "setting.rulesStatus.name": "Reglas en uso",
  // Status lines under the text areas
  "status.noFolders": "A\xFAn no hay carpetas.",
  "status.folders.one": "1 carpeta en uso.",
  "status.folders.other": "{count} carpetas en uso.",
  "status.noRules": "A\xFAn no hay reglas.",
  "status.rules.one": "1 regla en uso.",
  "status.rules.other": "{count} reglas en uso.",
  "status.ignored": "Ignorada, l\xEDnea {line} ({text}): {reason}.",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": 'falta "{separator}" entre la secuencia y el reemplazo',
  "reason.sequenceLineBreak": "la secuencia contiene un salto de l\xEDnea",
  "reason.sequenceEmpty": "la secuencia est\xE1 vac\xEDa",
  "reason.sequenceSpaces": "la secuencia son solo espacios",
  "reason.sequenceShort": "la secuencia necesita al menos dos caracteres",
  "reason.sequenceEmoji": "la secuencia termina con un emoji o un car\xE1cter similar",
  "reason.replacementLineBreak": "el reemplazo contiene un salto de l\xEDnea",
  "reason.replacementEmpty": "el reemplazo est\xE1 vac\xEDo",
  "reason.replacementSame": "el reemplazo es igual a la secuencia",
  "reason.duplicate": "la misma secuencia ya est\xE1 en la l\xEDnea {line}",
  "reason.clash": "la regla de la l\xEDnea {line} ya se activa con las mismas teclas",
  "reason.folderFormat": 'escribe la carpeta, luego " -> " y luego la convenci\xF3n',
  "reason.noFolder": 'no hay carpeta antes de "->"',
  "reason.unknownConvention": "convenci\xF3n desconocida",
  // Modals
  "modal.preset.title": "Elige un estilo tipogr\xE1fico",
  "modal.preset.intro": "Elige un punto de partida. Podr\xE1s cambiar cada interruptor m\xE1s adelante en los ajustes del complemento, donde tambi\xE9n aparecen estos estilos predefinidos.",
  "modal.preset.keepDefault": "Mantener el predeterminado",
  "modal.preset.use": "Usar {preset}",
  "modal.quotes.placeholder": "Comillas de esta nota",
  "modal.quotes.follow": "Seguir la carpeta y el ajuste global (quitar la propiedad)",
  "modal.quotes.straight": "Comillas rectas (desactivado)"
};
var es_default = es;

// src/locales/fr.ts
var fr = {
  // Commands
  "command.toggleNote": "D\xE9sactiver ou activer les substitutions dans cette note",
  "command.setQuotes": "D\xE9finir les guillemets de cette note\u2026",
  "command.applyToText": "Appliquer la typographie \xE0 la s\xE9lection ou \xE0 toute la note",
  // Notices
  "notice.substitutionsOff": "Typography : les substitutions sont d\xE9sactiv\xE9es dans cette note.",
  "notice.substitutionsOn": "Typography : les substitutions sont activ\xE9es dans cette note.",
  "notice.removedButExcluded": "Typography : la propri\xE9t\xE9 a \xE9t\xE9 supprim\xE9e, mais cette note se trouve dans un dossier exclu, les substitutions restent donc d\xE9sactiv\xE9es.",
  "notice.nothingToChange": "Typography : rien \xE0 modifier.",
  "notice.changedLines.one": "Typography : 1 ligne modifi\xE9e.",
  "notice.changedLines.other": "Typography : {count} lignes modifi\xE9es.",
  "notice.quotesFollowFolder": "Typography : cette note suit de nouveau les guillemets du dossier et le r\xE9glage global.",
  "notice.quotesSet": "Typography : les guillemets de cette note sont maintenant : {style}.",
  "notice.quotesStraight": "Typography : les guillemets de cette note sont maintenant droits.",
  "notice.presetApplied": "Typography : pr\xE9r\xE9glage \xAB {preset} \xBB appliqu\xE9.",
  "notice.presetRulesPresent": "Typography : ces r\xE8gles sont d\xE9j\xE0 dans votre liste.",
  "notice.rulesAdded.one": "Typography : 1 r\xE8gle ajout\xE9e.",
  "notice.rulesAdded.other": "Typography : {count} r\xE8gles ajout\xE9es.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "Anglais \u201C \u201D \u2018 \u2019",
  "convention.german": "Allemand \u201E \u201C \u201A \u2018",
  "convention.french": "Fran\xE7ais \xAB \xBB \u2039 \u203A",
  "convention.spanish": "Espagnol \xAB \xBB \u201C \u201D",
  "convention.swedish": "Su\xE9dois \u201D \u201D \u2019 \u2019",
  "convention.polish": "Polonais \u201E \u201D \u201A \u2019",
  "convention.russian": "Russe \xAB \xBB \u201E \u201C",
  "convention.off": "Laisser les guillemets droits tels quels",
  // Style presets
  "stylePreset.default.label": "Par d\xE9faut",
  "stylePreset.default.desc": "Guillemets typographiques, tirets, points de suspension, fl\xE8ches et symboles. Pas de majuscules automatiques.",
  "stylePreset.writer.label": "R\xE9daction",
  "stylePreset.writer.desc": "Prose : guillemets typographiques, tirets, points de suspension et majuscule en d\xE9but de phrase. Pas de fl\xE8ches ni de symboles math\xE9matiques.",
  "stylePreset.academic.label": "Acad\xE9mique",
  "stylePreset.academic.desc": "Tout est activ\xE9, y compris les fl\xE8ches et les symboles math\xE9matiques, plus les majuscules automatiques.",
  "stylePreset.developer.label": "D\xE9veloppeur (discret)",
  "stylePreset.developer.desc": "Les guillemets droits et les traits d\u2019union simples restent tels que saisis. Seuls les fl\xE8ches et les symboles math\xE9matiques sont convertis.",
  // Rule presets
  "rulePreset.guillemets": "Guillemets << >>",
  "rulePreset.symbols": "Symboles (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "Guillemets",
  "setting.quoteStyle.desc": "La convention en laquelle les guillemets droits sont convertis. Les apostrophes sont le m\xEAme caract\xE8re dans toutes les conventions et se r\xE8glent s\xE9par\xE9ment.",
  "setting.smartApostrophes.name": "Apostrophes",
  "setting.smartApostrophes.desc": "it's devient it\u2019s. Fonctionne que les guillemets soient d\xE9finis ou non.",
  "setting.skipClosingQuote.name": "Passer par-dessus un guillemet fermant",
  "setting.skipClosingQuote.desc": "Saisir un guillemet fermant l\xE0 o\xF9 il y en a d\xE9j\xE0 un d\xE9place le curseur apr\xE8s lui au lieu d\u2019en ajouter un second.",
  "setting.capitalizeSentences.name": "Majuscule en d\xE9but de phrase",
  "setting.capitalizeSentences.desc": "Met en majuscule la premi\xE8re lettre d\u2019une ligne ou d\u2019une phrase apr\xE8s . ! ou ?. Sans effet dans le code, les liens, les \xE9tiquettes et les chemins, ni apr\xE8s des abr\xE9viations comme Mr., e.g. ou etc. Retour arri\xE8re juste apr\xE8s r\xE9tablit la minuscule.",
  "setting.tabOut.name": "Tab pour sortir",
  "setting.tabOut.desc": "Avec le curseur juste avant un guillemet ou une parenth\xE8se fermants, Tab passe apr\xE8s. Tab continue d\u2019indenter dans les listes et de passer d\u2019une cellule \xE0 l\u2019autre dans les tableaux.",
  "setting.wrapSelection.name": "Entourer une s\xE9lection de guillemets",
  "setting.wrapSelection.desc": "Avec du texte s\xE9lectionn\xE9, saisir un guillemet place des guillemets typographiques autour au lieu de remplacer le texte.",
  "setting.dashes.name": "Tirets",
  "setting.dashes.desc": "-- devient \u2013 et --- devient \u2014.",
  "setting.ellipsis.name": "Points de suspension",
  "setting.ellipsis.desc": "... devient \u2026.",
  "setting.arrows.name": "Fl\xE8ches",
  "setting.arrows.desc": "-> devient \u2192, <- devient \u2190, <-> devient \u2194, => devient \u21D2.",
  "setting.mathSymbols.name": "Symboles math\xE9matiques",
  "setting.mathSymbols.desc": ">= devient \u2265, <= devient \u2264, != devient \u2260, +- devient \xB1.",
  "setting.excludedFolders.name": "Dossiers exclus",
  "setting.excludedFolders.desc": 'Rien n\u2019est substitu\xE9 dans les notes de ces dossiers, un dossier par ligne (par exemple Code ou Templates/Raw). Une note peut aussi \xEAtre exclue avec la propri\xE9t\xE9 "typography: off" ou la commande \xAB D\xE9sactiver ou activer les substitutions dans cette note \xBB.',
  "setting.useLangProperty.name": "Utiliser la propri\xE9t\xE9 lang de la note",
  "setting.useLangProperty.desc": 'Une note ayant une propri\xE9t\xE9 comme "lang: de" re\xE7oit les guillemets de cette langue (anglais, allemand, fran\xE7ais, espagnol, su\xE9dois, polonais, russe), sauf si elle a sa propre propri\xE9t\xE9 "typography-quotes". D\xE9sactiv\xE9 par d\xE9faut, car vos notes existantes peuvent d\xE9j\xE0 avoir une propri\xE9t\xE9 lang.',
  "setting.quotesByFolder.name": "Guillemets par dossier",
  "setting.quotesByFolder.desc": 'Un dossier par ligne, puis " -> ", puis la convention : Deutsch -> german. Le dossier le plus pr\xE9cis l\u2019emporte. La propri\xE9t\xE9 "lang" de la note (si l\u2019interrupteur ci-dessus est activ\xE9) et sa propri\xE9t\xE9 "typography-quotes" priment sur le dossier. Conventions : english, german, french, spanish, swedish, polish, russian, ou off pour des guillemets droits.',
  "setting.customRules.name": "Vos propres substitutions",
  "setting.customRules.desc": 'Une r\xE8gle par ligne : les caract\xE8res saisis, puis " -> ", puis ce qu\u2019ils deviennent : (c) -> \xA9. Une r\xE8gle se d\xE9clenche \xE0 la saisie du dernier caract\xE8re de sa s\xE9quence, aux m\xEAmes endroits que les r\xE8gles ci-dessus, et Retour arri\xE8re juste apr\xE8s r\xE9tablit ce que vous avez saisi. Les r\xE8gles ci-dessus passent d\u2019abord : une s\xE9quence qu\u2019elles g\xE8rent aussi n\u2019utilise la v\xF4tre que tant que leur interrupteur est d\xE9sactiv\xE9. Une s\xE9quence doit compter au moins deux caract\xE8res.',
  "setting.stylePreset.name": "Pr\xE9r\xE9glage de style",
  "setting.stylePreset.desc": "R\xE8gle d\u2019un coup les interrupteurs ci-dessus : R\xE9daction, Acad\xE9mique, D\xE9veloppeur (discret) ou Par d\xE9faut. Vos dossiers, le style de guillemets (sauf pour D\xE9veloppeur) et vos propres substitutions sont conserv\xE9s.",
  "setting.rulePreset.name": "Ajouter un pr\xE9r\xE9glage",
  "setting.rulePreset.desc": "Ajoute \xE0 votre liste un ensemble de r\xE8gles pr\xEAt \xE0 l\u2019emploi ; les r\xE8gles d\xE9j\xE0 pr\xE9sentes sont laiss\xE9es telles quelles. >> n\u2019est jamais remplac\xE9 en d\xE9but de ligne, o\xF9 il ouvre une citation imbriqu\xE9e.",
  "setting.keepsOut.name": "O\xF9 rien n\u2019est substitu\xE9",
  "setting.keepsOut.desc": "Les blocs de code, le code en ligne, les formules, les cibles de liens, le frontmatter, les balises et commentaires HTML et les expressions Templater restent exactement tels que saisis. Retour arri\xE8re juste apr\xE8s une substitution r\xE9tablit ce que vous avez saisi.",
  "setting.folderStatus.name": "Dossiers utilis\xE9s",
  "setting.rulesStatus.name": "R\xE8gles utilis\xE9es",
  // Status lines under the text areas
  "status.noFolders": "Aucun dossier pour l\u2019instant.",
  "status.folders.one": "1 dossier utilis\xE9.",
  "status.folders.other": "{count} dossiers utilis\xE9s.",
  "status.noRules": "Aucune r\xE8gle pour l\u2019instant.",
  "status.rules.one": "1 r\xE8gle utilis\xE9e.",
  "status.rules.other": "{count} r\xE8gles utilis\xE9es.",
  "status.ignored": "Ignor\xE9e, ligne {line} ({text}) : {reason}.",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": 'il manque "{separator}" entre la s\xE9quence et le remplacement',
  "reason.sequenceLineBreak": "la s\xE9quence contient un saut de ligne",
  "reason.sequenceEmpty": "la s\xE9quence est vide",
  "reason.sequenceSpaces": "la s\xE9quence ne contient que des espaces",
  "reason.sequenceShort": "la s\xE9quence doit compter au moins deux caract\xE8res",
  "reason.sequenceEmoji": "la s\xE9quence se termine par un \xE9moji ou un caract\xE8re semblable",
  "reason.replacementLineBreak": "le remplacement contient un saut de ligne",
  "reason.replacementEmpty": "le remplacement est vide",
  "reason.replacementSame": "le remplacement est identique \xE0 la s\xE9quence",
  "reason.duplicate": "la m\xEAme s\xE9quence est d\xE9j\xE0 \xE0 la ligne {line}",
  "reason.clash": "la r\xE8gle de la ligne {line} se d\xE9clenche d\xE9j\xE0 avec les m\xEAmes touches",
  "reason.folderFormat": '\xE9crivez le dossier, puis " -> ", puis la convention',
  "reason.noFolder": 'aucun dossier avant "->"',
  "reason.unknownConvention": "convention inconnue",
  // Modals
  "modal.preset.title": "Choisir un style typographique",
  "modal.preset.intro": "Choisissez un point de d\xE9part. Vous pourrez modifier chaque interrupteur plus tard dans les r\xE9glages du module, o\xF9 ces pr\xE9r\xE9glages sont aussi list\xE9s.",
  "modal.preset.keepDefault": "Garder le r\xE9glage par d\xE9faut",
  "modal.preset.use": "Utiliser {preset}",
  "modal.quotes.placeholder": "Guillemets de cette note",
  "modal.quotes.follow": "Suivre le dossier et le r\xE9glage global (supprimer la propri\xE9t\xE9)",
  "modal.quotes.straight": "Guillemets droits (d\xE9sactiv\xE9)"
};
var fr_default = fr;

// src/locales/ja.ts
var ja = {
  // Commands
  "command.toggleNote": "\u3053\u306E\u30CE\u30FC\u30C8\u306E\u81EA\u52D5\u7F6E\u63DB\u3092\u30AA\u30D5\uFF0F\u30AA\u30F3\u306B\u3059\u308B",
  "command.setQuotes": "\u3053\u306E\u30CE\u30FC\u30C8\u306E\u5F15\u7528\u7B26\u3092\u8A2D\u5B9A\u2026",
  "command.applyToText": "\u9078\u629E\u7BC4\u56F2\u307E\u305F\u306F\u30CE\u30FC\u30C8\u5168\u4F53\u306B\u7D44\u7248\u3092\u9069\u7528",
  // Notices
  "notice.substitutionsOff": "Typography: \u3053\u306E\u30CE\u30FC\u30C8\u306E\u81EA\u52D5\u7F6E\u63DB\u306F\u30AA\u30D5\u3067\u3059\u3002",
  "notice.substitutionsOn": "Typography: \u3053\u306E\u30CE\u30FC\u30C8\u306E\u81EA\u52D5\u7F6E\u63DB\u306F\u30AA\u30F3\u3067\u3059\u3002",
  "notice.removedButExcluded": "Typography: \u30D7\u30ED\u30D1\u30C6\u30A3\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u304C\u3001\u3053\u306E\u30CE\u30FC\u30C8\u306F\u9664\u5916\u30D5\u30A9\u30EB\u30C0\u5185\u306B\u3042\u308B\u305F\u3081\u3001\u81EA\u52D5\u7F6E\u63DB\u306F\u30AA\u30D5\u306E\u307E\u307E\u3067\u3059\u3002",
  "notice.nothingToChange": "Typography: \u5909\u66F4\u3059\u308B\u7B87\u6240\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
  "notice.changedLines.one": "Typography: 1 \u884C\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002",
  "notice.changedLines.other": "Typography: {count} \u884C\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002",
  "notice.quotesFollowFolder": "Typography: \u3053\u306E\u30CE\u30FC\u30C8\u306F\u518D\u3073\u30D5\u30A9\u30EB\u30C0\u8A2D\u5B9A\u3068\u5168\u4F53\u8A2D\u5B9A\u306E\u5F15\u7528\u7B26\u306B\u5F93\u3044\u307E\u3059\u3002",
  "notice.quotesSet": "Typography: \u3053\u306E\u30CE\u30FC\u30C8\u306E\u5F15\u7528\u7B26\u3092 {style} \u306B\u3057\u307E\u3057\u305F\u3002",
  "notice.quotesStraight": "Typography: \u3053\u306E\u30CE\u30FC\u30C8\u306E\u5F15\u7528\u7B26\u3092\u30B9\u30C8\u30EC\u30FC\u30C8\u5F15\u7528\u7B26\u306B\u3057\u307E\u3057\u305F\u3002",
  "notice.presetApplied": "Typography: \u30D7\u30EA\u30BB\u30C3\u30C8\u300C{preset}\u300D\u3092\u9069\u7528\u3057\u307E\u3057\u305F\u3002",
  "notice.presetRulesPresent": "Typography: \u305D\u308C\u3089\u306E\u30EB\u30FC\u30EB\u306F\u3059\u3067\u306B\u30EA\u30B9\u30C8\u306B\u3042\u308A\u307E\u3059\u3002",
  "notice.rulesAdded.one": "Typography: \u30EB\u30FC\u30EB\u3092 1 \u4EF6\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002",
  "notice.rulesAdded.other": "Typography: \u30EB\u30FC\u30EB\u3092 {count} \u4EF6\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "\u82F1\u8A9E \u201C \u201D \u2018 \u2019",
  "convention.german": "\u30C9\u30A4\u30C4\u8A9E \u201E \u201C \u201A \u2018",
  "convention.french": "\u30D5\u30E9\u30F3\u30B9\u8A9E \xAB \xBB \u2039 \u203A",
  "convention.spanish": "\u30B9\u30DA\u30A4\u30F3\u8A9E \xAB \xBB \u201C \u201D",
  "convention.swedish": "\u30B9\u30A6\u30A7\u30FC\u30C7\u30F3\u8A9E \u201D \u201D \u2019 \u2019",
  "convention.polish": "\u30DD\u30FC\u30E9\u30F3\u30C9\u8A9E \u201E \u201D \u201A \u2019",
  "convention.russian": "\u30ED\u30B7\u30A2\u8A9E \xAB \xBB \u201E \u201C",
  "convention.off": "\u30B9\u30C8\u30EC\u30FC\u30C8\u5F15\u7528\u7B26\u306F\u305D\u306E\u307E\u307E\u306B\u3059\u308B",
  // Style presets
  "stylePreset.default.label": "\u30C7\u30D5\u30A9\u30EB\u30C8",
  "stylePreset.default.desc": "\u30B9\u30DE\u30FC\u30C8\u5F15\u7528\u7B26\u3001\u30C0\u30C3\u30B7\u30E5\u3001\u4E09\u70B9\u30EA\u30FC\u30C0\u30FC\u3001\u77E2\u5370\u3001\u8A18\u53F7\u3002\u81EA\u52D5\u306E\u5927\u6587\u5B57\u5316\u306F\u306A\u3057\u3002",
  "stylePreset.writer.label": "\u30E9\u30A4\u30BF\u30FC",
  "stylePreset.writer.desc": "\u6587\u7AE0\u5411\u3051: \u30B9\u30DE\u30FC\u30C8\u5F15\u7528\u7B26\u3001\u30C0\u30C3\u30B7\u30E5\u3001\u4E09\u70B9\u30EA\u30FC\u30C0\u30FC\u3001\u5404\u6587\u306E\u5148\u982D\u306E\u5927\u6587\u5B57\u5316\u3002\u77E2\u5370\u3068\u6570\u5B66\u8A18\u53F7\u306F\u306A\u3057\u3002",
  "stylePreset.academic.label": "\u30A2\u30AB\u30C7\u30DF\u30C3\u30AF",
  "stylePreset.academic.desc": "\u77E2\u5370\u3068\u6570\u5B66\u8A18\u53F7\u3092\u542B\u3080\u3059\u3079\u3066\u3092\u30AA\u30F3\u306B\u3057\u3001\u81EA\u52D5\u306E\u5927\u6587\u5B57\u5316\u3082\u884C\u3044\u307E\u3059\u3002",
  "stylePreset.developer.label": "\u958B\u767A\u8005\uFF08\u63A7\u3048\u3081\uFF09",
  "stylePreset.developer.desc": "\u30B9\u30C8\u30EC\u30FC\u30C8\u5F15\u7528\u7B26\u3068\u30CF\u30A4\u30D5\u30F3\u306F\u5165\u529B\u3057\u305F\u307E\u307E\u3002\u77E2\u5370\u3068\u6570\u5B66\u8A18\u53F7\u3060\u3051\u3092\u5909\u63DB\u3057\u307E\u3059\u3002",
  // Rule presets
  "rulePreset.guillemets": "\u30AE\u30E5\u30E1 << >>",
  "rulePreset.symbols": "\u8A18\u53F7 (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "\u5F15\u7528\u7B26",
  "setting.quoteStyle.desc": "\u30B9\u30C8\u30EC\u30FC\u30C8\u5F15\u7528\u7B26\u3092\u3069\u306E\u8868\u8A18\u898F\u5247\u306B\u5909\u63DB\u3059\u308B\u304B\u3002\u30A2\u30DD\u30B9\u30C8\u30ED\u30D5\u30A3\u306F\u3069\u306E\u898F\u5247\u3067\u3082\u540C\u3058\u6587\u5B57\u306A\u306E\u3067\u3001\u5225\u306B\u8A2D\u5B9A\u3057\u307E\u3059\u3002",
  "setting.smartApostrophes.name": "\u30A2\u30DD\u30B9\u30C8\u30ED\u30D5\u30A3",
  "setting.smartApostrophes.desc": "it's \u3092 it\u2019s \u306B\u3057\u307E\u3059\u3002\u5F15\u7528\u7B26\u306E\u8A2D\u5B9A\u306B\u304B\u304B\u308F\u3089\u305A\u52D5\u4F5C\u3057\u307E\u3059\u3002",
  "setting.skipClosingQuote.name": "\u9589\u3058\u5F15\u7528\u7B26\u3092\u98DB\u3073\u8D8A\u3048\u308B",
  "setting.skipClosingQuote.desc": "\u3059\u3067\u306B\u9589\u3058\u5F15\u7528\u7B26\u304C\u3042\u308B\u4F4D\u7F6E\u3067\u9589\u3058\u5F15\u7528\u7B26\u3092\u5165\u529B\u3059\u308B\u3068\u30012 \u3064\u76EE\u3092\u8FFD\u52A0\u305B\u305A\u306B\u30AB\u30FC\u30BD\u30EB\u304C\u305D\u306E\u5F8C\u308D\u3078\u79FB\u52D5\u3057\u307E\u3059\u3002",
  "setting.capitalizeSentences.name": "\u6587\u982D\u3092\u5927\u6587\u5B57\u306B\u3059\u308B",
  "setting.capitalizeSentences.desc": "\u884C\u982D\u3001\u304A\u3088\u3073 . ! ? \u306E\u5F8C\u306E\u6587\u982D\u306E\u6587\u5B57\u3092\u5927\u6587\u5B57\u3067\u5165\u529B\u3057\u307E\u3059\u3002\u30B3\u30FC\u30C9\u3001\u30EA\u30F3\u30AF\u3001\u30BF\u30B0\u3001\u30D1\u30B9\u306E\u4E2D\u3084\u3001Mr.\u3001e.g.\u3001etc. \u306A\u3069\u306E\u7565\u8A9E\u306E\u5F8C\u3067\u306F\u52D5\u4F5C\u3057\u307E\u305B\u3093\u3002\u76F4\u5F8C\u306B Backspace \u3092\u62BC\u3059\u3068\u5C0F\u6587\u5B57\u306B\u623B\u308A\u307E\u3059\u3002",
  "setting.tabOut.name": "Tab \u3067\u629C\u3051\u51FA\u3059",
  "setting.tabOut.desc": "\u30AB\u30FC\u30BD\u30EB\u304C\u9589\u3058\u5F15\u7528\u7B26\u3084\u9589\u3058\u62EC\u5F27\u306E\u76F4\u524D\u306B\u3042\u308B\u3068\u304D\u3001Tab \u3067\u305D\u306E\u5F8C\u308D\u3078\u79FB\u52D5\u3057\u307E\u3059\u3002\u30EA\u30B9\u30C8\u3067\u306F Tab \u306F\u5F15\u304D\u7D9A\u304D\u30A4\u30F3\u30C7\u30F3\u30C8\u306B\u3001\u8868\u3067\u306F\u30BB\u30EB\u9593\u306E\u79FB\u52D5\u306B\u4F7F\u308F\u308C\u307E\u3059\u3002",
  "setting.wrapSelection.name": "\u9078\u629E\u7BC4\u56F2\u3092\u5F15\u7528\u7B26\u3067\u56F2\u3080",
  "setting.wrapSelection.desc": "\u30C6\u30AD\u30B9\u30C8\u3092\u9078\u629E\u3057\u3066\u5F15\u7528\u7B26\u3092\u5165\u529B\u3059\u308B\u3068\u3001\u7F6E\u304D\u63DB\u3048\u305A\u306B\u30B9\u30DE\u30FC\u30C8\u5F15\u7528\u7B26\u3067\u56F2\u307F\u307E\u3059\u3002",
  "setting.dashes.name": "\u30C0\u30C3\u30B7\u30E5",
  "setting.dashes.desc": "-- \u3092 \u2013 \u306B\u3001--- \u3092 \u2014 \u306B\u3057\u307E\u3059\u3002",
  "setting.ellipsis.name": "\u4E09\u70B9\u30EA\u30FC\u30C0\u30FC",
  "setting.ellipsis.desc": "... \u3092 \u2026 \u306B\u3057\u307E\u3059\u3002",
  "setting.arrows.name": "\u77E2\u5370",
  "setting.arrows.desc": "-> \u3092 \u2192\u3001<- \u3092 \u2190\u3001<-> \u3092 \u2194\u3001=> \u3092 \u21D2 \u306B\u3057\u307E\u3059\u3002",
  "setting.mathSymbols.name": "\u6570\u5B66\u8A18\u53F7",
  "setting.mathSymbols.desc": ">= \u3092 \u2265\u3001<= \u3092 \u2264\u3001!= \u3092 \u2260\u3001+- \u3092 \xB1 \u306B\u3057\u307E\u3059\u3002",
  "setting.excludedFolders.name": "\u9664\u5916\u30D5\u30A9\u30EB\u30C0",
  "setting.excludedFolders.desc": '\u3053\u308C\u3089\u306E\u30D5\u30A9\u30EB\u30C0\u5185\u306E\u30CE\u30FC\u30C8\u3067\u306F\u4F55\u3082\u7F6E\u63DB\u3057\u307E\u305B\u3093\u30021 \u884C\u306B 1 \u30D5\u30A9\u30EB\u30C0\uFF08\u4F8B: Code \u3084 Templates/Raw\uFF09\u3002\u500B\u5225\u306E\u30CE\u30FC\u30C8\u306F\u3001\u30D7\u30ED\u30D1\u30C6\u30A3 "typography: off" \u307E\u305F\u306F\u30B3\u30DE\u30F3\u30C9\u300C\u3053\u306E\u30CE\u30FC\u30C8\u306E\u81EA\u52D5\u7F6E\u63DB\u3092\u30AA\u30D5\uFF0F\u30AA\u30F3\u306B\u3059\u308B\u300D\u3067\u5BFE\u8C61\u5916\u306B\u3067\u304D\u307E\u3059\u3002',
  "setting.useLangProperty.name": "\u30CE\u30FC\u30C8\u306E lang \u30D7\u30ED\u30D1\u30C6\u30A3\u3092\u4F7F\u3046",
  "setting.useLangProperty.desc": '"lang: de" \u306E\u3088\u3046\u306A\u30D7\u30ED\u30D1\u30C6\u30A3\u3092\u6301\u3064\u30CE\u30FC\u30C8\u306B\u306F\u3001\u305D\u306E\u8A00\u8A9E\u306E\u5F15\u7528\u7B26\uFF08\u82F1\u8A9E\u3001\u30C9\u30A4\u30C4\u8A9E\u3001\u30D5\u30E9\u30F3\u30B9\u8A9E\u3001\u30B9\u30DA\u30A4\u30F3\u8A9E\u3001\u30B9\u30A6\u30A7\u30FC\u30C7\u30F3\u8A9E\u3001\u30DD\u30FC\u30E9\u30F3\u30C9\u8A9E\u3001\u30ED\u30B7\u30A2\u8A9E\uFF09\u3092\u4F7F\u3044\u307E\u3059\u3002\u305F\u3060\u3057\u3001\u30CE\u30FC\u30C8\u81EA\u8EAB\u306B "typography-quotes" \u304C\u3042\u308B\u5834\u5408\u306F\u305D\u3061\u3089\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002\u65E2\u5B58\u306E\u30CE\u30FC\u30C8\u306B lang \u30D7\u30ED\u30D1\u30C6\u30A3\u304C\u4ED8\u3044\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308B\u305F\u3081\u3001\u521D\u671F\u8A2D\u5B9A\u3067\u306F\u30AA\u30D5\u3067\u3059\u3002',
  "setting.quotesByFolder.name": "\u30D5\u30A9\u30EB\u30C0\u3054\u3068\u306E\u5F15\u7528\u7B26",
  "setting.quotesByFolder.desc": '1 \u884C\u306B 1 \u4EF6\u3001\u30D5\u30A9\u30EB\u30C0\u3001" -> "\u3001\u8868\u8A18\u898F\u5247\u306E\u9806\u306B\u66F8\u304D\u307E\u3059\uFF08\u4F8B: Deutsch -> german\uFF09\u3002\u3088\u308A\u5177\u4F53\u7684\u306A\u30D5\u30A9\u30EB\u30C0\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002\u30CE\u30FC\u30C8\u306E "lang" \u30D7\u30ED\u30D1\u30C6\u30A3\uFF08\u4E0A\u306E\u30B9\u30A4\u30C3\u30C1\u304C\u30AA\u30F3\u306E\u5834\u5408\uFF09\u3068 "typography-quotes" \u30D7\u30ED\u30D1\u30C6\u30A3\u306F\u3001\u30D5\u30A9\u30EB\u30C0\u8A2D\u5B9A\u3088\u308A\u512A\u5148\u3055\u308C\u307E\u3059\u3002\u8868\u8A18\u898F\u5247: english\u3001german\u3001french\u3001spanish\u3001swedish\u3001polish\u3001russian\u3001\u30B9\u30C8\u30EC\u30FC\u30C8\u5F15\u7528\u7B26\u306B\u3059\u308B\u5834\u5408\u306F off\u3002',
  "setting.customRules.name": "\u72EC\u81EA\u306E\u7F6E\u63DB",
  "setting.customRules.desc": '1 \u884C\u306B 1 \u3064\u306E\u30EB\u30FC\u30EB\u3092\u3001\u5165\u529B\u3059\u308B\u6587\u5B57\u3001" -> "\u3001\u5909\u63DB\u5F8C\u306E\u6587\u5B57\u306E\u9806\u306B\u66F8\u304D\u307E\u3059\uFF08\u4F8B: (c) -> \xA9\uFF09\u3002\u30EB\u30FC\u30EB\u306F\u4E26\u3073\u306E\u6700\u5F8C\u306E\u6587\u5B57\u3092\u5165\u529B\u3057\u305F\u6642\u70B9\u3067\u50CD\u304D\u3001\u4E0A\u306E\u30EB\u30FC\u30EB\u3068\u540C\u3058\u5834\u6240\u3067\u6709\u52B9\u3067\u3059\u3002\u76F4\u5F8C\u306B Backspace \u3092\u62BC\u3059\u3068\u5165\u529B\u3057\u305F\u6587\u5B57\u306B\u623B\u308A\u307E\u3059\u3002\u4E0A\u306E\u30EB\u30FC\u30EB\u304C\u512A\u5148\u3055\u308C\u3001\u305D\u308C\u3089\u3082\u6271\u3046\u4E26\u3073\u306F\u3001\u305D\u306E\u30B9\u30A4\u30C3\u30C1\u304C\u30AA\u30D5\u306E\u9593\u3060\u3051\u72EC\u81EA\u30EB\u30FC\u30EB\u304C\u4F7F\u308F\u308C\u307E\u3059\u3002\u4E26\u3073\u306F 2 \u6587\u5B57\u4EE5\u4E0A\u5FC5\u8981\u3067\u3059\u3002',
  "setting.stylePreset.name": "\u30B9\u30BF\u30A4\u30EB\u30D7\u30EA\u30BB\u30C3\u30C8",
  "setting.stylePreset.desc": "\u4E0A\u306E\u30B9\u30A4\u30C3\u30C1\u3092\u307E\u3068\u3081\u3066\u8A2D\u5B9A\u3057\u307E\u3059: \u30E9\u30A4\u30BF\u30FC\u3001\u30A2\u30AB\u30C7\u30DF\u30C3\u30AF\u3001\u958B\u767A\u8005\uFF08\u63A7\u3048\u3081\uFF09\u3001\u30C7\u30D5\u30A9\u30EB\u30C8\u3002\u30D5\u30A9\u30EB\u30C0\u3001\u5F15\u7528\u7B26\u306E\u30B9\u30BF\u30A4\u30EB\uFF08\u958B\u767A\u8005\u3092\u9664\u304F\uFF09\u3001\u72EC\u81EA\u306E\u7F6E\u63DB\u306F\u4FDD\u6301\u3055\u308C\u307E\u3059\u3002",
  "setting.rulePreset.name": "\u30D7\u30EA\u30BB\u30C3\u30C8\u3092\u8FFD\u52A0",
  "setting.rulePreset.desc": "\u7528\u610F\u3055\u308C\u305F\u30EB\u30FC\u30EB\u306E\u30BB\u30C3\u30C8\u3092\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0\u3057\u307E\u3059\u3002\u3059\u3067\u306B\u3042\u308B\u30EB\u30FC\u30EB\u306F\u305D\u306E\u307E\u307E\u3067\u3059\u3002>> \u306F\u3001\u5165\u308C\u5B50\u306E\u5F15\u7528\u3092\u59CB\u3081\u308B\u884C\u982D\u3067\u306F\u7F6E\u63DB\u3055\u308C\u307E\u305B\u3093\u3002",
  "setting.keepsOut.name": "\u7F6E\u63DB\u3057\u306A\u3044\u5834\u6240",
  "setting.keepsOut.desc": "\u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF\u3001\u30A4\u30F3\u30E9\u30A4\u30F3\u30B3\u30FC\u30C9\u3001\u6570\u5F0F\u3001\u30EA\u30F3\u30AF\u5148\u3001\u30D5\u30ED\u30F3\u30C8\u30DE\u30BF\u30FC\u3001HTML \u30BF\u30B0\u3068\u30B3\u30E1\u30F3\u30C8\u3001Templater \u306E\u5F0F\u306F\u3001\u5165\u529B\u3057\u305F\u307E\u307E\u306B\u306A\u308A\u307E\u3059\u3002\u7F6E\u63DB\u306E\u76F4\u5F8C\u306B Backspace \u3092\u62BC\u3059\u3068\u5165\u529B\u3057\u305F\u6587\u5B57\u306B\u623B\u308A\u307E\u3059\u3002",
  "setting.folderStatus.name": "\u6709\u52B9\u306A\u30D5\u30A9\u30EB\u30C0",
  "setting.rulesStatus.name": "\u6709\u52B9\u306A\u30EB\u30FC\u30EB",
  // Status lines under the text areas
  "status.noFolders": "\u30D5\u30A9\u30EB\u30C0\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002",
  "status.folders.one": "1 \u4EF6\u306E\u30D5\u30A9\u30EB\u30C0\u304C\u6709\u52B9\u3067\u3059\u3002",
  "status.folders.other": "{count} \u4EF6\u306E\u30D5\u30A9\u30EB\u30C0\u304C\u6709\u52B9\u3067\u3059\u3002",
  "status.noRules": "\u30EB\u30FC\u30EB\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002",
  "status.rules.one": "1 \u4EF6\u306E\u30EB\u30FC\u30EB\u304C\u6709\u52B9\u3067\u3059\u3002",
  "status.rules.other": "{count} \u4EF6\u306E\u30EB\u30FC\u30EB\u304C\u6709\u52B9\u3067\u3059\u3002",
  "status.ignored": "\u7121\u8996: {line} \u884C\u76EE\uFF08{text}\uFF09: {reason}\u3002",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": '\u4E26\u3073\u3068\u7F6E\u63DB\u5F8C\u306E\u6587\u5B57\u306E\u9593\u306B "{separator}" \u304C\u3042\u308A\u307E\u305B\u3093',
  "reason.sequenceLineBreak": "\u4E26\u3073\u306B\u6539\u884C\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059",
  "reason.sequenceEmpty": "\u4E26\u3073\u304C\u7A7A\u3067\u3059",
  "reason.sequenceSpaces": "\u4E26\u3073\u304C\u7A7A\u767D\u3060\u3051\u3067\u3059",
  "reason.sequenceShort": "\u4E26\u3073\u306F 2 \u6587\u5B57\u4EE5\u4E0A\u5FC5\u8981\u3067\u3059",
  "reason.sequenceEmoji": "\u4E26\u3073\u306E\u672B\u5C3E\u304C\u7D75\u6587\u5B57\u306A\u3069\u306E\u6587\u5B57\u3067\u3059",
  "reason.replacementLineBreak": "\u7F6E\u63DB\u5F8C\u306E\u6587\u5B57\u306B\u6539\u884C\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059",
  "reason.replacementEmpty": "\u7F6E\u63DB\u5F8C\u306E\u6587\u5B57\u304C\u7A7A\u3067\u3059",
  "reason.replacementSame": "\u7F6E\u63DB\u5F8C\u306E\u6587\u5B57\u304C\u4E26\u3073\u3068\u540C\u3058\u3067\u3059",
  "reason.duplicate": "\u540C\u3058\u4E26\u3073\u304C\u3059\u3067\u306B {line} \u884C\u76EE\u306B\u3042\u308A\u307E\u3059",
  "reason.clash": "{line} \u884C\u76EE\u306E\u30EB\u30FC\u30EB\u304C\u3059\u3067\u306B\u540C\u3058\u30AD\u30FC\u5165\u529B\u3067\u50CD\u304D\u307E\u3059",
  "reason.folderFormat": '\u30D5\u30A9\u30EB\u30C0\u3001" -> "\u3001\u8868\u8A18\u898F\u5247\u306E\u9806\u306B\u66F8\u3044\u3066\u304F\u3060\u3055\u3044',
  "reason.noFolder": '"->" \u306E\u524D\u306B\u30D5\u30A9\u30EB\u30C0\u304C\u3042\u308A\u307E\u305B\u3093',
  "reason.unknownConvention": "\u4E0D\u660E\u306A\u8868\u8A18\u898F\u5247\u3067\u3059",
  // Modals
  "modal.preset.title": "\u7D44\u7248\u30B9\u30BF\u30A4\u30EB\u3092\u9078\u629E",
  "modal.preset.intro": "\u51FA\u767A\u70B9\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002\u30B9\u30A4\u30C3\u30C1\u306F\u3042\u3068\u304B\u3089\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u8A2D\u5B9A\u3067\u3059\u3079\u3066\u5909\u66F4\u3067\u304D\u3001\u3053\u308C\u3089\u306E\u30D7\u30EA\u30BB\u30C3\u30C8\u3082\u305D\u3053\u306B\u4E26\u3093\u3067\u3044\u307E\u3059\u3002",
  "modal.preset.keepDefault": "\u30C7\u30D5\u30A9\u30EB\u30C8\u306E\u307E\u307E\u306B\u3059\u308B",
  "modal.preset.use": "\u300C{preset}\u300D\u3092\u4F7F\u3046",
  "modal.quotes.placeholder": "\u3053\u306E\u30CE\u30FC\u30C8\u306E\u5F15\u7528\u7B26",
  "modal.quotes.follow": "\u30D5\u30A9\u30EB\u30C0\u8A2D\u5B9A\u3068\u5168\u4F53\u8A2D\u5B9A\u306B\u5F93\u3046\uFF08\u30D7\u30ED\u30D1\u30C6\u30A3\u3092\u524A\u9664\uFF09",
  "modal.quotes.straight": "\u30B9\u30C8\u30EC\u30FC\u30C8\u5F15\u7528\u7B26\uFF08\u30AA\u30D5\uFF09"
};
var ja_default = ja;

// src/locales/ko.ts
var ko = {
  // Commands
  "command.toggleNote": "\uC774 \uB178\uD2B8\uC758 \uC790\uB3D9 \uCE58\uD658 \uB044\uAE30/\uCF1C\uAE30",
  "command.setQuotes": "\uC774 \uB178\uD2B8\uC758 \uB530\uC634\uD45C \uC124\uC815\u2026",
  "command.applyToText": "\uC120\uD0DD \uC601\uC5ED \uB610\uB294 \uB178\uD2B8 \uC804\uCCB4\uC5D0 \uC870\uD310 \uC801\uC6A9",
  // Notices
  "notice.substitutionsOff": "Typography: \uC774 \uB178\uD2B8\uC758 \uC790\uB3D9 \uCE58\uD658\uC774 \uAEBC\uC838 \uC788\uC2B5\uB2C8\uB2E4.",
  "notice.substitutionsOn": "Typography: \uC774 \uB178\uD2B8\uC758 \uC790\uB3D9 \uCE58\uD658\uC774 \uCF1C\uC838 \uC788\uC2B5\uB2C8\uB2E4.",
  "notice.removedButExcluded": "Typography: \uC18D\uC131\uC744 \uC81C\uAC70\uD588\uC9C0\uB9CC, \uC774 \uB178\uD2B8\uB294 \uC81C\uC678\uB41C \uD3F4\uB354\uC5D0 \uC788\uC5B4 \uC790\uB3D9 \uCE58\uD658\uC740 \uACC4\uC18D \uAEBC\uC838 \uC788\uC2B5\uB2C8\uB2E4.",
  "notice.nothingToChange": "Typography: \uBC14\uAFC0 \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "notice.changedLines.one": "Typography: 1\uC904\uC744 \uBCC0\uACBD\uD588\uC2B5\uB2C8\uB2E4.",
  "notice.changedLines.other": "Typography: {count}\uC904\uC744 \uBCC0\uACBD\uD588\uC2B5\uB2C8\uB2E4.",
  "notice.quotesFollowFolder": "Typography: \uC774 \uB178\uD2B8\uB294 \uB2E4\uC2DC \uD3F4\uB354\uBCC4 \uC124\uC815\uACFC \uC804\uCCB4 \uC124\uC815\uC758 \uB530\uC634\uD45C\uB97C \uB530\uB985\uB2C8\uB2E4.",
  "notice.quotesSet": "Typography: \uC774 \uB178\uD2B8\uC758 \uB530\uC634\uD45C\uB97C {style}(\uC73C)\uB85C \uC124\uC815\uD588\uC2B5\uB2C8\uB2E4.",
  "notice.quotesStraight": "Typography: \uC774 \uB178\uD2B8\uC758 \uB530\uC634\uD45C\uB97C \uACE7\uC740 \uB530\uC634\uD45C\uB85C \uC124\uC815\uD588\uC2B5\uB2C8\uB2E4.",
  "notice.presetApplied": 'Typography: "{preset}" \uD504\uB9AC\uC14B\uC744 \uC801\uC6A9\uD588\uC2B5\uB2C8\uB2E4.',
  "notice.presetRulesPresent": "Typography: \uD574\uB2F9 \uADDC\uCE59\uC740 \uC774\uBBF8 \uBAA9\uB85D\uC5D0 \uC788\uC2B5\uB2C8\uB2E4.",
  "notice.rulesAdded.one": "Typography: \uADDC\uCE59 1\uAC1C\uB97C \uCD94\uAC00\uD588\uC2B5\uB2C8\uB2E4.",
  "notice.rulesAdded.other": "Typography: \uADDC\uCE59 {count}\uAC1C\uB97C \uCD94\uAC00\uD588\uC2B5\uB2C8\uB2E4.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "\uC601\uC5B4 \u201C \u201D \u2018 \u2019",
  "convention.german": "\uB3C5\uC77C\uC5B4 \u201E \u201C \u201A \u2018",
  "convention.french": "\uD504\uB791\uC2A4\uC5B4 \xAB \xBB \u2039 \u203A",
  "convention.spanish": "\uC2A4\uD398\uC778\uC5B4 \xAB \xBB \u201C \u201D",
  "convention.swedish": "\uC2A4\uC6E8\uB374\uC5B4 \u201D \u201D \u2019 \u2019",
  "convention.polish": "\uD3F4\uB780\uB4DC\uC5B4 \u201E \u201D \u201A \u2019",
  "convention.russian": "\uB7EC\uC2DC\uC544\uC5B4 \xAB \xBB \u201E \u201C",
  "convention.off": "\uACE7\uC740 \uB530\uC634\uD45C \uADF8\uB300\uB85C \uB450\uAE30",
  // Style presets
  "stylePreset.default.label": "\uAE30\uBCF8",
  "stylePreset.default.desc": "\uB465\uADFC \uB530\uC634\uD45C, \uB300\uC2DC, \uB9D0\uC904\uC784\uD45C, \uD654\uC0B4\uD45C, \uAE30\uD638. \uC790\uB3D9 \uB300\uBB38\uC790 \uBCC0\uD658\uC740 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "stylePreset.writer.label": "\uAE00\uC4F0\uAE30",
  "stylePreset.writer.desc": "\uC0B0\uBB38\uC6A9: \uB465\uADFC \uB530\uC634\uD45C, \uB300\uC2DC, \uB9D0\uC904\uC784\uD45C, \uBB38\uC7A5 \uCCAB \uAE00\uC790 \uB300\uBB38\uC790 \uBCC0\uD658. \uD654\uC0B4\uD45C\uC640 \uC218\uD559 \uAE30\uD638\uB294 \uC81C\uC678\uD569\uB2C8\uB2E4.",
  "stylePreset.academic.label": "\uD559\uC220",
  "stylePreset.academic.desc": "\uD654\uC0B4\uD45C\uC640 \uC218\uD559 \uAE30\uD638\uB97C \uD3EC\uD568\uD574 \uBAA8\uB450 \uCF1C\uACE0, \uC790\uB3D9 \uB300\uBB38\uC790 \uBCC0\uD658\uB3C4 \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
  "stylePreset.developer.label": "\uAC1C\uBC1C\uC790(\uC870\uC6A9\uD788)",
  "stylePreset.developer.desc": "\uACE7\uC740 \uB530\uC634\uD45C\uC640 \uD558\uC774\uD508\uC740 \uC785\uB825\uD55C \uADF8\uB300\uB85C \uB461\uB2C8\uB2E4. \uD654\uC0B4\uD45C\uC640 \uC218\uD559 \uAE30\uD638\uB9CC \uBCC0\uD658\uD569\uB2C8\uB2E4.",
  // Rule presets
  "rulePreset.guillemets": "\uAE30\uC720\uBA54 << >>",
  "rulePreset.symbols": "\uAE30\uD638 (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "\uB530\uC634\uD45C",
  "setting.quoteStyle.desc": "\uACE7\uC740 \uB530\uC634\uD45C\uB97C \uC5B4\uB5A4 \uD45C\uAE30 \uADDC\uCE59\uC73C\uB85C \uBC14\uAFC0\uC9C0 \uC815\uD569\uB2C8\uB2E4. \uC544\uD3EC\uC2A4\uD2B8\uB85C\uD53C\uB294 \uBAA8\uB4E0 \uADDC\uCE59\uC5D0\uC11C \uAC19\uC740 \uBB38\uC790\uC774\uBBC0\uB85C \uB530\uB85C \uC124\uC815\uD569\uB2C8\uB2E4.",
  "setting.smartApostrophes.name": "\uC544\uD3EC\uC2A4\uD2B8\uB85C\uD53C",
  "setting.smartApostrophes.desc": "it's\uB97C it\u2019s\uB85C \uBC14\uAFC9\uB2C8\uB2E4. \uB530\uC634\uD45C \uC124\uC815\uACFC \uAD00\uACC4\uC5C6\uC774 \uB3D9\uC791\uD569\uB2C8\uB2E4.",
  "setting.skipClosingQuote.name": "\uB2EB\uB294 \uB530\uC634\uD45C \uAC74\uB108\uB6F0\uAE30",
  "setting.skipClosingQuote.desc": "\uB2EB\uB294 \uB530\uC634\uD45C\uAC00 \uC774\uBBF8 \uC788\uB294 \uC790\uB9AC\uC5D0\uC11C \uB2EB\uB294 \uB530\uC634\uD45C\uB97C \uC785\uB825\uD558\uBA74, \uD558\uB098\uB97C \uB354 \uB123\uC9C0 \uC54A\uACE0 \uCEE4\uC11C\uB9CC \uADF8 \uB4A4\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.",
  "setting.capitalizeSentences.name": "\uBB38\uC7A5 \uCCAB \uAE00\uC790 \uB300\uBB38\uC790\uB85C",
  "setting.capitalizeSentences.desc": "\uC904\uC758 \uCCAB \uAE00\uC790\uC640 . ! ? \uB4A4\uC5D0 \uC624\uB294 \uBB38\uC7A5\uC758 \uCCAB \uAE00\uC790\uB97C \uB300\uBB38\uC790\uB85C \uC785\uB825\uD569\uB2C8\uB2E4. \uCF54\uB4DC, \uB9C1\uD06C, \uD0DC\uADF8, \uACBD\uB85C \uC548\uACFC Mr., e.g., etc. \uAC19\uC740 \uC57D\uC5B4 \uB4A4\uC5D0\uC11C\uB294 \uB3D9\uC791\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uBC14\uB85C \uB4A4\uC5D0 Backspace\uB97C \uB204\uB974\uBA74 \uC18C\uBB38\uC790\uB85C \uB418\uB3CC\uC544\uAC11\uB2C8\uB2E4.",
  "setting.tabOut.name": "Tab\uC73C\uB85C \uBE60\uC838\uB098\uC624\uAE30",
  "setting.tabOut.desc": "\uCEE4\uC11C\uAC00 \uB2EB\uB294 \uB530\uC634\uD45C\uB098 \uAD04\uD638 \uBC14\uB85C \uC55E\uC5D0 \uC788\uC744 \uB54C Tab\uC744 \uB204\uB974\uBA74 \uADF8 \uB4A4\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4. \uBAA9\uB85D\uC5D0\uC11C\uB294 Tab\uC774 \uC5EC\uC804\uD788 \uB4E4\uC5EC\uC4F0\uAE30\uB97C \uD558\uACE0, \uD45C\uC5D0\uC11C\uB294 \uC140 \uC0AC\uC774\uB97C \uC774\uB3D9\uD569\uB2C8\uB2E4.",
  "setting.wrapSelection.name": "\uC120\uD0DD \uC601\uC5ED\uC744 \uB530\uC634\uD45C\uB85C \uAC10\uC2F8\uAE30",
  "setting.wrapSelection.desc": "\uD14D\uC2A4\uD2B8\uB97C \uC120\uD0DD\uD558\uACE0 \uB530\uC634\uD45C\uB97C \uC785\uB825\uD558\uBA74, \uD14D\uC2A4\uD2B8\uB97C \uBC14\uAFB8\uB294 \uB300\uC2E0 \uB465\uADFC \uB530\uC634\uD45C\uB85C \uAC10\uC309\uB2C8\uB2E4.",
  "setting.dashes.name": "\uB300\uC2DC",
  "setting.dashes.desc": "--\uB294 \u2013\uB85C, ---\uB294 \u2014\uB85C \uBC14\uB01D\uB2C8\uB2E4.",
  "setting.ellipsis.name": "\uB9D0\uC904\uC784\uD45C",
  "setting.ellipsis.desc": "...\uB294 \u2026\uB85C \uBC14\uB01D\uB2C8\uB2E4.",
  "setting.arrows.name": "\uD654\uC0B4\uD45C",
  "setting.arrows.desc": "->\uB294 \u2192\uB85C, <-\uB294 \u2190\uB85C, <->\uB294 \u2194\uB85C, =>\uB294 \u21D2\uB85C \uBC14\uB01D\uB2C8\uB2E4.",
  "setting.mathSymbols.name": "\uC218\uD559 \uAE30\uD638",
  "setting.mathSymbols.desc": ">=\uB294 \u2265\uB85C, <=\uB294 \u2264\uB85C, !=\uB294 \u2260\uB85C, +-\uB294 \xB1\uB85C \uBC14\uB01D\uB2C8\uB2E4.",
  "setting.excludedFolders.name": "\uC81C\uC678\uD560 \uD3F4\uB354",
  "setting.excludedFolders.desc": '\uC774 \uD3F4\uB354 \uC548\uC758 \uB178\uD2B8\uC5D0\uC11C\uB294 \uC544\uBB34\uAC83\uB3C4 \uCE58\uD658\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uD55C \uC904\uC5D0 \uD3F4\uB354 \uD558\uB098\uC529 \uC801\uC2B5\uB2C8\uB2E4(\uC608: Code \uB610\uB294 Templates/Raw). \uAC1C\uBCC4 \uB178\uD2B8\uB294 \uC18D\uC131 "typography: off" \uB610\uB294 "\uC774 \uB178\uD2B8\uC758 \uC790\uB3D9 \uCE58\uD658 \uB044\uAE30/\uCF1C\uAE30" \uBA85\uB839\uC73C\uB85C \uC81C\uC678\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
  "setting.useLangProperty.name": "\uB178\uD2B8\uC758 lang \uC18D\uC131 \uC0AC\uC6A9",
  "setting.useLangProperty.desc": '"lang: de" \uAC19\uC740 \uC18D\uC131\uC774 \uC788\uB294 \uB178\uD2B8\uC5D0\uB294 \uD574\uB2F9 \uC5B8\uC5B4\uC758 \uB530\uC634\uD45C(\uC601\uC5B4, \uB3C5\uC77C\uC5B4, \uD504\uB791\uC2A4\uC5B4, \uC2A4\uD398\uC778\uC5B4, \uC2A4\uC6E8\uB374\uC5B4, \uD3F4\uB780\uB4DC\uC5B4, \uB7EC\uC2DC\uC544\uC5B4)\uB97C \uC801\uC6A9\uD569\uB2C8\uB2E4. \uB178\uD2B8\uC5D0 "typography-quotes"\uAC00 \uB530\uB85C \uC788\uC73C\uBA74 \uADF8\uAC83\uC774 \uC6B0\uC120\uD569\uB2C8\uB2E4. \uC774\uBBF8 \uAC00\uC9C0\uACE0 \uC788\uB294 \uB178\uD2B8\uC5D0 lang \uC18D\uC131\uC774 \uC788\uC744 \uC218 \uC788\uC5B4 \uAE30\uBCF8\uAC12\uC740 \uAEBC\uC9D0\uC785\uB2C8\uB2E4.',
  "setting.quotesByFolder.name": "\uD3F4\uB354\uBCC4 \uB530\uC634\uD45C",
  "setting.quotesByFolder.desc": '\uD55C \uC904\uC5D0 \uD558\uB098\uC529 \uD3F4\uB354, " -> ", \uD45C\uAE30 \uADDC\uCE59 \uC21C\uC73C\uB85C \uC801\uC2B5\uB2C8\uB2E4(\uC608: Deutsch -> german). \uAC00\uC7A5 \uAD6C\uCCB4\uC801\uC778 \uD3F4\uB354\uAC00 \uC6B0\uC120\uD569\uB2C8\uB2E4. \uB178\uD2B8\uC758 "lang" \uC18D\uC131(\uC704 \uC2A4\uC704\uCE58\uB97C \uCF20 \uACBD\uC6B0)\uACFC "typography-quotes" \uC18D\uC131\uC740 \uD3F4\uB354 \uC124\uC815\uBCF4\uB2E4 \uC6B0\uC120\uD569\uB2C8\uB2E4. \uD45C\uAE30 \uADDC\uCE59: english, german, french, spanish, swedish, polish, russian, \uACE7\uC740 \uB530\uC634\uD45C\uB294 off.',
  "setting.customRules.name": "\uC9C1\uC811 \uB9CC\uB4E0 \uCE58\uD658",
  "setting.customRules.desc": '\uD55C \uC904\uC5D0 \uADDC\uCE59 \uD558\uB098\uC529, \uC785\uB825\uD560 \uBB38\uC790, " -> ", \uBC14\uB014 \uBB38\uC790 \uC21C\uC73C\uB85C \uC801\uC2B5\uB2C8\uB2E4(\uC608: (c) -> \xA9). \uADDC\uCE59\uC740 \uC785\uB825\uC5F4\uC758 \uB9C8\uC9C0\uB9C9 \uBB38\uC790\uB97C \uC785\uB825\uD558\uB294 \uC21C\uAC04 \uC801\uC6A9\uB418\uBA70, \uC704\uC758 \uADDC\uCE59\uACFC \uAC19\uC740 \uC704\uCE58\uC5D0\uC11C \uB3D9\uC791\uD569\uB2C8\uB2E4. \uBC14\uB85C \uB4A4\uC5D0 Backspace\uB97C \uB204\uB974\uBA74 \uC785\uB825\uD55C \uBB38\uC790\uB85C \uB418\uB3CC\uC544\uAC11\uB2C8\uB2E4. \uC704\uC758 \uADDC\uCE59\uC774 \uBA3C\uC800\uC774\uBA70, \uC704 \uADDC\uCE59\uC774 \uCC98\uB9AC\uD558\uB294 \uC785\uB825\uC5F4\uC740 \uD574\uB2F9 \uC2A4\uC704\uCE58\uAC00 \uAEBC\uC838 \uC788\uC744 \uB54C\uB9CC \uC9C1\uC811 \uB9CC\uB4E0 \uADDC\uCE59\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uC785\uB825\uC5F4\uC740 2\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.',
  "setting.stylePreset.name": "\uC2A4\uD0C0\uC77C \uD504\uB9AC\uC14B",
  "setting.stylePreset.desc": "\uC704\uC758 \uC2A4\uC704\uCE58\uB97C \uD55C \uBC88\uC5D0 \uC124\uC815\uD569\uB2C8\uB2E4: \uAE00\uC4F0\uAE30, \uD559\uC220, \uAC1C\uBC1C\uC790(\uC870\uC6A9\uD788), \uAE30\uBCF8. \uD3F4\uB354, \uB530\uC634\uD45C \uC2A4\uD0C0\uC77C(\uAC1C\uBC1C\uC790 \uC81C\uC678), \uC9C1\uC811 \uB9CC\uB4E0 \uCE58\uD658\uC740 \uADF8\uB300\uB85C \uC720\uC9C0\uB429\uB2C8\uB2E4.",
  "setting.rulePreset.name": "\uD504\uB9AC\uC14B \uCD94\uAC00",
  "setting.rulePreset.desc": "\uBBF8\uB9AC \uB9CC\uB4E4\uC5B4\uC9C4 \uADDC\uCE59 \uBB36\uC74C\uC744 \uBAA9\uB85D\uC5D0 \uCD94\uAC00\uD569\uB2C8\uB2E4. \uC774\uBBF8 \uC788\uB294 \uADDC\uCE59\uC740 \uADF8\uB300\uB85C \uB461\uB2C8\uB2E4. >>\uB294 \uC911\uCCA9 \uC778\uC6A9\uC744 \uC5EC\uB294 \uC904\uC758 \uB9E8 \uC55E\uC5D0\uC11C\uB294 \uC808\uB300 \uCE58\uD658\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  "setting.keepsOut.name": "\uCE58\uD658\uD558\uC9C0 \uC54A\uB294 \uACF3",
  "setting.keepsOut.desc": "\uCF54\uB4DC \uBE14\uB85D, \uC778\uB77C\uC778 \uCF54\uB4DC, \uC218\uC2DD, \uB9C1\uD06C \uB300\uC0C1, \uD504\uB860\uD2B8\uB9E4\uD130, HTML \uD0DC\uADF8\uC640 \uC8FC\uC11D, Templater \uD45C\uD604\uC2DD\uC740 \uC785\uB825\uD55C \uADF8\uB300\uB85C \uB461\uB2C8\uB2E4. \uCE58\uD658 \uC9C1\uD6C4\uC5D0 Backspace\uB97C \uB204\uB974\uBA74 \uC785\uB825\uD55C \uBB38\uC790\uB85C \uB418\uB3CC\uC544\uAC11\uB2C8\uB2E4.",
  "setting.folderStatus.name": "\uC0AC\uC6A9 \uC911\uC778 \uD3F4\uB354",
  "setting.rulesStatus.name": "\uC0AC\uC6A9 \uC911\uC778 \uADDC\uCE59",
  // Status lines under the text areas
  "status.noFolders": "\uC544\uC9C1 \uD3F4\uB354\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "status.folders.one": "\uD3F4\uB354 1\uAC1C\uB97C \uC0AC\uC6A9 \uC911\uC785\uB2C8\uB2E4.",
  "status.folders.other": "\uD3F4\uB354 {count}\uAC1C\uB97C \uC0AC\uC6A9 \uC911\uC785\uB2C8\uB2E4.",
  "status.noRules": "\uC544\uC9C1 \uADDC\uCE59\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "status.rules.one": "\uADDC\uCE59 1\uAC1C\uB97C \uC0AC\uC6A9 \uC911\uC785\uB2C8\uB2E4.",
  "status.rules.other": "\uADDC\uCE59 {count}\uAC1C\uB97C \uC0AC\uC6A9 \uC911\uC785\uB2C8\uB2E4.",
  "status.ignored": "\uBB34\uC2DC\uB428, {line}\uBC88\uC9F8 \uC904({text}): {reason}.",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": '\uC785\uB825\uC5F4\uACFC \uBC14\uB014 \uBB38\uC790 \uC0AC\uC774\uC5D0 "{separator}"\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4',
  "reason.sequenceLineBreak": "\uC785\uB825\uC5F4\uC5D0 \uC904\uBC14\uAFC8\uC774 \uC788\uC2B5\uB2C8\uB2E4",
  "reason.sequenceEmpty": "\uC785\uB825\uC5F4\uC774 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4",
  "reason.sequenceSpaces": "\uC785\uB825\uC5F4\uC774 \uACF5\uBC31\uBFD0\uC785\uB2C8\uB2E4",
  "reason.sequenceShort": "\uC785\uB825\uC5F4\uC740 2\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4",
  "reason.sequenceEmoji": "\uC785\uB825\uC5F4\uC774 \uC774\uBAA8\uC9C0 \uB4F1\uC758 \uBB38\uC790\uB85C \uB05D\uB0A9\uB2C8\uB2E4",
  "reason.replacementLineBreak": "\uBC14\uB014 \uBB38\uC790\uC5D0 \uC904\uBC14\uAFC8\uC774 \uC788\uC2B5\uB2C8\uB2E4",
  "reason.replacementEmpty": "\uBC14\uB014 \uBB38\uC790\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4",
  "reason.replacementSame": "\uBC14\uB014 \uBB38\uC790\uAC00 \uC785\uB825\uC5F4\uACFC \uAC19\uC2B5\uB2C8\uB2E4",
  "reason.duplicate": "\uAC19\uC740 \uC785\uB825\uC5F4\uC774 \uC774\uBBF8 {line}\uBC88\uC9F8 \uC904\uC5D0 \uC788\uC2B5\uB2C8\uB2E4",
  "reason.clash": "{line}\uBC88\uC9F8 \uC904\uC758 \uADDC\uCE59\uC774 \uC774\uBBF8 \uAC19\uC740 \uD0A4 \uC785\uB825\uC5D0 \uC801\uC6A9\uB429\uB2C8\uB2E4",
  "reason.folderFormat": '\uD3F4\uB354, " -> ", \uD45C\uAE30 \uADDC\uCE59 \uC21C\uC73C\uB85C \uC801\uC73C\uC138\uC694',
  "reason.noFolder": '"->" \uC55E\uC5D0 \uD3F4\uB354\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4',
  "reason.unknownConvention": "\uC54C \uC218 \uC5C6\uB294 \uD45C\uAE30 \uADDC\uCE59\uC785\uB2C8\uB2E4",
  // Modals
  "modal.preset.title": "\uC870\uD310 \uC2A4\uD0C0\uC77C \uC120\uD0DD",
  "modal.preset.intro": "\uC2DC\uC791\uC810\uC744 \uACE0\uB974\uC138\uC694. \uBAA8\uB4E0 \uC2A4\uC704\uCE58\uB294 \uB098\uC911\uC5D0 \uD50C\uB7EC\uADF8\uC778 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC73C\uBA70, \uC774 \uD504\uB9AC\uC14B\uB3C4 \uAC70\uAE30\uC5D0 \uC788\uC2B5\uB2C8\uB2E4.",
  "modal.preset.keepDefault": "\uAE30\uBCF8\uAC12 \uC720\uC9C0",
  "modal.preset.use": '"{preset}" \uC0AC\uC6A9',
  "modal.quotes.placeholder": "\uC774 \uB178\uD2B8\uC758 \uB530\uC634\uD45C",
  "modal.quotes.follow": "\uD3F4\uB354\uBCC4 \uC124\uC815\uACFC \uC804\uCCB4 \uC124\uC815 \uB530\uB974\uAE30(\uC18D\uC131 \uC81C\uAC70)",
  "modal.quotes.straight": "\uACE7\uC740 \uB530\uC634\uD45C(\uB054)"
};
var ko_default = ko;

// src/locales/pt-BR.ts
var ptBR = {
  // Commands
  "command.toggleNote": "Desativar ou ativar as substitui\xE7\xF5es nesta nota",
  "command.setQuotes": "Definir as aspas desta nota\u2026",
  "command.applyToText": "Aplicar a tipografia \xE0 sele\xE7\xE3o ou \xE0 nota inteira",
  // Notices
  "notice.substitutionsOff": "Typography: as substitui\xE7\xF5es est\xE3o desativadas nesta nota.",
  "notice.substitutionsOn": "Typography: as substitui\xE7\xF5es est\xE3o ativadas nesta nota.",
  "notice.removedButExcluded": "Typography: a propriedade foi removida, mas esta nota est\xE1 em uma pasta exclu\xEDda, ent\xE3o as substitui\xE7\xF5es continuam desativadas.",
  "notice.nothingToChange": "Typography: nada para alterar.",
  "notice.changedLines.one": "Typography: 1 linha alterada.",
  "notice.changedLines.other": "Typography: {count} linhas alteradas.",
  "notice.quotesFollowFolder": "Typography: esta nota volta a seguir as aspas da pasta e a configura\xE7\xE3o global.",
  "notice.quotesSet": "Typography: as aspas desta nota agora s\xE3o: {style}.",
  "notice.quotesStraight": "Typography: as aspas desta nota agora s\xE3o retas.",
  "notice.presetApplied": "Typography: predefini\xE7\xE3o \u201C{preset}\u201D aplicada.",
  "notice.presetRulesPresent": "Typography: essas regras j\xE1 est\xE3o na sua lista.",
  "notice.rulesAdded.one": "Typography: 1 regra adicionada.",
  "notice.rulesAdded.other": "Typography: {count} regras adicionadas.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "Ingl\xEAs \u201C \u201D \u2018 \u2019",
  "convention.german": "Alem\xE3o \u201E \u201C \u201A \u2018",
  "convention.french": "Franc\xEAs \xAB \xBB \u2039 \u203A",
  "convention.spanish": "Espanhol \xAB \xBB \u201C \u201D",
  "convention.swedish": "Sueco \u201D \u201D \u2019 \u2019",
  "convention.polish": "Polon\xEAs \u201E \u201D \u201A \u2019",
  "convention.russian": "Russo \xAB \xBB \u201E \u201C",
  "convention.off": "Deixar as aspas retas como est\xE3o",
  // Style presets
  "stylePreset.default.label": "Padr\xE3o",
  "stylePreset.default.desc": "Aspas tipogr\xE1ficas, travess\xF5es, retic\xEAncias, setas e s\xEDmbolos. Sem mai\xFAsculas autom\xE1ticas.",
  "stylePreset.writer.label": "Escritor",
  "stylePreset.writer.desc": "Prosa: aspas tipogr\xE1ficas, travess\xF5es, retic\xEAncias e mai\xFAscula no in\xEDcio de cada frase. Sem setas nem s\xEDmbolos matem\xE1ticos.",
  "stylePreset.academic.label": "Acad\xEAmico",
  "stylePreset.academic.desc": "Tudo ativado, incluindo setas e s\xEDmbolos matem\xE1ticos, al\xE9m de mai\xFAsculas autom\xE1ticas.",
  "stylePreset.developer.label": "Desenvolvedor (discreto)",
  "stylePreset.developer.desc": "Aspas retas e hifens simples ficam como digitados. S\xF3 setas e s\xEDmbolos matem\xE1ticos s\xE3o convertidos.",
  // Rule presets
  "rulePreset.guillemets": "Aspas angulares << >>",
  "rulePreset.symbols": "S\xEDmbolos (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "Aspas",
  "setting.quoteStyle.desc": "Em qual conven\xE7\xE3o as aspas retas s\xE3o convertidas. O ap\xF3strofo \xE9 o mesmo caractere em todas as conven\xE7\xF5es e \xE9 configurado separadamente.",
  "setting.smartApostrophes.name": "Ap\xF3strofos",
  "setting.smartApostrophes.desc": "it's vira it\u2019s. Funciona com ou sem aspas configuradas.",
  "setting.skipClosingQuote.name": "Pular a aspa de fechamento",
  "setting.skipClosingQuote.desc": "Ao digitar uma aspa de fechamento onde j\xE1 existe uma, o cursor passa por cima dela em vez de acrescentar uma segunda.",
  "setting.capitalizeSentences.name": "Capitalizar frases",
  "setting.capitalizeSentences.desc": "Digita mai\xFAscula na primeira letra de uma linha ou de uma frase ap\xF3s . ! ou ?. N\xE3o age em c\xF3digo, links, tags e caminhos, nem ap\xF3s abrevia\xE7\xF5es como Mr., e.g. ou etc. Backspace logo em seguida devolve a letra min\xFAscula.",
  "setting.tabOut.name": "Tab para sair",
  "setting.tabOut.desc": "Com o cursor logo antes de uma aspa ou de um par\xEAntese de fechamento, Tab passa por cima. Em listas, Tab continua recuando, e em tabelas continua pulando entre c\xE9lulas.",
  "setting.wrapSelection.name": "Envolver a sele\xE7\xE3o em aspas",
  "setting.wrapSelection.desc": "Com texto selecionado, digitar uma aspa coloca aspas tipogr\xE1ficas ao redor em vez de substitu\xED-lo.",
  "setting.dashes.name": "Travess\xF5es",
  "setting.dashes.desc": "-- vira \u2013 e --- vira \u2014.",
  "setting.ellipsis.name": "Retic\xEAncias",
  "setting.ellipsis.desc": "... vira \u2026.",
  "setting.arrows.name": "Setas",
  "setting.arrows.desc": "-> vira \u2192, <- vira \u2190, <-> vira \u2194, => vira \u21D2.",
  "setting.mathSymbols.name": "S\xEDmbolos matem\xE1ticos",
  "setting.mathSymbols.desc": ">= vira \u2265, <= vira \u2264, != vira \u2260, +- vira \xB1.",
  "setting.excludedFolders.name": "Pastas exclu\xEDdas",
  "setting.excludedFolders.desc": 'Nada \xE9 substitu\xEDdo nas notas dessas pastas, uma pasta por linha (por exemplo, Code ou Templates/Raw). Uma nota pode ficar de fora com a propriedade "typography: off" ou com o comando "Desativar ou ativar as substitui\xE7\xF5es nesta nota".',
  "setting.useLangProperty.name": "Usar a propriedade lang da nota",
  "setting.useLangProperty.desc": 'Uma nota com uma propriedade como "lang: de" recebe as aspas desse idioma (ingl\xEAs, alem\xE3o, franc\xEAs, espanhol, sueco, polon\xEAs, russo), a menos que tenha a pr\xF3pria propriedade "typography-quotes". Desativado por padr\xE3o, porque suas notas atuais podem ter uma propriedade lang.',
  "setting.quotesByFolder.name": "Aspas por pasta",
  "setting.quotesByFolder.desc": 'Uma pasta por linha, depois " -> " e depois a conven\xE7\xE3o: Deutsch -> german. A pasta mais espec\xEDfica vence. A propriedade "lang" da nota (se a chave acima estiver ativada) e a propriedade "typography-quotes" t\xEAm prioridade sobre a pasta. Conven\xE7\xF5es: english, german, french, spanish, swedish, polish, russian, ou off para aspas retas.',
  "setting.customRules.name": "Suas pr\xF3prias substitui\xE7\xF5es",
  "setting.customRules.desc": 'Uma regra por linha: os caracteres que voc\xEA digita, depois " -> " e depois no que eles se transformam: (c) -> \xA9. Uma regra age quando voc\xEA digita o \xFAltimo caractere da sequ\xEAncia, nos mesmos lugares das regras acima, e Backspace logo em seguida devolve o que voc\xEA digitou. As regras acima t\xEAm prioridade: uma sequ\xEAncia que elas tamb\xE9m tratam s\xF3 usa a sua enquanto a chave delas estiver desativada. Uma sequ\xEAncia precisa de pelo menos dois caracteres.',
  "setting.stylePreset.name": "Estilo predefinido",
  "setting.stylePreset.desc": "Define de uma vez as chaves acima: Escritor, Acad\xEAmico, Desenvolvedor (discreto) ou Padr\xE3o. Suas pastas, o estilo de aspas (exceto em Desenvolvedor) e suas substitui\xE7\xF5es s\xE3o mantidos.",
  "setting.rulePreset.name": "Adicionar uma predefini\xE7\xE3o",
  "setting.rulePreset.desc": "Adiciona \xE0 sua lista um conjunto de regras pronto; as regras que j\xE1 est\xE3o nela s\xE3o mantidas. >> nunca \xE9 substitu\xEDdo no in\xEDcio de uma linha, onde abre uma cita\xE7\xE3o aninhada.",
  "setting.keepsOut.name": "Onde nada \xE9 substitu\xEDdo",
  "setting.keepsOut.desc": "Blocos de c\xF3digo, c\xF3digo em linha, f\xF3rmulas, destinos de links, frontmatter, tags e coment\xE1rios HTML e express\xF5es do Templater ficam exatamente como digitados. Backspace logo ap\xF3s uma substitui\xE7\xE3o devolve o que voc\xEA digitou.",
  "setting.folderStatus.name": "Pastas em uso",
  "setting.rulesStatus.name": "Regras em uso",
  // Status lines under the text areas
  "status.noFolders": "Ainda n\xE3o h\xE1 pastas.",
  "status.folders.one": "1 pasta em uso.",
  "status.folders.other": "{count} pastas em uso.",
  "status.noRules": "Ainda n\xE3o h\xE1 regras.",
  "status.rules.one": "1 regra em uso.",
  "status.rules.other": "{count} regras em uso.",
  "status.ignored": "Ignorada, linha {line} ({text}): {reason}.",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": 'falta "{separator}" entre a sequ\xEAncia e a substitui\xE7\xE3o',
  "reason.sequenceLineBreak": "a sequ\xEAncia cont\xE9m uma quebra de linha",
  "reason.sequenceEmpty": "a sequ\xEAncia est\xE1 vazia",
  "reason.sequenceSpaces": "a sequ\xEAncia s\xF3 tem espa\xE7os",
  "reason.sequenceShort": "a sequ\xEAncia precisa de pelo menos dois caracteres",
  "reason.sequenceEmoji": "a sequ\xEAncia termina com um emoji ou caractere semelhante",
  "reason.replacementLineBreak": "a substitui\xE7\xE3o cont\xE9m uma quebra de linha",
  "reason.replacementEmpty": "a substitui\xE7\xE3o est\xE1 vazia",
  "reason.replacementSame": "a substitui\xE7\xE3o \xE9 igual \xE0 sequ\xEAncia",
  "reason.duplicate": "a mesma sequ\xEAncia j\xE1 est\xE1 na linha {line}",
  "reason.clash": "a regra da linha {line} j\xE1 age nas mesmas teclas",
  "reason.folderFormat": 'escreva a pasta, depois " -> " e depois a conven\xE7\xE3o',
  "reason.noFolder": 'nenhuma pasta antes de "->"',
  "reason.unknownConvention": "conven\xE7\xE3o desconhecida",
  // Modals
  "modal.preset.title": "Escolha um estilo tipogr\xE1fico",
  "modal.preset.intro": "Escolha um ponto de partida. Voc\xEA pode alterar cada chave depois, nas configura\xE7\xF5es do plugin, onde essas predefini\xE7\xF5es tamb\xE9m aparecem.",
  "modal.preset.keepDefault": "Manter o padr\xE3o",
  "modal.preset.use": "Usar {preset}",
  "modal.quotes.placeholder": "Aspas desta nota",
  "modal.quotes.follow": "Seguir a pasta e a configura\xE7\xE3o global (remover a propriedade)",
  "modal.quotes.straight": "Aspas retas (desativado)"
};
var pt_BR_default = ptBR;

// src/locales/ru.ts
var ru = {
  // Commands
  "command.toggleNote": "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0438\u043B\u0438 \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u043D\u044B \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435",
  "command.setQuotes": "\u0417\u0430\u0434\u0430\u0442\u044C \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u0434\u043B\u044F \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0438\u2026",
  "command.applyToText": "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0438\u043F\u043E\u0433\u0440\u0430\u0444\u0438\u043A\u0443 \u043A \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u043E\u043C\u0443 \u0438\u043B\u0438 \u043A\u043E \u0432\u0441\u0435\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435",
  // Notices
  "notice.substitutionsOff": "Typography: \u0437\u0430\u043C\u0435\u043D\u044B \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
  "notice.substitutionsOn": "Typography: \u0437\u0430\u043C\u0435\u043D\u044B \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
  "notice.removedButExcluded": "Typography: \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u043E, \u043D\u043E \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0438\u0441\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u043E\u0439 \u043F\u0430\u043F\u043A\u0435, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0437\u0430\u043C\u0435\u043D\u044B \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044B\u043C\u0438.",
  "notice.nothingToChange": "Typography: \u043C\u0435\u043D\u044F\u0442\u044C \u043D\u0435\u0447\u0435\u0433\u043E.",
  "notice.changedLines.one": "Typography: \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0430 1 \u0441\u0442\u0440\u043E\u043A\u0430.",
  "notice.changedLines.other": "Typography: \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0441\u0442\u0440\u043E\u043A: {count}.",
  "notice.quotesFollowFolder": "Typography: \u044D\u0442\u0430 \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u0441\u043D\u043E\u0432\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u043F\u0430\u043F\u043A\u0438 \u0438 \u043E\u0431\u0449\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438.",
  "notice.quotesSet": "Typography: \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435 \u0442\u0435\u043F\u0435\u0440\u044C \u0442\u0430\u043A\u0438\u0435: {style}.",
  "notice.quotesStraight": "Typography: \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435 \u0442\u0435\u043F\u0435\u0440\u044C \u043F\u0440\u044F\u043C\u044B\u0435.",
  "notice.presetApplied": "Typography: \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D \u043D\u0430\u0431\u043E\u0440 \xAB{preset}\xBB.",
  "notice.presetRulesPresent": "Typography: \u044D\u0442\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0432 \u0432\u0430\u0448\u0435\u043C \u0441\u043F\u0438\u0441\u043A\u0435.",
  "notice.rulesAdded.one": "Typography: \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E 1 \u043F\u0440\u0430\u0432\u0438\u043B\u043E.",
  "notice.rulesAdded.other": "Typography: \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043F\u0440\u0430\u0432\u0438\u043B: {count}.",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0435 \u201C \u201D \u2018 \u2019",
  "convention.german": "\u041D\u0435\u043C\u0435\u0446\u043A\u0438\u0435 \u201E \u201C \u201A \u2018",
  "convention.french": "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0438\u0435 \xAB \xBB \u2039 \u203A",
  "convention.spanish": "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0435 \xAB \xBB \u201C \u201D",
  "convention.swedish": "\u0428\u0432\u0435\u0434\u0441\u043A\u0438\u0435 \u201D \u201D \u2019 \u2019",
  "convention.polish": "\u041F\u043E\u043B\u044C\u0441\u043A\u0438\u0435 \u201E \u201D \u201A \u2019",
  "convention.russian": "\u0420\u0443\u0441\u0441\u043A\u0438\u0435 \xAB \xBB \u201E \u201C",
  "convention.off": "\u041D\u0435 \u0442\u0440\u043E\u0433\u0430\u0442\u044C \u043F\u0440\u044F\u043C\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438",
  // Style presets
  "stylePreset.default.label": "\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
  "stylePreset.default.desc": "\u0422\u0438\u043F\u043E\u0433\u0440\u0430\u0444\u0441\u043A\u0438\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438, \u0442\u0438\u0440\u0435, \u043C\u043D\u043E\u0433\u043E\u0442\u043E\u0447\u0438\u0435, \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0438 \u0441\u0438\u043C\u0432\u043E\u043B\u044B. \u0411\u0435\u0437 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u044B\u0445 \u0431\u0443\u043A\u0432.",
  "stylePreset.writer.label": "\u041F\u0438\u0441\u0430\u0442\u0435\u043B\u044C",
  "stylePreset.writer.desc": "\u041F\u0440\u043E\u0437\u0430: \u0442\u0438\u043F\u043E\u0433\u0440\u0430\u0444\u0441\u043A\u0438\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438, \u0442\u0438\u0440\u0435, \u043C\u043D\u043E\u0433\u043E\u0442\u043E\u0447\u0438\u0435 \u0438 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u0430\u044F \u0431\u0443\u043A\u0432\u0430 \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F. \u0411\u0435\u0437 \u0441\u0442\u0440\u0435\u043B\u043E\u043A \u0438 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.",
  "stylePreset.academic.label": "\u041D\u0430\u0443\u0447\u043D\u044B\u0439",
  "stylePreset.academic.desc": "\u0412\u0441\u0451 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E, \u0432 \u0442\u043E\u043C \u0447\u0438\u0441\u043B\u0435 \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0438 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B, \u043F\u043B\u044E\u0441 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u044B\u0435 \u0431\u0443\u043A\u0432\u044B.",
  "stylePreset.developer.label": "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A (\u0442\u0438\u0445\u0438\u0439)",
  "stylePreset.developer.desc": "\u041F\u0440\u044F\u043C\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u0438 \u043E\u0431\u044B\u0447\u043D\u044B\u0435 \u0434\u0435\u0444\u0438\u0441\u044B \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u043A\u0430\u043A \u043D\u0430\u0431\u0440\u0430\u043D\u044B. \u041F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u0443\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0438 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B.",
  // Rule presets
  "rulePreset.guillemets": "\u041A\u0430\u0432\u044B\u0447\u043A\u0438-\u0451\u043B\u043E\u0447\u043A\u0438 << >>",
  "rulePreset.symbols": "\u0421\u0438\u043C\u0432\u043E\u043B\u044B (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "\u041A\u0430\u0432\u044B\u0447\u043A\u0438",
  "setting.quoteStyle.desc": "\u0412 \u043A\u0430\u043A\u043E\u0439 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u0443\u044E\u0442\u0441\u044F \u043F\u0440\u044F\u043C\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438. \u0410\u043F\u043E\u0441\u0442\u0440\u043E\u0444 \u2014 \u043E\u0434\u0438\u043D \u0438 \u0442\u043E\u0442 \u0436\u0435 \u0441\u0438\u043C\u0432\u043E\u043B \u0432\u043E \u0432\u0441\u0435\u0445 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u0445, \u043E\u043D \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E.",
  "setting.smartApostrophes.name": "\u0410\u043F\u043E\u0441\u0442\u0440\u043E\u0444\u044B",
  "setting.smartApostrophes.desc": "it's \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 it\u2019s. \u0420\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u0437\u0430\u0434\u0430\u043D\u044B \u043B\u0438 \u043A\u0430\u0432\u044B\u0447\u043A\u0438.",
  "setting.skipClosingQuote.name": "\u041F\u0435\u0440\u0435\u0448\u0430\u0433\u0438\u0432\u0430\u0442\u044C \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0449\u0443\u044E \u043A\u0430\u0432\u044B\u0447\u043A\u0443",
  "setting.skipClosingQuote.desc": "\u0415\u0441\u043B\u0438 \u043D\u0430\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0449\u0443\u044E \u043A\u0430\u0432\u044B\u0447\u043A\u0443 \u0442\u0430\u043C, \u0433\u0434\u0435 \u043E\u043D\u0430 \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442, \u043A\u0443\u0440\u0441\u043E\u0440 \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u0441\u044F \u0437\u0430 \u043D\u0435\u0451, \u0430 \u0432\u0442\u043E\u0440\u0430\u044F \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u0441\u044F.",
  "setting.capitalizeSentences.name": "\u0417\u0430\u0433\u043B\u0430\u0432\u043D\u044B\u0435 \u0431\u0443\u043A\u0432\u044B \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439",
  "setting.capitalizeSentences.desc": "\u041D\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u043F\u0435\u0440\u0432\u0443\u044E \u0431\u0443\u043A\u0432\u0443 \u0441\u0442\u0440\u043E\u043A\u0438 \u0438\u043B\u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435 . ! \u0438\u043B\u0438 ?. \u041D\u0435 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0432 \u043A\u043E\u0434\u0435, \u0441\u0441\u044B\u043B\u043A\u0430\u0445, \u0442\u0435\u0433\u0430\u0445 \u0438 \u043F\u0443\u0442\u044F\u0445, \u0430 \u0442\u0430\u043A\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u0439 \u0432\u0440\u043E\u0434\u0435 Mr., e.g. \u0438\u043B\u0438 etc. Backspace \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0441\u0442\u0440\u043E\u0447\u043D\u0443\u044E \u0431\u0443\u043A\u0432\u0443.",
  "setting.tabOut.name": "\u0412\u044B\u0445\u043E\u0434 \u043F\u043E Tab",
  "setting.tabOut.desc": "\u0415\u0441\u043B\u0438 \u043A\u0443\u0440\u0441\u043E\u0440 \u0441\u0442\u043E\u0438\u0442 \u043F\u0440\u044F\u043C\u043E \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0449\u0435\u0439 \u043A\u0430\u0432\u044B\u0447\u043A\u043E\u0439 \u0438\u043B\u0438 \u0441\u043A\u043E\u0431\u043A\u043E\u0439, Tab \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442 \u0435\u0433\u043E \u0437\u0430 \u043D\u0435\u0451. \u0412 \u0441\u043F\u0438\u0441\u043A\u0430\u0445 Tab \u043F\u043E-\u043F\u0440\u0435\u0436\u043D\u0435\u043C\u0443 \u0434\u0435\u043B\u0430\u0435\u0442 \u043E\u0442\u0441\u0442\u0443\u043F, \u0430 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0430\u0445 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0438\u0442 \u043C\u0435\u0436\u0434\u0443 \u044F\u0447\u0435\u0439\u043A\u0430\u043C\u0438.",
  "setting.wrapSelection.name": "\u041E\u0431\u0440\u0430\u043C\u043B\u044F\u0442\u044C \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0430\u043C\u0438",
  "setting.wrapSelection.desc": "\u0415\u0441\u043B\u0438 \u0432\u044B\u0434\u0435\u043B\u0435\u043D \u0442\u0435\u043A\u0441\u0442, \u043D\u0430\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u043A\u0430\u0432\u044B\u0447\u043A\u0430 \u0441\u0442\u0430\u0432\u0438\u0442 \u0442\u0438\u043F\u043E\u0433\u0440\u0430\u0444\u0441\u043A\u0438\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u0432\u043E\u043A\u0440\u0443\u0433 \u043D\u0435\u0433\u043E, \u0430 \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442 \u0435\u0433\u043E.",
  "setting.dashes.name": "\u0422\u0438\u0440\u0435",
  "setting.dashes.desc": "-- \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u2013, \u0430 --- \u0432 \u2014.",
  "setting.ellipsis.name": "\u041C\u043D\u043E\u0433\u043E\u0442\u043E\u0447\u0438\u0435",
  "setting.ellipsis.desc": "... \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u2026.",
  "setting.arrows.name": "\u0421\u0442\u0440\u0435\u043B\u043A\u0438",
  "setting.arrows.desc": "-> \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u2192, <- \u0432 \u2190, <-> \u0432 \u2194, => \u0432 \u21D2.",
  "setting.mathSymbols.name": "\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B",
  "setting.mathSymbols.desc": ">= \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u2265, <= \u0432 \u2264, != \u0432 \u2260, +- \u0432 \xB1.",
  "setting.excludedFolders.name": "\u0418\u0441\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438",
  "setting.excludedFolders.desc": '\u0412 \u0437\u0430\u043C\u0435\u0442\u043A\u0430\u0445 \u0438\u0437 \u044D\u0442\u0438\u0445 \u043F\u0430\u043F\u043E\u043A \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F; \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, Code \u0438\u043B\u0438 Templates/Raw). \u041E\u0442\u0434\u0435\u043B\u044C\u043D\u0443\u044E \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E\u043C "typography: off" \u0438\u043B\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 \xAB\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0438\u043B\u0438 \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u043D\u044B \u0432 \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0435\xBB.',
  "setting.useLangProperty.name": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E lang \u0437\u0430\u043C\u0435\u0442\u043A\u0438",
  "setting.useLangProperty.desc": '\u0417\u0430\u043C\u0435\u0442\u043A\u0430 \u0441\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E\u043C \u0432\u0440\u043E\u0434\u0435 "lang: de" \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043A\u0430\u0432\u044B\u0447\u043A\u0438 \u044D\u0442\u043E\u0433\u043E \u044F\u0437\u044B\u043A\u0430 (\u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0435, \u043D\u0435\u043C\u0435\u0446\u043A\u0438\u0435, \u0444\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0438\u0435, \u0438\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0435, \u0448\u0432\u0435\u0434\u0441\u043A\u0438\u0435, \u043F\u043E\u043B\u044C\u0441\u043A\u0438\u0435, \u0440\u0443\u0441\u0441\u043A\u0438\u0435), \u0435\u0441\u043B\u0438 \u0443 \u043D\u0435\u0451 \u043D\u0435\u0442 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0430 "typography-quotes". \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0432 \u0432\u0430\u0448\u0438\u0445 \u0437\u0430\u043C\u0435\u0442\u043A\u0430\u0445 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E lang \u043C\u043E\u0436\u0435\u0442 \u0443\u0436\u0435 \u0431\u044B\u0442\u044C.',
  "setting.quotesByFolder.name": "\u041A\u0430\u0432\u044B\u0447\u043A\u0438 \u043F\u043E \u043F\u0430\u043F\u043A\u0430\u043C",
  "setting.quotesByFolder.desc": '\u041F\u043E \u043E\u0434\u043D\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443, \u0437\u0430\u0442\u0435\u043C " -> ", \u0437\u0430\u0442\u0435\u043C \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442: Deutsch -> german. \u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 \u0441\u0430\u043C\u0430\u044F \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u0430\u044F \u043F\u0430\u043F\u043A\u0430. \u0421\u0432\u043E\u0439\u0441\u0442\u0432\u0430 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 "lang" (\u0435\u0441\u043B\u0438 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C \u0432\u044B\u0448\u0435 \u0432\u043A\u043B\u044E\u0447\u0451\u043D) \u0438 "typography-quotes" \u0433\u043B\u0430\u0432\u043D\u0435\u0435 \u043F\u0430\u043F\u043A\u0438. \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B: english, german, french, spanish, swedish, polish, russian \u0438\u043B\u0438 off \u0434\u043B\u044F \u043F\u0440\u044F\u043C\u044B\u0445 \u043A\u0430\u0432\u044B\u0447\u0435\u043A.',
  "setting.customRules.name": "\u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u043D\u044B",
  "setting.customRules.desc": '\u041F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u043F\u0440\u0430\u0432\u0438\u043B\u0443 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443: \u043D\u0430\u0431\u0438\u0440\u0430\u0435\u043C\u044B\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B, \u0437\u0430\u0442\u0435\u043C " -> ", \u0437\u0430\u0442\u0435\u043C \u0442\u043E, \u0432\u043E \u0447\u0442\u043E \u043E\u043D\u0438 \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u044E\u0442\u0441\u044F: (c) -> \xA9. \u041F\u0440\u0430\u0432\u0438\u043B\u043E \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u043F\u0440\u0438 \u043D\u0430\u0431\u043E\u0440\u0435 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0441\u0438\u043C\u0432\u043E\u043B\u0430 \u0435\u0433\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438, \u0432 \u0442\u0435\u0445 \u0436\u0435 \u043C\u0435\u0441\u0442\u0430\u0445, \u0447\u0442\u043E \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432\u044B\u0448\u0435, \u0430 Backspace \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043D\u0430\u0431\u0440\u0430\u043D\u043D\u043E\u0435. \u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432\u044B\u0448\u0435 \u0438\u043C\u0435\u044E\u0442 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442: \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u043E\u043D\u0438 \u0442\u043E\u0436\u0435 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E\u0442, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u0432\u0430\u0448\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E, \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u043A\u0430 \u0438\u0445 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D. \u041F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u0438\u0437 \u0434\u0432\u0443\u0445 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.',
  "setting.stylePreset.name": "\u041D\u0430\u0431\u043E\u0440 \u0441\u0442\u0438\u043B\u044F",
  "setting.stylePreset.desc": "\u0421\u0440\u0430\u0437\u0443 \u0437\u0430\u0434\u0430\u0451\u0442 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u0438 \u0432\u044B\u0448\u0435: \u041F\u0438\u0441\u0430\u0442\u0435\u043B\u044C, \u041D\u0430\u0443\u0447\u043D\u044B\u0439, \u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A (\u0442\u0438\u0445\u0438\u0439) \u0438\u043B\u0438 \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E. \u0412\u0430\u0448\u0438 \u043F\u0430\u043F\u043A\u0438, \u0441\u0442\u0438\u043B\u044C \u043A\u0430\u0432\u044B\u0447\u0435\u043A (\u043A\u0440\u043E\u043C\u0435 \u043D\u0430\u0431\u043E\u0440\u0430 \xAB\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\xBB) \u0438 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u043D\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F.",
  "setting.rulePreset.name": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0430\u0431\u043E\u0440 \u043F\u0440\u0430\u0432\u0438\u043B",
  "setting.rulePreset.desc": "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0432 \u0432\u0430\u0448 \u0441\u043F\u0438\u0441\u043E\u043A \u0433\u043E\u0442\u043E\u0432\u044B\u0439 \u043D\u0430\u0431\u043E\u0440 \u043F\u0440\u0430\u0432\u0438\u043B; \u043F\u0440\u0430\u0432\u0438\u043B\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0442\u0430\u043C \u0443\u0436\u0435 \u0435\u0441\u0442\u044C, \u043D\u0435 \u0437\u0430\u0442\u0440\u0430\u0433\u0438\u0432\u0430\u044E\u0442\u0441\u044F. >> \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438, \u0433\u0434\u0435 \u043E\u043D\u043E \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u0443\u044E \u0446\u0438\u0442\u0430\u0442\u0443.",
  "setting.keepsOut.name": "\u0413\u0434\u0435 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F",
  "setting.keepsOut.desc": "\u0411\u043B\u043E\u043A\u0438 \u043A\u043E\u0434\u0430, \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u0434, \u0444\u043E\u0440\u043C\u0443\u043B\u044B, \u0430\u0434\u0440\u0435\u0441\u0430 \u0441\u0441\u044B\u043B\u043E\u043A, frontmatter, HTML-\u0442\u0435\u0433\u0438 \u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F Templater \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432 \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u0438 \u0442\u0430\u043A\u0438\u043C\u0438, \u043A\u0430\u043A \u043D\u0430\u0431\u0440\u0430\u043D\u044B. Backspace \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u043C\u0435\u043D\u044B \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043D\u0430\u0431\u0440\u0430\u043D\u043D\u043E\u0435.",
  "setting.folderStatus.name": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0435 \u043F\u0430\u043F\u043A\u0438",
  "setting.rulesStatus.name": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
  // Status lines under the text areas
  "status.noFolders": "\u041F\u0430\u043F\u043E\u043A \u043F\u043E\u043A\u0430 \u043D\u0435\u0442.",
  "status.folders.one": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F 1 \u043F\u0430\u043F\u043A\u0430.",
  "status.folders.other": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u0430\u043F\u043E\u043A: {count}.",
  "status.noRules": "\u041F\u0440\u0430\u0432\u0438\u043B \u043F\u043E\u043A\u0430 \u043D\u0435\u0442.",
  "status.rules.one": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F 1 \u043F\u0440\u0430\u0432\u0438\u043B\u043E.",
  "status.rules.other": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u0440\u0430\u0432\u0438\u043B: {count}.",
  "status.ignored": "\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E, \u0441\u0442\u0440\u043E\u043A\u0430 {line} ({text}): {reason}.",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": '\u043C\u0435\u0436\u0434\u0443 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u0438 \u0437\u0430\u043C\u0435\u043D\u043E\u0439 \u043D\u0435\u0442 "{separator}"',
  "reason.sequenceLineBreak": "\u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u043F\u0435\u0440\u0435\u0432\u043E\u0434 \u0441\u0442\u0440\u043E\u043A\u0438",
  "reason.sequenceEmpty": "\u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043F\u0443\u0441\u0442\u0430",
  "reason.sequenceSpaces": "\u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u0438\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432",
  "reason.sequenceShort": "\u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u0438\u0437 \u0434\u0432\u0443\u0445 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
  "reason.sequenceEmoji": "\u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u044D\u043C\u043E\u0434\u0437\u0438 \u0438\u043B\u0438 \u043F\u043E\u0445\u043E\u0436\u0438\u043C \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u043C",
  "reason.replacementLineBreak": "\u0437\u0430\u043C\u0435\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u043F\u0435\u0440\u0435\u0432\u043E\u0434 \u0441\u0442\u0440\u043E\u043A\u0438",
  "reason.replacementEmpty": "\u0437\u0430\u043C\u0435\u043D\u0430 \u043F\u0443\u0441\u0442\u0430",
  "reason.replacementSame": "\u0437\u0430\u043C\u0435\u043D\u0430 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E",
  "reason.duplicate": "\u0442\u0430\u043A\u0430\u044F \u0436\u0435 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0432 \u0441\u0442\u0440\u043E\u043A\u0435 {line}",
  "reason.clash": "\u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0432 \u0441\u0442\u0440\u043E\u043A\u0435 {line} \u0443\u0436\u0435 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u043D\u0430 \u0442\u0435 \u0436\u0435 \u043A\u043B\u0430\u0432\u0438\u0448\u0438",
  "reason.folderFormat": '\u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0430\u043F\u043A\u0443, \u0437\u0430\u0442\u0435\u043C " -> ", \u0437\u0430\u0442\u0435\u043C \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442',
  "reason.noFolder": '\u043F\u0435\u0440\u0435\u0434 "->" \u043D\u0435\u0442 \u043F\u0430\u043F\u043A\u0438',
  "reason.unknownConvention": "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442",
  // Modals
  "modal.preset.title": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F\u043E\u0433\u0440\u0430\u0444\u0441\u043A\u0438\u0439 \u0441\u0442\u0438\u043B\u044C",
  "modal.preset.intro": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043D\u0443\u044E \u0442\u043E\u0447\u043A\u0443. \u041A\u0430\u0436\u0434\u044B\u0439 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0442\u043E\u043C \u043C\u043E\u0436\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430, \u0433\u0434\u0435 \u044D\u0442\u0438 \u043D\u0430\u0431\u043E\u0440\u044B \u0442\u043E\u0436\u0435 \u043F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u044B.",
  "modal.preset.keepDefault": "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
  "modal.preset.use": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \xAB{preset}\xBB",
  "modal.quotes.placeholder": "\u041A\u0430\u0432\u044B\u0447\u043A\u0438 \u0434\u043B\u044F \u044D\u0442\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",
  "modal.quotes.follow": "\u0421\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u043F\u0430\u043F\u043A\u0435 \u0438 \u043E\u0431\u0449\u0435\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0435 (\u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E)",
  "modal.quotes.straight": "\u041F\u0440\u044F\u043C\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438 (\u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E)"
};
var ru_default = ru;

// src/locales/zh.ts
var zh = {
  // Commands
  "command.toggleNote": "\u5728\u6B64\u7B14\u8BB0\u4E2D\u5173\u95ED\u6216\u5F00\u542F\u81EA\u52A8\u66FF\u6362",
  "command.setQuotes": "\u8BBE\u7F6E\u6B64\u7B14\u8BB0\u7684\u5F15\u53F7\u2026",
  "command.applyToText": "\u5BF9\u6240\u9009\u6587\u672C\u6216\u6574\u7BC7\u7B14\u8BB0\u5E94\u7528\u6392\u7248",
  // Notices
  "notice.substitutionsOff": "Typography: \u6B64\u7B14\u8BB0\u5DF2\u5173\u95ED\u81EA\u52A8\u66FF\u6362\u3002",
  "notice.substitutionsOn": "Typography: \u6B64\u7B14\u8BB0\u5DF2\u5F00\u542F\u81EA\u52A8\u66FF\u6362\u3002",
  "notice.removedButExcluded": "Typography: \u5DF2\u79FB\u9664\u8BE5\u5C5E\u6027\uFF0C\u4F46\u6B64\u7B14\u8BB0\u4F4D\u4E8E\u88AB\u6392\u9664\u7684\u6587\u4EF6\u5939\u4E2D\uFF0C\u56E0\u6B64\u81EA\u52A8\u66FF\u6362\u4ECD\u4FDD\u6301\u5173\u95ED\u3002",
  "notice.nothingToChange": "Typography: \u6CA1\u6709\u9700\u8981\u4FEE\u6539\u7684\u5185\u5BB9\u3002",
  "notice.changedLines.one": "Typography: \u5DF2\u4FEE\u6539 1 \u884C\u3002",
  "notice.changedLines.other": "Typography: \u5DF2\u4FEE\u6539 {count} \u884C\u3002",
  "notice.quotesFollowFolder": "Typography: \u6B64\u7B14\u8BB0\u518D\u6B21\u6CBF\u7528\u6587\u4EF6\u5939\u548C\u5168\u5C40\u7684\u5F15\u53F7\u8BBE\u7F6E\u3002",
  "notice.quotesSet": "Typography: \u6B64\u7B14\u8BB0\u7684\u5F15\u53F7\u73B0\u4E3A{style}\u3002",
  "notice.quotesStraight": "Typography: \u6B64\u7B14\u8BB0\u7684\u5F15\u53F7\u73B0\u4E3A\u76F4\u5F15\u53F7\u3002",
  "notice.presetApplied": "Typography: \u5DF2\u5E94\u7528\u201C{preset}\u201D\u9884\u8BBE\u3002",
  "notice.presetRulesPresent": "Typography: \u8FD9\u4E9B\u89C4\u5219\u5DF2\u5728\u4F60\u7684\u5217\u8868\u4E2D\u3002",
  "notice.rulesAdded.one": "Typography: \u5DF2\u6DFB\u52A0 1 \u6761\u89C4\u5219\u3002",
  "notice.rulesAdded.other": "Typography: \u5DF2\u6DFB\u52A0 {count} \u6761\u89C4\u5219\u3002",
  // Quotation mark conventions (the sample characters stay as they are)
  "convention.english": "\u82F1\u6587 \u201C \u201D \u2018 \u2019",
  "convention.german": "\u5FB7\u6587 \u201E \u201C \u201A \u2018",
  "convention.french": "\u6CD5\u6587 \xAB \xBB \u2039 \u203A",
  "convention.spanish": "\u897F\u73ED\u7259\u6587 \xAB \xBB \u201C \u201D",
  "convention.swedish": "\u745E\u5178\u6587 \u201D \u201D \u2019 \u2019",
  "convention.polish": "\u6CE2\u5170\u6587 \u201E \u201D \u201A \u2019",
  "convention.russian": "\u4FC4\u6587 \xAB \xBB \u201E \u201C",
  "convention.off": "\u4FDD\u7559\u76F4\u5F15\u53F7\u4E0D\u53D8",
  // Style presets
  "stylePreset.default.label": "\u9ED8\u8BA4",
  "stylePreset.default.desc": "\u5F2F\u5F15\u53F7\u3001\u7834\u6298\u53F7\u3001\u7701\u7565\u53F7\u3001\u7BAD\u5934\u548C\u7B26\u53F7\u3002\u4E0D\u81EA\u52A8\u5927\u5199\u3002",
  "stylePreset.writer.label": "\u5199\u4F5C",
  "stylePreset.writer.desc": "\u9002\u5408\u884C\u6587\uFF1A\u5F2F\u5F15\u53F7\u3001\u7834\u6298\u53F7\u3001\u7701\u7565\u53F7\uFF0C\u4EE5\u53CA\u6BCF\u4E2A\u53E5\u5B50\u5F00\u5934\u81EA\u52A8\u5927\u5199\u3002\u4E0D\u8F6C\u6362\u7BAD\u5934\u548C\u6570\u5B66\u7B26\u53F7\u3002",
  "stylePreset.academic.label": "\u5B66\u672F",
  "stylePreset.academic.desc": "\u5168\u90E8\u5F00\u542F\uFF0C\u5305\u62EC\u7BAD\u5934\u548C\u6570\u5B66\u7B26\u53F7\uFF0C\u5E76\u81EA\u52A8\u5927\u5199\u3002",
  "stylePreset.developer.label": "\u5F00\u53D1\u8005\uFF08\u9759\u9ED8\uFF09",
  "stylePreset.developer.desc": "\u76F4\u5F15\u53F7\u548C\u666E\u901A\u8FDE\u5B57\u7B26\u4FDD\u6301\u8F93\u5165\u539F\u6837\u3002\u53EA\u8F6C\u6362\u7BAD\u5934\u548C\u6570\u5B66\u7B26\u53F7\u3002",
  // Rule presets
  "rulePreset.guillemets": "\u6CD5\u5F0F\u5F15\u53F7 << >>",
  "rulePreset.symbols": "\u7B26\u53F7 (c) (r) (tm)",
  // Settings
  "setting.quoteStyle.name": "\u5F15\u53F7",
  "setting.quoteStyle.desc": "\u5C06\u76F4\u5F15\u53F7\u8F6C\u6362\u4E3A\u54EA\u79CD\u5F15\u53F7\u89C4\u8303\u3002\u6487\u53F7\u5728\u6240\u6709\u89C4\u8303\u4E2D\u90FD\u662F\u540C\u4E00\u4E2A\u5B57\u7B26\uFF0C\u9700\u5355\u72EC\u8BBE\u7F6E\u3002",
  "setting.smartApostrophes.name": "\u6487\u53F7",
  "setting.smartApostrophes.desc": "it's \u53D8\u4E3A it\u2019s\u3002\u65E0\u8BBA\u662F\u5426\u8BBE\u7F6E\u4E86\u5F15\u53F7\u90FD\u6709\u6548\u3002",
  "setting.skipClosingQuote.name": "\u8DF3\u8FC7\u53F3\u5F15\u53F7",
  "setting.skipClosingQuote.desc": "\u5728\u5DF2\u6709\u53F3\u5F15\u53F7\u7684\u4F4D\u7F6E\u8F93\u5165\u53F3\u5F15\u53F7\u65F6\uFF0C\u5149\u6807\u4F1A\u79FB\u5230\u5B83\u540E\u9762\uFF0C\u800C\u4E0D\u662F\u518D\u6DFB\u52A0\u4E00\u4E2A\u3002",
  "setting.capitalizeSentences.name": "\u53E5\u9996\u5927\u5199",
  "setting.capitalizeSentences.desc": "\u5728\u884C\u9996\u6216\u5728 . ! ? \u4E4B\u540E\u7684\u53E5\u5B50\u5F00\u5934\u81EA\u52A8\u8F93\u5165\u5927\u5199\u5B57\u6BCD\u3002\u4EE3\u7801\u3001\u94FE\u63A5\u3001\u6807\u7B7E\u548C\u8DEF\u5F84\u4E2D\u4E0D\u4F1A\u751F\u6548\uFF0CMr.\u3001e.g.\u3001etc. \u7B49\u7F29\u5199\u4E4B\u540E\u4E5F\u4E0D\u4F1A\u3002\u7D27\u63A5\u7740\u6309\u9000\u683C\u952E\u53EF\u6062\u590D\u4E3A\u5C0F\u5199\u5B57\u6BCD\u3002",
  "setting.tabOut.name": "\u7528 Tab \u8DF3\u51FA",
  "setting.tabOut.desc": "\u5149\u6807\u7D27\u9760\u53F3\u5F15\u53F7\u6216\u53F3\u62EC\u53F7\u4E4B\u524D\u65F6\uFF0C\u6309 Tab \u4F1A\u79FB\u5230\u5B83\u4E4B\u540E\u3002\u5728\u5217\u8868\u4E2D Tab \u4ECD\u7528\u4E8E\u7F29\u8FDB\uFF0C\u5728\u8868\u683C\u4E2D\u4ECD\u7528\u4E8E\u5728\u5355\u5143\u683C\u4E4B\u95F4\u79FB\u52A8\u3002",
  "setting.wrapSelection.name": "\u7528\u5F15\u53F7\u5305\u4F4F\u6240\u9009\u6587\u672C",
  "setting.wrapSelection.desc": "\u9009\u4E2D\u6587\u672C\u540E\u8F93\u5165\u5F15\u53F7\uFF0C\u4F1A\u5728\u6587\u672C\u4E24\u4FA7\u52A0\u4E0A\u5F2F\u5F15\u53F7\uFF0C\u800C\u4E0D\u662F\u66FF\u6362\u8BE5\u6587\u672C\u3002",
  "setting.dashes.name": "\u7834\u6298\u53F7",
  "setting.dashes.desc": "-- \u53D8\u4E3A \u2013\uFF0C--- \u53D8\u4E3A \u2014\u3002",
  "setting.ellipsis.name": "\u7701\u7565\u53F7",
  "setting.ellipsis.desc": "... \u53D8\u4E3A \u2026\u3002",
  "setting.arrows.name": "\u7BAD\u5934",
  "setting.arrows.desc": "-> \u53D8\u4E3A \u2192\uFF0C<- \u53D8\u4E3A \u2190\uFF0C<-> \u53D8\u4E3A \u2194\uFF0C=> \u53D8\u4E3A \u21D2\u3002",
  "setting.mathSymbols.name": "\u6570\u5B66\u7B26\u53F7",
  "setting.mathSymbols.desc": ">= \u53D8\u4E3A \u2265\uFF0C<= \u53D8\u4E3A \u2264\uFF0C!= \u53D8\u4E3A \u2260\uFF0C+- \u53D8\u4E3A \xB1\u3002",
  "setting.excludedFolders.name": "\u6392\u9664\u7684\u6587\u4EF6\u5939",
  "setting.excludedFolders.desc": '\u8FD9\u4E9B\u6587\u4EF6\u5939\u5185\u7684\u7B14\u8BB0\u4E0D\u505A\u4EFB\u4F55\u66FF\u6362\uFF0C\u6BCF\u884C\u4E00\u4E2A\u6587\u4EF6\u5939\uFF08\u4F8B\u5982 Code \u6216 Templates/Raw\uFF09\u3002\u5355\u7BC7\u7B14\u8BB0\u53EF\u4EE5\u901A\u8FC7\u5C5E\u6027 "typography: off" \u6216\u547D\u4EE4\u201C\u5728\u6B64\u7B14\u8BB0\u4E2D\u5173\u95ED\u6216\u5F00\u542F\u81EA\u52A8\u66FF\u6362\u201D\u6765\u9000\u51FA\u3002',
  "setting.useLangProperty.name": "\u4F7F\u7528\u7B14\u8BB0\u7684 lang \u5C5E\u6027",
  "setting.useLangProperty.desc": '\u5E26\u6709 "lang: de" \u4E4B\u7C7B\u5C5E\u6027\u7684\u7B14\u8BB0\u4F1A\u4F7F\u7528\u8BE5\u8BED\u8A00\u7684\u5F15\u53F7\uFF08\u82F1\u6587\u3001\u5FB7\u6587\u3001\u6CD5\u6587\u3001\u897F\u73ED\u7259\u6587\u3001\u745E\u5178\u6587\u3001\u6CE2\u5170\u6587\u3001\u4FC4\u6587\uFF09\uFF0C\u9664\u975E\u5B83\u6709\u81EA\u5DF1\u7684 "typography-quotes"\u3002\u9ED8\u8BA4\u5173\u95ED\uFF0C\u56E0\u4E3A\u4F60\u73B0\u6709\u7684\u7B14\u8BB0\u53EF\u80FD\u5DF2\u5E26\u6709 lang \u5C5E\u6027\u3002',
  "setting.quotesByFolder.name": "\u6309\u6587\u4EF6\u5939\u8BBE\u7F6E\u5F15\u53F7",
  "setting.quotesByFolder.desc": '\u6BCF\u884C\u4E00\u6761\uFF1A\u6587\u4EF6\u5939\uFF0C\u7136\u540E\u662F " -> "\uFF0C\u7136\u540E\u662F\u89C4\u8303\uFF0C\u4F8B\u5982 Deutsch -> german\u3002\u6700\u5177\u4F53\u7684\u6587\u4EF6\u5939\u4F18\u5148\u3002\u7B14\u8BB0\u7684 "lang" \u5C5E\u6027\uFF08\u82E5\u4E0A\u9762\u7684\u5F00\u5173\u5DF2\u5F00\u542F\uFF09\u548C "typography-quotes" \u5C5E\u6027\u4F18\u5148\u4E8E\u6587\u4EF6\u5939\u8BBE\u7F6E\u3002\u53EF\u7528\u89C4\u8303\uFF1Aenglish\u3001german\u3001french\u3001spanish\u3001swedish\u3001polish\u3001russian\uFF0C\u6216\u7528 off \u8868\u793A\u76F4\u5F15\u53F7\u3002',
  "setting.customRules.name": "\u81EA\u5B9A\u4E49\u66FF\u6362",
  "setting.customRules.desc": '\u6BCF\u884C\u4E00\u6761\u89C4\u5219\uFF1A\u5148\u5199\u4F60\u8981\u8F93\u5165\u7684\u5B57\u7B26\uFF0C\u7136\u540E\u662F " -> "\uFF0C\u7136\u540E\u662F\u5B83\u4EEC\u53D8\u6210\u7684\u5185\u5BB9\uFF0C\u4F8B\u5982 (c) -> \xA9\u3002\u8F93\u5165\u89C4\u5219\u5E8F\u5217\u7684\u6700\u540E\u4E00\u4E2A\u5B57\u7B26\u65F6\u89E6\u53D1\uFF0C\u751F\u6548\u4F4D\u7F6E\u4E0E\u4E0A\u9762\u7684\u89C4\u5219\u76F8\u540C\uFF0C\u7D27\u63A5\u7740\u6309\u9000\u683C\u952E\u53EF\u6062\u590D\u4F60\u8F93\u5165\u7684\u5185\u5BB9\u3002\u4E0A\u9762\u7684\u89C4\u5219\u4F18\u5148\uFF1A\u5B83\u4EEC\u4E5F\u5904\u7406\u7684\u5E8F\u5217\uFF0C\u53EA\u6709\u5728\u5176\u5F00\u5173\u5173\u95ED\u65F6\u624D\u4F7F\u7528\u4F60\u7684\u89C4\u5219\u3002\u5E8F\u5217\u81F3\u5C11\u9700\u8981\u4E24\u4E2A\u5B57\u7B26\u3002',
  "setting.stylePreset.name": "\u6837\u5F0F\u9884\u8BBE",
  "setting.stylePreset.desc": "\u4E00\u6B21\u8BBE\u7F6E\u4E0A\u9762\u7684\u5404\u4E2A\u5F00\u5173\uFF1A\u5199\u4F5C\u3001\u5B66\u672F\u3001\u5F00\u53D1\u8005\uFF08\u9759\u9ED8\uFF09\u6216\u9ED8\u8BA4\u3002\u4F60\u7684\u6587\u4EF6\u5939\u3001\u5F15\u53F7\u6837\u5F0F\uFF08\u5F00\u53D1\u8005\u9884\u8BBE\u9664\u5916\uFF09\u548C\u81EA\u5B9A\u4E49\u66FF\u6362\u4F1A\u4FDD\u7559\u3002",
  "setting.rulePreset.name": "\u6DFB\u52A0\u9884\u8BBE",
  "setting.rulePreset.desc": "\u5C06\u4E00\u7EC4\u73B0\u6210\u7684\u89C4\u5219\u6DFB\u52A0\u5230\u4F60\u7684\u5217\u8868\u4E2D\uFF1B\u5DF2\u6709\u7684\u89C4\u5219\u4E0D\u53D7\u5F71\u54CD\u3002>> \u5728\u884C\u9996\u6C38\u8FDC\u4E0D\u4F1A\u88AB\u66FF\u6362\uFF0C\u56E0\u4E3A\u5728\u90A3\u91CC\u5B83\u8868\u793A\u5D4C\u5957\u5F15\u7528\u3002",
  "setting.keepsOut.name": "\u4E0D\u505A\u66FF\u6362\u7684\u4F4D\u7F6E",
  "setting.keepsOut.desc": "\u4EE3\u7801\u5757\u3001\u884C\u5185\u4EE3\u7801\u3001\u516C\u5F0F\u3001\u94FE\u63A5\u76EE\u6807\u3001frontmatter\u3001HTML \u6807\u7B7E\u548C\u6CE8\u91CA\uFF0C\u4EE5\u53CA Templater \u8868\u8FBE\u5F0F\u90FD\u4F1A\u4FDD\u6301\u8F93\u5165\u539F\u6837\u3002\u66FF\u6362\u4E4B\u540E\u7D27\u63A5\u7740\u6309\u9000\u683C\u952E\u53EF\u6062\u590D\u4F60\u8F93\u5165\u7684\u5185\u5BB9\u3002",
  "setting.folderStatus.name": "\u751F\u6548\u7684\u6587\u4EF6\u5939",
  "setting.rulesStatus.name": "\u751F\u6548\u7684\u89C4\u5219",
  // Status lines under the text areas
  "status.noFolders": "\u8FD8\u6CA1\u6709\u6587\u4EF6\u5939\u3002",
  "status.folders.one": "\u6709 1 \u4E2A\u6587\u4EF6\u5939\u751F\u6548\u3002",
  "status.folders.other": "\u6709 {count} \u4E2A\u6587\u4EF6\u5939\u751F\u6548\u3002",
  "status.noRules": "\u8FD8\u6CA1\u6709\u89C4\u5219\u3002",
  "status.rules.one": "\u6709 1 \u6761\u89C4\u5219\u751F\u6548\u3002",
  "status.rules.other": "\u6709 {count} \u6761\u89C4\u5219\u751F\u6548\u3002",
  "status.ignored": "\u5DF2\u5FFD\u7565\uFF0C\u7B2C {line} \u884C\uFF08{text}\uFF09\uFF1A{reason}\u3002",
  // Why a line of the custom rules is ignored
  "reason.noSeparator": '\u5E8F\u5217\u548C\u66FF\u6362\u5185\u5BB9\u4E4B\u95F4\u6CA1\u6709 "{separator}"',
  "reason.sequenceLineBreak": "\u5E8F\u5217\u5305\u542B\u6362\u884C",
  "reason.sequenceEmpty": "\u5E8F\u5217\u4E3A\u7A7A",
  "reason.sequenceSpaces": "\u5E8F\u5217\u53EA\u6709\u7A7A\u683C",
  "reason.sequenceShort": "\u5E8F\u5217\u81F3\u5C11\u9700\u8981\u4E24\u4E2A\u5B57\u7B26",
  "reason.sequenceEmoji": "\u5E8F\u5217\u4EE5\u8868\u60C5\u7B26\u53F7\u6216\u7C7B\u4F3C\u5B57\u7B26\u7ED3\u5C3E",
  "reason.replacementLineBreak": "\u66FF\u6362\u5185\u5BB9\u5305\u542B\u6362\u884C",
  "reason.replacementEmpty": "\u66FF\u6362\u5185\u5BB9\u4E3A\u7A7A",
  "reason.replacementSame": "\u66FF\u6362\u5185\u5BB9\u4E0E\u5E8F\u5217\u76F8\u540C",
  "reason.duplicate": "\u76F8\u540C\u7684\u5E8F\u5217\u5DF2\u5728\u7B2C {line} \u884C",
  "reason.clash": "\u7B2C {line} \u884C\u7684\u89C4\u5219\u5DF2\u7531\u76F8\u540C\u7684\u6309\u952E\u89E6\u53D1",
  "reason.folderFormat": '\u5148\u5199\u6587\u4EF6\u5939\uFF0C\u7136\u540E\u662F " -> "\uFF0C\u7136\u540E\u662F\u89C4\u8303',
  "reason.noFolder": '"->" \u4E4B\u524D\u6CA1\u6709\u6587\u4EF6\u5939',
  "reason.unknownConvention": "\u672A\u77E5\u7684\u89C4\u8303",
  // Modals
  "modal.preset.title": "\u9009\u62E9\u6392\u7248\u98CE\u683C",
  "modal.preset.intro": "\u9009\u4E00\u4E2A\u8D77\u70B9\u3002\u4E4B\u540E\u4F60\u53EF\u4EE5\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u4FEE\u6539\u6BCF\u4E2A\u5F00\u5173\uFF0C\u8FD9\u4E9B\u9884\u8BBE\u4E5F\u5217\u5728\u90A3\u91CC\u3002",
  "modal.preset.keepDefault": "\u4FDD\u6301\u9ED8\u8BA4",
  "modal.preset.use": "\u4F7F\u7528\u201C{preset}\u201D",
  "modal.quotes.placeholder": "\u6B64\u7B14\u8BB0\u7684\u5F15\u53F7",
  "modal.quotes.follow": "\u6CBF\u7528\u6587\u4EF6\u5939\u548C\u5168\u5C40\u8BBE\u7F6E\uFF08\u79FB\u9664\u8BE5\u5C5E\u6027\uFF09",
  "modal.quotes.straight": "\u76F4\u5F15\u53F7\uFF08\u5173\u95ED\uFF09"
};
var zh_default = zh;

// src/i18n.ts
var LOCALES = ["en", "zh", "ja", "ko", "es", "de", "fr", "pt-BR", "ru"];
var CATALOGS = { en: en_default, zh: zh_default, ja: ja_default, ko: ko_default, es: es_default, de: de_default, fr: fr_default, "pt-BR": pt_BR_default, ru: ru_default };
function resolveLocale(code) {
  var _a;
  const wanted = code == null ? void 0 : code.trim().toLowerCase();
  return (_a = LOCALES.find((l) => l.toLowerCase() === wanted)) != null ? _a : null;
}
var LANGUAGE_KEY = "language";
function detectLocale(getLanguage) {
  var _a;
  try {
    const code = getLanguage ? getLanguage() : typeof window === "undefined" ? null : window.localStorage.getItem(LANGUAGE_KEY);
    return (_a = resolveLocale(code)) != null ? _a : "en";
  } catch (e) {
    return "en";
  }
}
var current = detectLocale();
function getLocale() {
  return current;
}
function format(text, vars) {
  if (!vars)
    return text;
  return text.replace(/\{(\w+)\}/g, (whole, name) => name in vars ? String(vars[name]) : whole);
}
function t(key, ...args) {
  const vars = args[0];
  return format(CATALOGS[current][key] || en_default[key], vars);
}

// src/custom.ts
var SEPARATOR = " -> ";
function problemWith(sequence, replacement) {
  if (sequence.includes("\n") || sequence.includes("\r"))
    return t("reason.sequenceLineBreak");
  if (sequence.length === 0)
    return t("reason.sequenceEmpty");
  if (sequence.trim().length === 0)
    return t("reason.sequenceSpaces");
  if ([...sequence].length < 2)
    return t("reason.sequenceShort");
  if (/[\uDC00-\uDFFF]$/.test(sequence))
    return t("reason.sequenceEmoji");
  if (replacement.includes("\n") || replacement.includes("\r"))
    return t("reason.replacementLineBreak");
  if (replacement.length === 0)
    return t("reason.replacementEmpty");
  if (replacement === sequence)
    return t("reason.replacementSame");
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
      ignored.push({ line, text, reason: t("reason.noSeparator", { separator: SEPARATOR.trim() }) });
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
      ignored.push({ line, text, reason: t("reason.duplicate", { line: earlier }) });
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
        reason: t("reason.clash", { line: clash.line })
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
    get label() {
      return t("rulePreset.guillemets");
    },
    rules: [
      ["<<", "\xAB"],
      [">>", "\xBB"]
    ]
  },
  {
    id: "symbols",
    get label() {
      return t("rulePreset.symbols");
    },
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
    get label() {
      return t("convention.english");
    },
    doubleOpen: "\u201C",
    doubleClose: "\u201D",
    singleOpen: "\u2018",
    singleClose: "\u2019",
    padding: ""
  },
  {
    id: "german",
    get label() {
      return t("convention.german");
    },
    doubleOpen: "\u201E",
    doubleClose: "\u201C",
    singleOpen: "\u201A",
    singleClose: "\u2018",
    padding: ""
  },
  {
    id: "french",
    get label() {
      return t("convention.french");
    },
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
    get label() {
      return t("convention.spanish");
    },
    doubleOpen: "\xAB",
    doubleClose: "\xBB",
    singleOpen: "\u201C",
    singleClose: "\u201D",
    padding: ""
  },
  {
    id: "swedish",
    get label() {
      return t("convention.swedish");
    },
    doubleOpen: "\u201D",
    doubleClose: "\u201D",
    singleOpen: "\u2019",
    singleClose: "\u2019",
    padding: ""
  },
  {
    id: "polish",
    get label() {
      return t("convention.polish");
    },
    doubleOpen: "\u201E",
    doubleClose: "\u201D",
    singleOpen: "\u201A",
    singleClose: "\u2019",
    padding: ""
  },
  {
    id: "russian",
    get label() {
      return t("convention.russian");
    },
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
  quotesByFolder: "",
  useLangProperty: false,
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
  if (action.kind === "replace" && action.from < before.length && protectedRegionAt(before.slice(0, action.from)) !== null) {
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
function setNoteProperty(text, name, value) {
  const fm = frontMatter(text);
  const wanted = `${name}: ${value}`;
  const own = new RegExp(`^${name}[ \\t]*:.*$`);
  if (value !== null) {
    if (!fm)
      return { from: 0, to: 0, insert: `---
${wanted}
---
` };
    let at2 = fm.bodyFrom;
    while (at2 < fm.closeFrom) {
      const end = text.indexOf("\n", at2);
      const line = text.slice(at2, end).replace(/\r$/, "");
      if (own.test(line))
        return line === wanted ? null : { from: at2, to: at2 + line.length, insert: wanted };
      at2 = end + 1;
    }
    return { from: fm.closeFrom, to: fm.closeFrom, insert: `${wanted}
` };
  }
  if (!fm)
    return null;
  let at = fm.bodyFrom;
  while (at < fm.closeFrom) {
    const end = text.indexOf("\n", at);
    const line = text.slice(at, end).replace(/\r$/, "");
    if (own.test(line)) {
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

// src/quotes.ts
var QUOTES_PROPERTY = "typography-quotes";
var LANG_PROPERTY = "lang";
var LANGUAGE_CODES = {
  en: "english",
  de: "german",
  fr: "french",
  es: "spanish",
  sv: "swedish",
  pl: "polish",
  ru: "russian"
};
var NAMES = {
  deutsch: "german",
  fran\u00E7ais: "french",
  francais: "french",
  espa\u00F1ol: "spanish",
  espanol: "spanish",
  svenska: "swedish",
  polski: "polish",
  \u0440\u0443\u0441\u0441\u043A\u0438\u0439: "russian",
  off: "off",
  none: "off",
  straight: "off"
};
function parseConvention(value) {
  if (value === false)
    return "off";
  if (typeof value !== "string")
    return null;
  const key = value.trim().toLowerCase();
  if (key === "")
    return null;
  if (key === "off")
    return "off";
  const known = QUOTE_CONVENTIONS.find((c) => c.id === key);
  if (known)
    return known.id;
  const named = new Map(Object.entries(NAMES)).get(key);
  return named != null ? named : languageConvention(key);
}
function languageConvention(value) {
  var _a;
  if (typeof value !== "string")
    return null;
  const primary = value.trim().toLowerCase().split(/[-_]/)[0];
  return (_a = new Map(Object.entries(LANGUAGE_CODES)).get(primary)) != null ? _a : null;
}
function folderQuotesFor(setting) {
  const folders = [];
  const ignored = [];
  setting.split(/\r?\n/).forEach((text, index) => {
    if (text.trim() === "")
      return;
    const line = index + 1;
    const at = text.lastIndexOf("->");
    if (at === -1) {
      ignored.push({ line, text, reason: t("reason.folderFormat") });
      return;
    }
    const folder = folderList(text.slice(0, at))[0];
    if (folder === void 0) {
      ignored.push({ line, text, reason: t("reason.noFolder") });
      return;
    }
    const style = parseConvention(text.slice(at + 2));
    if (style === null) {
      ignored.push({ line, text, reason: t("reason.unknownConvention") });
      return;
    }
    folders.push({ folder, style });
  });
  return { folders, ignored };
}
function folderQuoteStyle(path, setting) {
  let best = null;
  for (const entry of folderQuotesFor(setting).folders) {
    if (path !== entry.folder && !path.startsWith(entry.folder + "/"))
      continue;
    if (best === null || entry.folder.length >= best.folder.length)
      best = entry;
  }
  return best === null ? null : best.style;
}
function resolveQuoteStyle(note, settings) {
  const fromProperty = parseConvention(note.quotes);
  if (fromProperty !== null)
    return fromProperty;
  if (settings.useLangProperty) {
    const fromLang = languageConvention(note.lang);
    if (fromLang !== null)
      return fromLang;
  }
  if (note.path !== null && settings.quotesByFolder) {
    const fromFolder = folderQuoteStyle(note.path, settings.quotesByFolder);
    if (fromFolder !== null)
      return fromFolder;
  }
  return settings.quoteStyle;
}
function settingsForNote(note, settings) {
  const style = resolveQuoteStyle(note, settings);
  return style === settings.quoteStyle ? settings : { ...settings, quoteStyle: style };
}

// src/presets.ts
var STYLE_PRESETS = [
  {
    id: "default",
    get label() {
      return t("stylePreset.default.label");
    },
    get desc() {
      return t("stylePreset.default.desc");
    },
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
    get label() {
      return t("stylePreset.writer.label");
    },
    get desc() {
      return t("stylePreset.writer.desc");
    },
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
    get label() {
      return t("stylePreset.academic.label");
    },
    get desc() {
      return t("stylePreset.academic.desc");
    },
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
    get label() {
      return t("stylePreset.developer.label");
    },
    get desc() {
      return t("stylePreset.developer.desc");
    },
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

// src/more-link.ts
var MORE_URL = "https://perezamadorluisenrique-gif.github.io/pro/";
var TEXT = {
  en: { name: "More plugins and Pro", desc: "Other plugins by Siulved54, the optional Pro versions and template vaults. Opens a web page.", button: "Open" },
  zh: { name: "\u66F4\u591A\u63D2\u4EF6\u548C Pro \u7248", desc: "Siulved54 \u7684\u5176\u4ED6\u63D2\u4EF6\u3001\u53EF\u9009\u7684 Pro \u7248\u672C\u548C\u6A21\u677F\u5E93\u3002\u5C06\u6253\u5F00\u4E00\u4E2A\u7F51\u9875\u3002", button: "\u6253\u5F00" },
  ja: { name: "\u305D\u306E\u4ED6\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u3068 Pro", desc: "Siulved54 \u306E\u4ED6\u306E\u30D7\u30E9\u30B0\u30A4\u30F3\u3001\u4EFB\u610F\u306E Pro \u7248\u3001\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8 Vault\u3002Web \u30DA\u30FC\u30B8\u3092\u958B\u304D\u307E\u3059\u3002", button: "\u958B\u304F" },
  ko: { name: "\uB354 \uB9CE\uC740 \uD50C\uB7EC\uADF8\uC778\uACFC Pro", desc: "Siulved54\uC758 \uB2E4\uB978 \uD50C\uB7EC\uADF8\uC778, \uC120\uD0DD\uD615 Pro \uBC84\uC804\uACFC \uD15C\uD50C\uB9BF \uBCF4\uAD00\uD568\uC785\uB2C8\uB2E4. \uC6F9 \uD398\uC774\uC9C0\uAC00 \uC5F4\uB9BD\uB2C8\uB2E4.", button: "\uC5F4\uAE30" },
  es: { name: "M\xE1s plugins y Pro", desc: "Otros plugins de Siulved54, las versiones Pro opcionales y los vaults de plantillas. Abre una p\xE1gina web.", button: "Abrir" },
  de: { name: "Weitere Plugins und Pro", desc: "Weitere Plugins von Siulved54, die optionalen Pro-Versionen und Vorlagen-Vaults. \xD6ffnet eine Webseite.", button: "\xD6ffnen" },
  fr: { name: "Plus de plugins et Pro", desc: "Les autres plugins de Siulved54, les versions Pro facultatives et les coffres de mod\xE8les. Ouvre une page web.", button: "Ouvrir" },
  "pt-BR": { name: "Mais plugins e Pro", desc: "Outros plugins do Siulved54, as vers\xF5es Pro opcionais e os vaults de modelos. Abre uma p\xE1gina da web.", button: "Abrir" },
  ru: { name: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u044B \u0438 Pro", desc: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u044B Siulved54, \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 Pro \u0438 \u043D\u0430\u0431\u043E\u0440\u044B \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432. \u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443.", button: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" }
};
function moreText(locale = getLocale()) {
  var _a;
  return (_a = TEXT[locale]) != null ? _a : TEXT.en;
}
function openMore() {
  window.open(MORE_URL, "_blank", "noopener");
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
      name: t("command.toggleNote"),
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
          off ? t("notice.substitutionsOff") : folder ? t("notice.removedButExcluded") : t("notice.substitutionsOn")
        );
      }
    });
    this.addCommand({
      id: "set-quotes",
      name: t("command.setQuotes"),
      icon: "quote",
      editorCallback: (editor, ctx) => {
        const file = ctx.file;
        if (!file)
          return;
        new QuotesModal(this.app, (choice) => void this.writeNoteQuotes(editor, file, choice)).open();
      }
    });
    this.addCommand({
      id: "apply-to-text",
      name: t("command.applyToText"),
      icon: iconOr("wand-sparkles", "wand-2"),
      editorCallback: (editor, ctx) => {
        const text = editor.getValue();
        const ranges = editor.somethingSelected() ? editor.listSelections().map((s) => {
          const a = editor.posToOffset(s.anchor);
          const b = editor.posToOffset(s.head);
          return [Math.min(a, b), Math.max(a, b)];
        }) : [[0, text.length]];
        const changes = [];
        const settings = this.settingsFor(ctx.file);
        for (const [from, to] of ranges) {
          const original = text.slice(from, to);
          const result = typographize(original, settings, text.slice(0, from));
          changes.push(...changesBetween(original, result, from));
        }
        if (changes.length === 0) {
          new import_obsidian.Notice(t("notice.nothingToChange"));
          return;
        }
        editor.transaction({
          changes: changes.map((c) => ({ from: editor.offsetToPos(c.from), to: editor.offsetToPos(c.to), text: c.insert }))
        });
        new import_obsidian.Notice(changes.length === 1 ? t("notice.changedLines.one") : t("notice.changedLines.other", { count: changes.length }));
      }
    });
  }
  /** Writes (or, for null, removes) the note's `typography-quotes` property. */
  async writeNoteQuotes(editor, file, choice) {
    const fileManager = this.app.fileManager;
    if (typeof fileManager.processFrontMatter === "function") {
      await fileManager.processFrontMatter(file, (frontmatter) => {
        if (choice === null)
          delete frontmatter[QUOTES_PROPERTY];
        else
          frontmatter[QUOTES_PROPERTY] = choice;
      });
    } else {
      const edit = setNoteProperty(editor.getValue(), QUOTES_PROPERTY, choice);
      if (edit) {
        editor.transaction({
          changes: [{ from: editor.offsetToPos(edit.from), to: editor.offsetToPos(edit.to), text: edit.insert }]
        });
      }
    }
    const style = settingsForNote({ path: file.path, quotes: choice, lang: void 0 }, this.settings);
    const convention = conventionFor(style.quoteStyle);
    new import_obsidian.Notice(
      choice === null ? t("notice.quotesFollowFolder") : convention ? t("notice.quotesSet", { style: convention.label }) : t("notice.quotesStraight")
    );
  }
  /**
   * The settings for one note: the global ones with the quotation marks
   * its property, language or folder asks for. The properties are read from
   * the metadata cache, a lookup, like the `typography` property.
   */
  settingsFor(file) {
    var _a;
    const settings = this.settings;
    if (!file)
      return settings;
    const frontmatter = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    return settingsForNote(
      { path: file.path, quotes: frontmatter == null ? void 0 : frontmatter[QUOTES_PROPERTY], lang: frontmatter == null ? void 0 : frontmatter[LANG_PROPERTY] },
      settings
    );
  }
  /** `settingsFor` for the note in an editor. */
  settingsForState(state) {
    var _a;
    return this.settingsFor((_a = state.field(import_obsidian.editorInfoField, false)) == null ? void 0 : _a.file);
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
    const settings = (state) => this.settingsForState(state);
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
            settings(state)
          );
          if (changes.length > 0)
            view.dispatch({ changes, userEvent: "input.type" });
        }
      }
    );
  }
  handleInput(view, from, to, text) {
    if (view.composing || view.compositionStarted)
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
      this.settingsForState(state)
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
    if (!this.settings.wrapSelection || this.leftAlone(state))
      return false;
    const wrap = wrapFor(text, this.settingsForState(state));
    if (wrap === null)
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
      this.settingsForState(state)
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
  const options = { off: t("convention.off") };
  for (const convention of QUOTE_CONVENTIONS)
    options[convention.id] = convention.label;
  return options;
}
function settingText(key) {
  return { name: t(`setting.${key}.name`), desc: t(`setting.${key}.desc`) };
}
var customStatusText = () => ({ name: t("setting.rulesStatus.name") });
var folderStatusText = () => ({ name: t("setting.folderStatus.name") });
var presetText = () => ({ name: t("setting.rulePreset.name"), desc: t("setting.rulePreset.desc") });
var keepsOutNote = () => ({ name: t("setting.keepsOut.name"), desc: t("setting.keepsOut.desc") });
var TOGGLE_KEYS = [
  "smartApostrophes",
  "skipClosingQuote",
  "dashes",
  "ellipsis",
  "arrows",
  "mathSymbols",
  "capitalizeSentences",
  "tabOut",
  "wrapSelection",
  "useLangProperty"
];
var stylePresetText = () => ({ name: t("setting.stylePreset.name"), desc: t("setting.stylePreset.desc") });
var SmartTypographySettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    /** Where the custom rules' status is written, while the tab is open. */
    this.statusEl = null;
    this.folderStatusEl = null;
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
        ...settingText("quoteStyle"),
        control: {
          type: "dropdown",
          key: "quoteStyle",
          options: quoteStyleOptions(),
          defaultValue: DEFAULT_SETTINGS.quoteStyle
        }
      },
      {
        ...stylePresetText(),
        searchable: true,
        render: (setting) => this.stylePresetButtons(setting)
      },
      ...TOGGLE_KEYS.map((key) => ({
        ...settingText(key),
        control: {
          type: "toggle",
          key,
          defaultValue: DEFAULT_SETTINGS[key]
        }
      })),
      {
        ...settingText("excludedFolders"),
        control: {
          type: "textarea",
          key: "excludedFolders",
          placeholder: "Code\nTemplates",
          rows: 3,
          defaultValue: DEFAULT_SETTINGS.excludedFolders
        }
      },
      {
        ...settingText("quotesByFolder"),
        control: {
          type: "textarea",
          key: "quotesByFolder",
          placeholder: "Deutsch -> german\nFrance/Notes -> french",
          rows: 3,
          defaultValue: DEFAULT_SETTINGS.quotesByFolder
        }
      },
      {
        ...folderStatusText(),
        searchable: false,
        render: (setting) => {
          this.folderStatusEl = setting.descEl;
          this.showFolderStatus();
          return () => {
            this.folderStatusEl = null;
          };
        }
      },
      {
        ...settingText("customRules"),
        control: {
          type: "textarea",
          key: "customRules",
          placeholder: ":check: -> \u2713",
          rows: 4,
          defaultValue: DEFAULT_SETTINGS.customRules
        }
      },
      {
        ...customStatusText(),
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
        ...presetText(),
        render: (setting) => this.presetButtons(setting)
      },
      // No control: a row that is only an explanation, which also puts the
      // sentence in the settings search.
      keepsOutNote(),
      { name: moreText().name, desc: moreText().desc, action: () => openMore() }
    ];
  }
  /** Says how many folder lines are in use and which are ignored, and why. */
  showFolderStatus() {
    const el = this.folderStatusEl;
    if (!el)
      return;
    el.empty();
    const { folders, ignored } = folderQuotesFor(this.plugin.settings.quotesByFolder);
    el.createDiv({
      text: folders.length === 0 ? t("status.noFolders") : folders.length === 1 ? t("status.folders.one") : t("status.folders.other", { count: folders.length })
    });
    for (const item of ignored) {
      el.createDiv({
        cls: "mod-warning",
        text: t("status.ignored", { line: item.line, text: item.text.trim(), reason: item.reason })
      });
    }
  }
  /** Says how many custom rules are in use and which lines are ignored, and why. */
  showStatus() {
    const el = this.statusEl;
    if (!el)
      return;
    el.empty();
    const { rules, ignored } = customRulesFor(this.plugin.settings.customRules);
    el.createDiv({
      text: rules.length === 0 ? t("status.noRules") : rules.length === 1 ? t("status.rules.one") : t("status.rules.other", { count: rules.length })
    });
    for (const item of ignored) {
      el.createDiv({
        cls: "mod-warning",
        text: t("status.ignored", { line: item.line, text: item.text.trim(), reason: item.reason })
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
    new import_obsidian.Notice(t("notice.presetApplied", { preset: preset.label }));
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
      new import_obsidian.Notice(t("notice.presetRulesPresent"));
      return;
    }
    this.plugin.settings.customRules = setting;
    await this.plugin.saveSettings();
    new import_obsidian.Notice(added === 1 ? t("notice.rulesAdded.one") : t("notice.rulesAdded.other", { count: added }));
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
    if (key === "quotesByFolder")
      this.showFolderStatus();
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
    new import_obsidian.Setting(containerEl).setName(settingText("quoteStyle").name).setDesc(settingText("quoteStyle").desc).addDropdown((dropdown) => {
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
      new import_obsidian.Setting(containerEl).setName(stylePresetText().name).setDesc(stylePresetText().desc)
    );
    for (const key of TOGGLE_KEYS)
      this.addToggle(key);
    new import_obsidian.Setting(containerEl).setName(settingText("excludedFolders").name).setDesc(settingText("excludedFolders").desc).addTextArea((area) => {
      area.setPlaceholder("Code\nTemplates").setValue(this.plugin.settings.excludedFolders);
      area.onChange(async (value) => {
        this.plugin.settings.excludedFolders = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName(settingText("quotesByFolder").name).setDesc(settingText("quotesByFolder").desc).addTextArea((area) => {
      area.setValue(this.plugin.settings.quotesByFolder);
      area.onChange(async (value) => {
        this.plugin.settings.quotesByFolder = value;
        await this.plugin.saveSettings();
        this.showFolderStatus();
      });
    });
    const folderStatus = new import_obsidian.Setting(containerEl).setName(folderStatusText().name);
    this.folderStatusEl = folderStatus.descEl;
    this.showFolderStatus();
    new import_obsidian.Setting(containerEl).setName(settingText("customRules").name).setDesc(settingText("customRules").desc).addTextArea((area) => {
      area.setPlaceholder(":check: -> \u2713").setValue(this.plugin.settings.customRules);
      area.onChange(async (value) => {
        this.plugin.settings.customRules = value;
        await this.plugin.saveSettings();
        this.showStatus();
      });
    });
    const status = new import_obsidian.Setting(containerEl).setName(customStatusText().name);
    this.statusEl = status.descEl;
    this.showStatus();
    this.presetButtons(new import_obsidian.Setting(containerEl).setName(presetText().name).setDesc(presetText().desc));
    containerEl.createEl("p", {
      text: `${keepsOutNote().name}. ${keepsOutNote().desc}`,
      cls: "setting-item-description"
    });
    new import_obsidian.Setting(containerEl).setName(moreText().name).setDesc(moreText().desc).addButton((button) => button.setButtonText(moreText().button).onClick(() => openMore()));
  }
  addToggle(key) {
    new import_obsidian.Setting(this.containerEl).setName(settingText(key).name).setDesc(settingText(key).desc).addToggle((toggle) => {
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
    this.setTitle(t("modal.preset.title"));
    contentEl.createEl("p", {
      text: t("modal.preset.intro")
    });
    for (const preset of STYLE_PRESETS) {
      new import_obsidian.Setting(contentEl).setName(preset.label).setDesc(preset.desc).addButton(
        (button) => button.setButtonText(preset.id === "default" ? t("modal.preset.keepDefault") : t("modal.preset.use", { preset: preset.label })).onClick(() => {
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
var QuotesModal = class extends import_obsidian.FuzzySuggestModal {
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.setPlaceholder(t("modal.quotes.placeholder"));
  }
  getItems() {
    return [
      { label: t("modal.quotes.follow"), value: null },
      ...QUOTE_CONVENTIONS.map((c) => ({ label: c.label, value: c.id })),
      { label: t("modal.quotes.straight"), value: "off" }
    ];
  }
  getItemText(item) {
    return item.label;
  }
  onChooseItem(item) {
    this.onChoose(item.value);
  }
};
function iconOr(name, older) {
  return (0, import_obsidian.getIcon)(name) ? name : older;
}

/* nosourcemap */