import * as vscode from 'vscode';

/**
 * Register the `mdn-macros.replaceMacroName` command.
 * The command expects a payload: [uriString, startOffset, endOffset, replacementName]
 */
export function registerReplaceMacroName(context: vscode.ExtensionContext) {
  type Payload = [string, number, number, string];
  context.subscriptions.push(vscode.commands.registerCommand('mdn-macros.replaceMacroName', async (...args: unknown[]) => {
    const payload = (Array.isArray(args[0]) ? args[0] : args) as unknown as Payload | undefined;
    if (!payload || !payload[0]) return;
    try {
      const [uriString, startOffset, endOffset, replacement] = payload;
      const uri = vscode.Uri.parse(uriString);
      const doc = await vscode.workspace.openTextDocument(uri);
      const edit = new vscode.WorkspaceEdit();
      const range = new vscode.Range(doc.positionAt(startOffset), doc.positionAt(endOffset));
      edit.replace(uri, range, replacement);
      await vscode.workspace.applyEdit(edit);
      await vscode.window.showTextDocument(uri);
    } catch (err) {
      console.error('mdn-macros.replaceMacroName failed', err instanceof Error ? err.message : String(err));
    }
  }));
}
