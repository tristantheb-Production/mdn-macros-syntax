import { window, workspace, type ExtensionContext, type TextEditor } from 'vscode'
import { getCodeBlockDecorations, findCodeBlockRanges } from './CodeBlockDecorations'

// Centralized activation for all block decorations
function activateAllDecorations(context: ExtensionContext) {
  // Build all decorations for this session/theme
  const { decorationsBg, decorationsIcon } = getCodeBlockDecorations(context)

  function updateAllDecorations(editor: TextEditor | undefined) {
    if (!editor) return
    const doc = editor.document
    if (doc.languageId !== 'markdown' && doc.languageId !== 'mdn-macros') return

    // Utiliser la logique métier du décorateur
    const ranges = findCodeBlockRanges(doc)
    for (const k of Object.keys(decorationsBg)) {
      editor.setDecorations(decorationsBg[k], ranges[k]?.bg || [])
      editor.setDecorations(decorationsIcon[k], ranges[k]?.icon || [])
    }
  }

  // Listeners pour mettre à jour les décorations
  context.subscriptions.push(window.onDidChangeActiveTextEditor((e) => updateAllDecorations(e)))
  context.subscriptions.push(workspace.onDidChangeTextDocument((e) => {
    if (window.activeTextEditor && e.document === window.activeTextEditor.document) {
      updateAllDecorations(window.activeTextEditor)
    }
  }))

  // Rebuild decorations when theme changes
  context.subscriptions.push(window.onDidChangeActiveColorTheme(() => {
    // On reconstruit tout (pourrait être optimisé si plusieurs décorateurs)
    activateAllDecorations(context)
  }))

  // Initial run
  updateAllDecorations(window.activeTextEditor)
}

export { activateAllDecorations }
