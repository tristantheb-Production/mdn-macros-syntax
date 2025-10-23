import * as vscode from 'vscode'
import ActivationManager from './ActivationManager'

let diagnosticCollection: vscode.DiagnosticCollection | undefined

export async function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('mdn-macros')
  context.subscriptions.push(diagnosticCollection)

  const manager = new ActivationManager(context, diagnosticCollection)
  manager.setupWatcher()
  await manager.detectAndInit()
}

export function deactivate() {
  diagnosticCollection?.dispose()
}
