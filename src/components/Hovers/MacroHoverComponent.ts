import * as vscode from 'vscode'
import { getKnownMacros } from '../../macros'
import { parseMacroAtOffset } from '../../utils/parse'
import type { MacroDefinition } from '../../types/macro'

export class MacroHoverComponent {
  getHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
    const offset = document.offsetAt(position)
    const found = parseMacroAtOffset(document.getText(), offset)
    if (!found) return undefined
    const locale = (vscode.env.language || 'en')
    const KNOWN_MACROS = getKnownMacros(locale)
    const info: MacroDefinition | undefined = KNOWN_MACROS[found.name]
    if (!info) return undefined
    const mdText = this.buildMarkdown(found, info)
    const md = new vscode.MarkdownString(mdText)
    md.isTrusted = true
    return new vscode.Hover(md)
  }

  private buildMarkdown(found: { name: string; args: string[] }, info: MacroDefinition): string {
    let enInfo: MacroDefinition | undefined = undefined
    if (!info.description || (info.params && info.params.some((p) => !p.description))) {
      try {
        const enKnown = getKnownMacros('en')
        enInfo = enKnown[found.name]
      } catch {
        enInfo = undefined
      }
    }
    const params = info.params ? `(${info.params.map((p) => p.name).join(', ')})` : ''
    const paramLines: string[] = []
    if (info.params) {
      for (let i = 0; i < info.params.length; i++) {
        const p = info.params[i]
        const allowed = p.allowedValues ? ` Allowed values: ${p.allowedValues.join(', ')}` : ''
        const descFromInfo: string = p.description || ''
        const descFromEnByName: string | undefined = enInfo && enInfo.params ? (enInfo.params.find((ep) => ep.name === p.name)?.description) : undefined
        const descFromEnByPos: string | undefined = enInfo && enInfo.params && enInfo.params[i] ? enInfo.params[i].description : undefined
        const descText = descFromInfo || descFromEnByName || descFromEnByPos || ''
        const typeText = p.type || ''
        const optionalText = p.optional ? ' (optional)' : ''
        paramLines.push(`${p.name}${optionalText}: ${typeText} — ${descText}${allowed}`)
      }
    }
    const args = found.args.length ? `\n\nArguments: ${found.args.join(', ')}` : ''
    const descriptionText = info.description || (enInfo && enInfo.description) || ''
    let mdText = `**${found.name}** ${params}\n\n${descriptionText}${args}`
    if (paramLines.length) {
      const bullets = paramLines.map(l => `- ${l}`).join('\n')
      mdText += `\n\nParameter descriptions:\n\n${bullets}`
    }
    const deprecation = info.deprecated
    if (deprecation) {
      const deprecationText = typeof deprecation === 'string' ? deprecation : 'This macro is deprecated and should be removed from documentation.'
      mdText += `\n\n---\n\n**DEPRECATED:** ${deprecationText}`
    }
    return mdText
  }
}
