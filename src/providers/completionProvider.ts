import * as vscode from 'vscode';
import { getKnownMacros } from '../macros';

/**
 * Completion provider for MDN macros.
 * Triggers when user types '{{' and offers macro names with simple parameter snippets.
 */
export const completionProvider: vscode.CompletionItemProvider = {
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const prefix = document.lineAt(position.line).text.substring(0, position.character);
    if (!/\{\{\s*$/.test(prefix)) return [];
    const locale = (vscode.env.language || 'en');
    const KNOWN_MACROS = getKnownMacros(locale);

    // Determine whether a closing '}}' already exists immediately after the cursor (strict: no whitespace)
    const offset = document.offsetAt(position);
    const docText = document.getText();
    const remaining = docText.substring(offset, Math.min(offset + 16, docText.length));
    const closingExistsStrict = /^\}\}/.test(remaining);

    // If there is a non-empty selection that already includes the closing braces, we should not append
    const selection = vscode.window.activeTextEditor?.selection;
    const selectionContainsClosing = !!selection && !selection.isEmpty && document.getText(selection).includes('}}');

    return Object.keys(KNOWN_MACROS).map((key) => {
      const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Function);
      item.detail = KNOWN_MACROS[key].description;
      const params = KNOWN_MACROS[key].params ? KNOWN_MACROS[key].params.map((p, i) => {
        // Use snippet placeholders like ${1:term} and wrap strings in quotes
        const idx = i + 1;
        if (p.type === 'enum' && p.allowedValues && p.allowedValues.length) {
          const choices = p.allowedValues.map(v => v.replace(/\s+/g, '_')).join(',');
          return `\"${'${' + idx + '|' + choices + '|}'}\"`;
        }
        if (p.type === 'string') {
          return `\"${'${' + idx + ':' + p.name + '}'}\"`;
        }
        return `${'${' + idx + ':' + p.name + '}'} `;
      }).join(', ') : '${1}';

      const shouldAppendClosing = !(closingExistsStrict || selectionContainsClosing);
      const insertSnippet = shouldAppendClosing ? `${key}(${params})}}` : `${key}(${params})`;
      item.insertText = new vscode.SnippetString(insertSnippet);
      return item;
    });
  }
};
