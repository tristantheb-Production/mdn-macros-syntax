import * as vscode from 'vscode'
import { makeMacroRegex } from '../../utils/constants'
import { getKnownMacros } from '../../macros'

class DeprecatedMarkerComponent {
  activate(context: vscode.ExtensionContext) {
    // decoration that highlights the whole macro range (red translucent background + subtle border)
    const highlightDeco = vscode.window.createTextEditorDecorationType({
      backgroundColor: 'rgba(255, 77, 79, 0.12)',
      border: '1px solid rgba(255, 77, 79, 0.28)',
      borderRadius: '3px'
    })

    // decoration that places a red 'DEPRECATED' label after the macro closing braces
    const labelDeco = vscode.window.createTextEditorDecorationType({
      after: { contentText: 'DEPRECATED', color: '#ff4d4f', margin: '0 0 0 8px', fontWeight: '600' },
      isWholeLine: false
    })

    context.subscriptions.push(highlightDeco, labelDeco)

    function update(editor: vscode.TextEditor | undefined) {
      if (!editor) return
      const doc = editor.document
      if (doc.languageId !== 'markdown' && doc.languageId !== 'mdn-macros') return

      const text = doc.getText()
      const macroRegex = makeMacroRegex()
      const highlightRanges: vscode.Range[] = []
      const labelRanges: vscode.Range[] = []
      let match: RegExpExecArray | null
      const locale = vscode.env.language || 'en'
      const KNOWN = getKnownMacros(locale)
      while ((match = macroRegex.exec(text)) !== null) {
        const name = match[1]
        const meta = KNOWN[name]
        if (meta && meta.deprecated) {
          const startPos = doc.positionAt(match.index)
          const endPos = doc.positionAt(match.index + match[0].length)
          // highlight entire macro
          highlightRanges.push(new vscode.Range(startPos, endPos))
          // place label after closing braces (zero-length range at end)
          labelRanges.push(new vscode.Range(endPos, endPos))
        }
      }

      editor.setDecorations(highlightDeco, highlightRanges)
      editor.setDecorations(labelDeco, labelRanges)
    }

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => update(e)))
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
      if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document) {
        update(vscode.window.activeTextEditor)
      }
    }))

    update(vscode.window.activeTextEditor)
  }
}

export { DeprecatedMarkerComponent }
