import * as vscode from 'vscode'
import { Decoration } from './Decoration'

class FrontMatterDecorations extends Decoration {
  getDecorations(): { [k: string]: vscode.TextEditorDecorationType } {
    const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
      || vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast
    const color = isDark ? 'rgb(255 255 255 / 10%)' : 'rgb(0 0 0 / 10%)'
    return {
      'frontmatter-bg': vscode.window.createTextEditorDecorationType({
        backgroundColor: color,
        isWholeLine: true
      })
    }
  }

  findRanges(doc: vscode.TextDocument): { [k: string]: vscode.Range[] } {
    const result: { [k: string]: vscode.Range[] } = { 'frontmatter-bg': [] }
    const lineCount = doc.lineCount
    let line = 0
    while (line < lineCount) {
      const textLine = doc.lineAt(line).text.trim()
      if (textLine === '---') {
        // Find the end of the front matter block
        let endLine = line + 1
        while (endLine < lineCount && doc.lineAt(endLine).text.trim() !== '---') {
          endLine++
        }
        if (endLine < lineCount) {
          // Block includes both --- lines
          const range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(endLine, doc.lineAt(endLine).text.length))
          result['frontmatter-bg'].push(range)
          line = endLine + 1
          continue
        }
      }
      line++
    }
    return result
  }
}

export { FrontMatterDecorations }
