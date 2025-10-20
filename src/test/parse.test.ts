import { expect } from 'chai'
import { parseMacroAtOffset } from '../utils/parse'

describe('parseMacroAtOffset', () => {
  it('parses single arg', () => {
    const text = '{{HTMLElement("summary")}}'
    const found = parseMacroAtOffset(text, text.indexOf('{{'))
    expect(found).to.not.be.undefined
    expect(found!.name).to.equal('HTMLElement')
    expect(found!.args).to.deep.equal(['summary'])
  })

  it('preserves empty slots', () => {
    const text = '{{HTMLElement("summary", "sommaire", , "nocode")}}'
    const found = parseMacroAtOffset(text, text.indexOf('{{'))
    expect(found).to.not.be.undefined
    expect(found!.args).to.deep.equal(['summary', 'sommaire', '', 'nocode'])
  })

  it('handles unquoted empty arg', () => {
    const text = '{{Macro("a", , "c")}}'
    const found = parseMacroAtOffset(text, text.indexOf('{{'))
    expect(found!.args).to.deep.equal(['a', '', 'c'])
  })
})
