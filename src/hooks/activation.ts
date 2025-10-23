import * as vscode from 'vscode'
import { registerReplaceMacroName } from './replaceMacroName'

/**
 * Register all hooks (commands / activation helpers) used by the extension.
 */
const registerHooks = (context: vscode.ExtensionContext): void => {
  registerReplaceMacroName(context)
}

export { registerHooks }
