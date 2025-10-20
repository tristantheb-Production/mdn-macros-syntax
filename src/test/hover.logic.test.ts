import { expect } from 'chai'
import { parseMacroAtOffset } from '../utils/parse'
import { getKnownMacros } from '../macros'

describe('Hover logic (parser + loader)', () => {
  it('finds a macro and its localized description', () => {
    const text = 'Some text before {{HTMLElement("summary", "Label")}} some after'
    const startIndex = text.indexOf('{{HTMLElement')
    expect(startIndex).to.be.at.least(0)
    // choose an offset inside the macro name
    const offset = startIndex + 3
    const found = parseMacroAtOffset(text, offset)
    expect(found).to.exist
    expect(found!.name).to.equal('HTMLElement')

    const km = getKnownMacros('en')
    expect(km).to.have.property('HTMLElement')
    const info = km['HTMLElement']
    expect(info.description).to.be.a('string').and.to.contain('Insert or reference an HTML element')

    // Build param descriptions similar to hoverProvider to ensure they resolve
    const localizedParamValues: string[] = []
    const params = info.params || []
    const paramLines: string[] = []
    params.forEach((p, i) => {
      const allowed = p.allowedValues ? ` Allowed values: ${p.allowedValues.join(', ')}` : ''
      const explicit = p.description
      const positional = localizedParamValues[i]
      const descText = explicit || positional || ''
      const typeText = p.type || ''
      const optionalText = p.optional ? ' (optional)' : ''
      paramLines.push(`${p.name}${optionalText}: ${typeText} — ${descText}${allowed}`)
    })

    expect(paramLines.length).to.be.greaterThan(0)
    const tagLine = paramLines.find(l => l.startsWith('element'))
    expect(tagLine).to.exist
    expect(tagLine).to.contain('The HTML element name')
  })
})
