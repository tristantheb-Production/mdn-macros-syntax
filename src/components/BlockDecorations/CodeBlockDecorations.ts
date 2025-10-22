import * as vscode from 'vscode'
import { join as pathJoin } from 'path'

// Keywords mapping to icon filenames and background colors
const KEYWORD_CONFIG: { [key: string]: { icon: string; color: string } } = {
  'example-good': { icon: 'check.svg', color: 'rgba(76 175 80 / 12%)' },
  'example-bad': { icon: 'x.svg', color: 'rgba(244 67 54 / 12%)' },
  'interactive-example': { icon: 'console.svg', color: 'rgba(33 150 243 / 12%)' }
}

/**
 * Build decoration types for code blocks, using the current color theme.
 * Returns an object with background and icon decorations for each keyword.
 */
function getCodeBlockDecorations(context: vscode.ExtensionContext) {
  const decorationsBg: { [k: string]: vscode.TextEditorDecorationType } = {}
  const decorationsIcon: { [k: string]: vscode.TextEditorDecorationType } = {}

  const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
    || vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast

  for (const k of Object.keys(KEYWORD_CONFIG)) {
    const cfg = KEYWORD_CONFIG[k]
    const lightPath = vscode.Uri.file(pathJoin(context.extensionPath, 'resources', 'light', cfg.icon))
    const darkPath = vscode.Uri.file(pathJoin(context.extensionPath, 'resources', 'dark', cfg.icon))
    const chosen: vscode.Uri = isDark ? darkPath : lightPath

    // Background decoration (whole block)
    decorationsBg[k] = vscode.window.createTextEditorDecorationType({
      backgroundColor: cfg.color,
      isWholeLine: true
    })

    // Icon decoration for the opening fence line only (gutter icon)
    decorationsIcon[k] = vscode.window.createTextEditorDecorationType({
      gutterIconPath: chosen,
      gutterIconSize: '16px'
    })
  }

  return { decorationsBg, decorationsIcon }
}

/**
 * Detects the ranges to decorate for each keyword in a given document.
 * Returns { [keyword]: { bg: vscode.Range[], icon: vscode.Range[] } }
 */
function findCodeBlockRanges(doc: vscode.TextDocument): { [k: string]: { bg: vscode.Range[], icon: vscode.Range[] } } {
  const result: { [k: string]: { bg: vscode.Range[], icon: vscode.Range[] } } = {}
  for (const k of Object.keys(KEYWORD_CONFIG)) {
    result[k] = { bg: [], icon: [] }
  }
  const lineCount = doc.lineCount
  let line = 0
  while (line < lineCount) {
    const textLine = doc.lineAt(line).text
    if (textLine.trim().startsWith('```')) {
      const infoString = textLine.trim().substring(3).trim()
      // Find the end of the code block
      let endLine = line + 1
      while (endLine < lineCount && !doc.lineAt(endLine).text.trim().startsWith('```')) {
        endLine++
      }
      if (endLine < lineCount) {
        const blockRange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(endLine, doc.lineAt(endLine).text.length))
        const iconRange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, 0))
        const parts = infoString.split(/\s+/).map(p => p.trim()).filter(Boolean)
        for (const part of parts) {
          const key = part.toLowerCase()
          if (result[key]) {
            result[key].bg.push(blockRange)
            result[key].icon.push(iconRange)
            break
          }
        }
      }
      line = endLine + 1
    } else {
      line++
    }
  }
  return result
}

export { findCodeBlockRanges, getCodeBlockDecorations }
