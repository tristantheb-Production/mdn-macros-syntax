import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

type MDNRepoDetails = {
  folder: string
  filesExists: boolean
  hasLocaleFolder: boolean
  gitExists: boolean
}

const LANG_REGEX = /^[a-z]{2}(?:-[a-z]{2})?$/i

const pathIsDirectory = async (p: string): Promise<boolean> => {
  const stat = await fs.promises.stat(p)
  return stat.isDirectory() || false
}

const checkHasLocaleFolder = async (filesPath: string): Promise<boolean> => {
  const entries = await fs.promises.readdir(filesPath, { withFileTypes: true })
  for (const e of entries) {
    if (!e.isDirectory()) continue
    if (LANG_REGEX.test(e.name)) return true
  }
  return false
}

/**
 * Detect whether the current workspace looks like an MDN repository.
 */
const isMdnRepo = async (): Promise<boolean> => {
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

/**
 * Detailed detection results per workspace folder. Useful for debugging why
 * the heuristic did or didn't match.
 */
const detectMdnRepoDetailed = async (): Promise<Array<MDNRepoDetails>> => {
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

export { isMdnRepo, detectMdnRepoDetailed }
