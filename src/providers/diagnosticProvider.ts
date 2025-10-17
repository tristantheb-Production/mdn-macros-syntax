import * as vscode from 'vscode';
import { getKnownMacros } from '../macros';
import { makeMacroRegex } from '../utils/constants';
import { levenshtein } from '../utils/levenshtein';

/**
 * Compute diagnostics for a document by looking for unknown MDN macros.
 * Returns an array of Diagnostic entries for VS Code.
 */
export function computeDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  if (document.languageId !== 'mdn-macros' && document.languageId !== 'markdown') return diagnostics;
  const text = document.getText();
  const locale = vscode.env.language || 'en';
  const KNOWN_MACROS = getKnownMacros(locale);
  const macroRegex = makeMacroRegex();
  let match: RegExpExecArray | null;
  while ((match = macroRegex.exec(text)) !== null) {
    const name = match[1];
    if (!KNOWN_MACROS[name]) {
      // find best suggestion (case-insensitive levenshtein)
      let best: { name: string; dist: number } | null = null;
      for (const k of Object.keys(KNOWN_MACROS)) {
        const d = levenshtein(name.toLowerCase(), k.toLowerCase());
        if (!best || d < best.dist) best = { name: k, dist: d };
      }
      const threshold = Math.max(1, Math.floor(name.length / 3));
      const suggestion = (best && best.dist <= threshold) ? ` Did you mean '${best.name}'?` : '';

      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(start, end);
      const diagnostic = new vscode.Diagnostic(range, `Unknown MDN macro: ${name}.${suggestion}`, vscode.DiagnosticSeverity.Warning);
      diagnostic.source = 'mdn-macros';
      diagnostic.code = 'unknownMacro';
      diagnostics.push(diagnostic);
    }
  }
  return diagnostics;
}
