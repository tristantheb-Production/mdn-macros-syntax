import { window, workspace, type ExtensionContext, type TextEditor } from 'vscode'
import { codeBlockDecorator } from './CodeBlockDecorations'
import { frontMatterDecorator } from './FrontMatterDecorations'

// List of all block decorators (add more as needed)
const BLOCK_DECORATORS = [
  codeBlockDecorator,
  frontMatterDecorator
]

function activateAllDecorations(context: ExtensionContext) {
  // Build all decorations for this session/theme
  const decoratorInstances = BLOCK_DECORATORS.map(decorator => ({
    id: decorator.id,
    decorations: decorator.getDecorations(context),
    findRanges: decorator.findRanges
  }))

  function updateAllDecorations(editor: TextEditor | undefined) {
    if (!editor) return
    const doc = editor.document
    if (doc.languageId !== 'markdown' && doc.languageId !== 'mdn-macros') return

    for (const decorator of decoratorInstances) {
      const ranges = decorator.findRanges(doc)
      const decorations = decorator.decorations
      for (const k of Object.keys(decorations)) {
        editor.setDecorations(decorations[k], ranges[k] || [])
      }
    }
  }

  // Listeners to update decorations
  context.subscriptions.push(window.onDidChangeActiveTextEditor((e) => updateAllDecorations(e)))
  context.subscriptions.push(workspace.onDidChangeTextDocument((e) => {
    if (window.activeTextEditor && e.document === window.activeTextEditor.document) {
      updateAllDecorations(window.activeTextEditor)
    }
  }))

  // Rebuild decorations when theme changes
  context.subscriptions.push(window.onDidChangeActiveColorTheme(() => {
    activateAllDecorations(context)
  }))

  // Initial run
  updateAllDecorations(window.activeTextEditor)
}

export { activateAllDecorations }
