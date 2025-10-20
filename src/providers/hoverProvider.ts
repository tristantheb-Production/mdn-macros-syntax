import * as vscode from 'vscode'
import { parseMacroAtOffset } from '../utils/parse'
import { getKnownMacros } from '../macros'

export const hoverProvider: vscode.HoverProvider = {
  provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const offset = document.offsetAt(position)
    const found = parseMacroAtOffset(document.getText(), offset)
    if (!found) return
    const locale = (vscode.env.language || 'en')
    const KNOWN_MACROS = getKnownMacros(locale)
    const info = KNOWN_MACROS[found.name]
    if (!info) {
      return new vscode.Hover(new vscode.MarkdownString(`Unknown macro **${found.name}**`))
    }

    // Build hover content for known macro
    const params = info.params ? `(${info.params.map(p => p.name).join(', ')})` : ''
    const paramLines: string[] = []

    // If the current locale didn't provide full descriptions, pull English defaults once
    let enInfo: typeof info | undefined = undefined
    if (!info.description || (info.params && info.params.some(p => !p.description))) {
      try {
        const enKnown = getKnownMacros('en')
        enInfo = enKnown[found.name]
      } catch {
        enInfo = undefined
      }
    }

    if (info.params) {
      for (let i = 0; i < info.params.length; i++) {
        const p = info.params[i]
        const allowed = p.allowedValues ? ` Allowed values: ${p.allowedValues.join(', ')}` : ''
        // prefer localized description, then English by name, then English by position
        const descFromInfo: string = p.description || ''
        const descFromEnByName: string | undefined = enInfo && enInfo.params ? (enInfo.params.find(ep => ep.name === p.name)?.description) : undefined
        const descFromEnByPos: string | undefined = enInfo && enInfo.params && enInfo.params[i] ? enInfo.params[i].description : undefined
        const descText = descFromInfo || descFromEnByName || descFromEnByPos || ''
        const typeText = p.type || ''
        const optionalText = p.optional ? ' (optional)' : ''
        paramLines.push(`${p.name}${optionalText}: ${typeText} — ${descText}${allowed}`)
      }
    }

    const args = found.args.length ? `\n\nArguments: ${found.args.join(', ')}` : ''

    // Build markdown text preserving existing pieces; description falls back to English if needed
    const descriptionText = info.description || (enInfo && enInfo.description) || ''

    // Build markdown with bullet list for parameter descriptions so line breaks show reliably
    let mdText = `**${found.name}** ${params}\n\n${descriptionText}${args}`
    if (paramLines.length) {
      const bullets = paramLines.map(l => `- ${l}`).join('\n')
      mdText += `\n\nParameter descriptions:\n\n${bullets}`
    }

    // Append deprecation note separated so it does not interfere with description/params
    const deprecation = info.deprecated
    if (deprecation) {
      const deprecationText = typeof deprecation === 'string' ? deprecation : 'This macro is deprecated and should be removed from documentation.'
      mdText += `\n\n---\n\n**DEPRECATED:** ${deprecationText}`
    }

    const md = new vscode.MarkdownString(mdText)
    md.isTrusted = true
    return new vscode.Hover(md)
  }
}
