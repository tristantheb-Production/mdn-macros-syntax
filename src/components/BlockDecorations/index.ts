import { window, workspace, type ExtensionContext, type TextEditor, TextEditorDecorationType } from 'vscode'
import { CodeBlockDecorations } from './CodeBlockDecorations'
import { FrontMatterDecorations } from './FrontMatterDecorations'

// List of all block decorators (add more as needed)
const BLOCK_DECORATORS = [
  new CodeBlockDecorations(),
  new FrontMatterDecorations()
]

function activateAllDecorations(context: ExtensionContext) {
  let decoratorInstances = BLOCK_DECORATORS.map(
    decorator => ({
      decorations: decorator.getDecorations(context),
      findRanges: decorator.findRanges
    })
  )

  // To dispose old decorations on theme change
  let allDecorationTypes: TextEditorDecorationType[] = []

  function disposeAllDecorations() {
    for (const deco of allDecorationTypes) deco.dispose()
    allDecorationTypes = []
  }

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
    disposeAllDecorations()
    decoratorInstances = BLOCK_DECORATORS.map(decorator => ({
      instance: decorator,
      decorations: decorator.getDecorations(context),
      findRanges: decorator.findRanges
    }))
    // Collect all decoration types for disposal next time
    allDecorationTypes = decoratorInstances.flatMap(d => Object.values(d.decorations))
    updateAllDecorations(window.activeTextEditor)
  }))

  // Collect all decoration types for disposal
  allDecorationTypes = decoratorInstances.flatMap(d => Object.values(d.decorations))

  // Initial run
  updateAllDecorations(window.activeTextEditor)
}

export { activateAllDecorations }
