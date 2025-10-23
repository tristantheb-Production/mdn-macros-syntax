import * as vscode from 'vscode'
import ActivationManager from './ActivationManager'

let diagnosticCollection: vscode.DiagnosticCollection | undefined

const activate = async (context: vscode.ExtensionContext): Promise<void> => {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('mdn-macros')
  context.subscriptions.push(diagnosticCollection)

  const manager = new ActivationManager(context, diagnosticCollection)
  manager.setupWatcher()
  await manager.detectAndInit()
}

const deactivate = (): void => {
  diagnosticCollection?.dispose()
}

export { activate, deactivate }
