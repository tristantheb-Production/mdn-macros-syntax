import * as vscode from 'vscode'
import { registerReplaceMacroName } from './replaceMacroName'
import { registerUpdateContentHash } from './updateContentHash'
import { activateAllCodeLens } from '../components/CodeLens'

/**
 * Register all hooks (commands / activation helpers) used by the extension.
 */
const registerHooks = (context: vscode.ExtensionContext): void => {
  registerReplaceMacroName(context)
  registerUpdateContentHash(context)
  try {
    activateAllCodeLens(context)
  } catch (err) {
    console.error('mdn-macros: failed to activate code lens component', err)
  }
}

export { registerHooks }
