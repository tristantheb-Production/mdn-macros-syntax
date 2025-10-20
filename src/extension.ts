import * as vscode from 'vscode'
import { hoverProvider } from './providers/hoverProvider'
import { completionProvider } from './providers/completionProvider'
import { computeDiagnostics } from './providers/diagnosticProvider'
import { codeActionProvider } from './providers/codeActionProvider'
import { provider as semanticProvider, legend as semanticLegend } from './providers/semanticTokensProvider'
import { activateBlockDecorations } from './providers/blockDecorations'
import { activateDeprecatedMarker } from './providers/deprecatedMarker'
import { registerHooks } from './hooks/activation'

let diagnosticCollection: vscode.DiagnosticCollection | undefined

export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('mdn-macros')
  context.subscriptions.push(diagnosticCollection)

  context.subscriptions.push(vscode.languages.registerHoverProvider(['mdn-macros', 'markdown'], hoverProvider))
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(['mdn-macros', 'markdown'], completionProvider, '{'))
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider(['mdn-macros', 'markdown'], codeActionProvider, { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }))

  context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'markdown' }, semanticProvider, semanticLegend))

  // Activate block decorations (icons + background for fenced code blocks)
  activateBlockDecorations(context)
  // Activate deprecated markers
  activateDeprecatedMarker(context)

  function refreshDiagnostics(document: vscode.TextDocument) {
    const diags = computeDiagnostics(document)
    diagnosticCollection?.set(document.uri, diags)
  }

  // Subscribe to workspace events so diagnostics are refreshed automatically.
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(refreshDiagnostics))
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document)))

  // Refresh diagnostics for already-open documents on activation.
  if (vscode.workspace.textDocuments) {
    vscode.workspace.textDocuments.forEach(refreshDiagnostics)
  }

  // Register hooks (commands and activation helpers)
  registerHooks(context)
}

export function deactivate() {
  diagnosticCollection?.dispose()
}
