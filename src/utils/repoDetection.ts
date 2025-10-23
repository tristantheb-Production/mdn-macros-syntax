import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

// Heuristic to detect MDN-style repos: top-level `files/<locale>` structure.
const LOCALE_REGEX = /^[a-z]{2}(?:-[a-z]{2})?$/i

async function pathIsDirectory(p: string): Promise<boolean> {
  try {
    const stat = await fs.promises.stat(p)
    return stat.isDirectory()
  } catch {
    return false
  }
}

async function checkHasLocaleFolder(filesPath: string): Promise<boolean> {
  try {
    const entries = await fs.promises.readdir(filesPath, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isDirectory()) continue
      if (LOCALE_REGEX.test(e.name)) return true
    }
  } catch {
    // ignore errors
  }
  return false
}

/**
 * Detect whether the current workspace looks like an MDN repository.
 */
export async function isMdnRepo(): Promise<boolean> {
  try {
    const matches = await vscode.workspace.findFiles('**/files/*/**/index.md', '**/node_modules/**', 1)
    if (matches && matches.length > 0) return true
  } catch {
    // ignore findFiles errors and fallback to lighter FS checks
  }

  const folders = vscode.workspace.workspaceFolders
  if (!folders || folders.length === 0) return false

  for (const f of folders) {
    const root = f.uri.fsPath
    if (await pathIsDirectory(path.join(root, 'files'))) return true
    if (await pathIsDirectory(path.join(root, '.git'))) return true
  }

  return false
}

export default isMdnRepo

/**
 * Detailed detection results per workspace folder. Useful for debugging why
 * the heuristic did or didn't match.
 */
export async function detectMdnRepoDetailed(): Promise<Array<{
  folder: string
  filesExists: boolean
  hasLocaleFolder: boolean
  gitExists: boolean
}>> {
  const folders = vscode.workspace.workspaceFolders || []
  const results: Array<{ folder: string; filesExists: boolean; hasLocaleFolder: boolean; gitExists: boolean }> = []

  for (const f of folders) {
    const root = f.uri.fsPath
    const filesPath = path.join(root, 'files')
    const filesExists = await pathIsDirectory(filesPath)
    const hasLocale = filesExists ? await checkHasLocaleFolder(filesPath) : false
    const gitExists = await pathIsDirectory(path.join(root, '.git'))
    results.push({ folder: root, filesExists, hasLocaleFolder: hasLocale, gitExists })
  }

  return results
}
