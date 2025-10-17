import * as vscode from 'vscode';
import { registerReplaceMacroName } from './replaceMacroName';

/**
 * Register all hooks (commands / activation helpers) used by the extension.
 */
export function registerHooks(context: vscode.ExtensionContext) {
  registerReplaceMacroName(context);
}
