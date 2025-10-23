import * as vscode from 'vscode'
import { CodeLensComponent } from './CodeLensComponent'
import { getLatestShaForRepoPath } from '../../providers/versionProvider'

const FRONTMATTER_HASH_KEY_RE = /^(\s*)l10n:\s*$/i
const SOURCE_COMMIT_RE = /^(\s*)sourceCommit\s*:\s*(?:['"])?([0-9a-fA-F]{7,40})?(?:['"])?\s*$/

const isEnUsPath = (p: string): boolean => p.split(/[\/\\]/).some(seg => seg.toLowerCase() === 'en-us')

const mapToEnUsPath = (fsPath: string): string | undefined => {
  const parts = fsPath.split(/[\/\\]/)
  const idx = parts.findIndex(p => p.toLowerCase() === 'files')
  if (idx === -1 || idx + 1 >= parts.length) return undefined
  const newParts = parts.slice()
  newParts[idx + 1] = 'en-us'
  return newParts.slice(idx).join('/')
}

export class CodeLensProvider implements vscode.CodeLensProvider {
  private onDidChangeEmitter = new vscode.EventEmitter<void>()
  public readonly onDidChangeCodeLenses = this.onDidChangeEmitter.event

  public refresh() { this.onDidChangeEmitter.fire() }

  public async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    const fsPath = document.uri.fsPath
    if (isEnUsPath(fsPath)) return []

    const repoPath = mapToEnUsPath(fsPath)
    if (!repoPath) return []

    const sha = await getLatestShaForRepoPath(repoPath)
    if (!sha) return []

    const frontRange = findFrontmatterRange(document)
    const existing = frontRange ? findL10nSourceCommit(document, frontRange) : null

    if (existing) {
      const existingValue = existing.value ?? ''
      // If the file already has the same commit (full or short), don't offer replacement
      if (existingValue === sha || existingValue === sha.substring(0, 7)) return []

      const cl = new CodeLensComponent(existing.range, existing.range)
      cl.setCommand(
        `Replace sourceCommit → ${sha.substring(0, 7)}`,
        'mdn-macros.updateContentHash',
        [document.uri.toString(), document.offsetAt(existing.range.start), document.offsetAt(existing.range.end), sha, 'l10n.sourceCommit']
      )
      return [cl]
    }

    const insertPos = frontRange ? document.offsetAt(frontRange.end) : 0
    const posRange = new vscode.Range(document.positionAt(insertPos), document.positionAt(insertPos))
    const clAdd = new CodeLensComponent(posRange, posRange)
    clAdd.setCommand(`Add l10n.sourceCommit → ${sha.substring(0, 7)}`, 'mdn-macros.updateContentHash', [document.uri.toString(), insertPos, insertPos, sha, 'l10n.sourceCommit'])
    return [clAdd]
  }

}

const findFrontmatterRange = (document: vscode.TextDocument): { start: vscode.Position; end: vscode.Position } | null => {
  if (document.lineCount === 0) return null
  if (document.lineAt(0).text.trim() !== '---') return null
  for (let i = 1; i < Math.min(200, document.lineCount); i++) {
    if (document.lineAt(i).text.trim() === '---') return { start: new vscode.Position(0, 0), end: new vscode.Position(i, 0) }
  }
  return null
}

const findL10nSourceCommit = (document: vscode.TextDocument, frontRange: { start: vscode.Position; end: vscode.Position }) => {
  let inL10n = false
  for (let i = frontRange.start.line + 1; i < frontRange.end.line; i++) {
    const text = document.lineAt(i).text
    if (!inL10n) {
      if (FRONTMATTER_HASH_KEY_RE.test(text)) { inL10n = true; continue }
    } else {
      const m = SOURCE_COMMIT_RE.exec(text)
      if (m) return { range: document.lineAt(i).range, value: m[2] }
      if (/^\S/.test(text)) break
    }
  }
  return null
}
