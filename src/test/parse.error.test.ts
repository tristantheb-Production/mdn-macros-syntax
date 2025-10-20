import { expect } from 'chai'
import { parseMacroAtOffset, splitArgsPreserveEmpty } from '../utils/parse'

describe('parse error cases and edge behaviors', () => {
  it('returns undefined when macro is not closed (missing ) or }})', () => {
    const text = '{{BrokenMacro("a","b"' // missing closing )}}
    const found = parseMacroAtOffset(text, text.indexOf('{{'))
    expect(found).to.be.undefined
  })

  it('preserves commas inside quoted arguments', () => {
    const text = '{{Macro("a,b", "c")}}'
    const found = parseMacroAtOffset(text, text.indexOf('{{'))
    expect(found).to.not.be.undefined
    expect(found!.args).to.deep.equal(['a,b', 'c'])
  })

  it('keeps leading quote when the closing quote is missing (unmatched quote)', () => {
    // opening quote present, no closing quote, but parenthesis/brace closed
    const text = '{{Macro("a,b)}}'
    const found = parseMacroAtOffset(text, text.indexOf('{{'))
    expect(found).to.not.be.undefined
    // the splitter will not strip the unmatched starting quote
    expect(found!.args.length).to.equal(1)
    expect(found!.args[0].startsWith('"') || found!.args[0].startsWith('\'')).to.be.true
  })

  it('offset outside macro returns undefined', () => {
    const text = 'prefix {{Macro("one")}} suffix'
    const off = text.indexOf('suffix')
    const found = parseMacroAtOffset(text, off)
    expect(found).to.be.undefined
  })

  it('splitArgsPreserveEmpty handles empty slots and trims correctly', () => {
    const raw = ' "a" , , "c" '
    const parts = splitArgsPreserveEmpty(raw)
    expect(parts).to.deep.equal(['a', '', 'c'])
  })
})
