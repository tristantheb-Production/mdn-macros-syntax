import * as vscode from 'vscode'
import { levenshtein } from '../utils/levenshtein'
import { getKnownMacros } from '../macros'

/**
 * Provide quick-fix code actions for unknown macro diagnostics (suggest replacements).
 */
const codeActionProvider: vscode.CodeActionProvider = {
  provideCodeActions(document: vscode.TextDocument, _range: vscode.Range, context: vscode.CodeActionContext) {
    const actions: vscode.CodeAction[] = []
    const locale = vscode.env.language || 'en'
    const KNOWN_MACROS = getKnownMacros(locale)
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source === 'mdn-macros' && diagnostic.code === 'unknownMacro') {
        const diagText = document.getText(diagnostic.range)
        // accept both {{Name(...)}} and {{Name}}
        const nameMatch = /\{\{\s*([A-Za-z0-9_\-]+)(?:\s*\(|\s*\}\})?/.exec(diagText)
        if (!nameMatch) continue
        const unknownName = nameMatch[1]

        let best: { name: string; dist: number } | null = null
        for (const k of Object.keys(KNOWN_MACROS)) {
          const d = levenshtein(unknownName.toLowerCase(), k.toLowerCase())
          if (!best || d < best.dist) best = { name: k, dist: d }
        }

        if (best && best.dist <= Math.max(1, Math.floor(unknownName.length / 3))) {
          const action = new vscode.CodeAction(`Replace with '${best.name}'`, vscode.CodeActionKind.QuickFix)
          action.diagnostics = [diagnostic]
          const nameIdx = diagText.indexOf(unknownName)
          if (nameIdx >= 0) {
            const startOffset = document.offsetAt(diagnostic.range.start) + nameIdx
            const editRange = new vscode.Range(
              document.positionAt(startOffset),
              document.positionAt(startOffset + unknownName.length)
            )
            const we = new vscode.WorkspaceEdit()
            we.replace(document.uri, editRange, best.name)
            action.edit = we
            action.isPreferred = true
            actions.push(action)
          }
        }
      }
    }
    return actions
  }
}

export { codeActionProvider }
