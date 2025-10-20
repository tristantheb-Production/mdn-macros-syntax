import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { getKnownMacros } from '../macros'

describe('getKnownMacros', () => {
  it('returns english description when locale missing', () => {
    const macros = getKnownMacros('zz')
    expect(macros['Glossary']).to.not.be.undefined
    expect(macros['Glossary'].description).to.equal('Create a glossary reference for a term.')
    const localesPath = path.resolve(process.cwd(), 'src', 'locales', 'macros.nls.json')
    const raw = fs.readFileSync(localesPath, 'utf8')
    type LocaleEntry = { params?: Record<string, string> }
    const locales = JSON.parse(raw) as Record<string, LocaleEntry>
    const expected = locales['HTMLElement']?.params?.['element']
    expect(expected).to.be.a('string')
    expect(macros['HTMLElement'].params![0].description).to.equal(expected)
  })
})
