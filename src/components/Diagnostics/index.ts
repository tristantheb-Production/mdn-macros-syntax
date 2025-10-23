import * as vscode from 'vscode'
import { MacroDiagnosticComponent } from './MacroDiagnosticComponent'

const DIAGNOSTIC_COMPONENTS = [
  new MacroDiagnosticComponent()
]

function activateAllDiagnostics(context: vscode.ExtensionContext, collection: vscode.DiagnosticCollection) {
  for (const c of DIAGNOSTIC_COMPONENTS) {
    try {
      c.activate(context, collection)
    } catch (err) {
      // don't break activation for other components
      console.error('activateAllDiagnostics: component activation failed', err)
    }
  }
}

export { activateAllDiagnostics }
