import * as vscode from 'vscode'

const parsePayload = (args: unknown[]): [vscode.Uri, number, number, string, string] | null => {
  const payload = Array.isArray(args[0]) ? args[0] as unknown[] : args
  if (!payload || payload.length < 5) return null
  const [uriString, startOffset, endOffset, sha, keyName] = payload as [string, number, number, string, string]
  try { return [vscode.Uri.parse(uriString), startOffset, endOffset, sha, keyName] } catch { return null }
}

const openDoc = async (uri: vscode.Uri) => vscode.workspace.openTextDocument(uri)

const replaceLine = (
  edit: vscode.WorkspaceEdit,
  uri: vscode.Uri,
  doc: vscode.TextDocument,
  startOffset: number,
  key: string,
  fullSha?: string
) => {
  const startPos = doc.positionAt(startOffset)
  const line = doc.lineAt(startPos.line)
  const indentMatch = line.text.match(/^(\s*)/)
  const indent = indentMatch ? indentMatch[1] : ''
  const replacement = `${indent}${key}: ${fullSha}\n`
  edit.replace(uri, line.rangeIncludingLineBreak, replacement)
}

const insertUnderL10n = (
  edit: vscode.WorkspaceEdit,
  uri: vscode.Uri,
  doc: vscode.TextDocument,
  fmStart: number,
  fmEnd: number,
  key: string,
  fullSha?: string
) => {
  const fmStartLine = doc.positionAt(fmStart).line
  const fmEndLine = doc.positionAt(fmEnd).line
  let l10nLine = -1
  for (let i = fmStartLine + 1; i < fmEndLine; i++) {
    if (doc.lineAt(i).text.trim().toLowerCase() === 'l10n:') {
      l10nLine = i
      break
    }
  }
  const newLine = `  ${key}: ${fullSha}\n`
  if (l10nLine !== -1) {
    const indentMatch = doc.lineAt(l10nLine).text.match(/^(\s*)/)
    const indent = indentMatch ? indentMatch[1] + '  ' : '  '
    const keyLine = `${indent}${key}: ${fullSha}\n`
    const insertPos = doc.positionAt(doc.offsetAt(new vscode.Position(l10nLine + 1, 0)))
    edit.insert(uri, insertPos, keyLine)
  } else {
    const block = `l10n:\n${newLine}`
    const insertPos = doc.positionAt(fmEnd)
    edit.insert(uri, insertPos, block)
  }
}

const createFrontmatter = (edit: vscode.WorkspaceEdit, uri: vscode.Uri, key: string, fullSha?: string) => {
  const newLine = `  ${key}: ${fullSha}\n`
  const header = `---\nl10n:\n${newLine}---\n`
  edit.insert(uri, new vscode.Position(0, 0), header)
}

export function registerUpdateContentHash(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('mdn-macros.updateContentHash', async (...args: unknown[]) => {
      const parsed = parsePayload(args)
      if (!parsed) return
      try {
        const [uri, startOffset, endOffset, sha, keyName] = parsed
        const doc = await openDoc(uri)
        const edit = new vscode.WorkspaceEdit()
        const fullSha = sha
        const targetKey = keyName || 'l10n.sourceCommit'
        const parts = targetKey.split('.')
        const key = parts[parts.length - 1]

        if (endOffset > startOffset) {
          replaceLine(edit, uri, doc, startOffset, key, fullSha)
        } else {
          const full = doc.getText()
          const fmStart = full.indexOf('---')
          if (fmStart === 0) {
            const fmEnd = full.indexOf('---', fmStart + 3)
            if (fmEnd > fmStart) insertUnderL10n(edit, uri, doc, fmStart, fmEnd, key, fullSha)
            else {
              createFrontmatter(edit, uri, key, fullSha)
              await vscode.workspace.applyEdit(edit)
              await vscode.window.showTextDocument(uri)
              return
            }
          } else {
            createFrontmatter(edit, uri, key, fullSha)
            await vscode.workspace.applyEdit(edit)
            await vscode.window.showTextDocument(uri)
            return
          }
        }

        await vscode.workspace.applyEdit(edit)
        await vscode.window.showTextDocument(uri)
      } catch (err) {
        console.error('mdn-macros.updateContentHash failed', err instanceof Error ? err.message : String(err))
      }
    })
  )
}
