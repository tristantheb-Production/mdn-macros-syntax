import { expect } from 'chai';
import { getKnownMacros } from '../macros';

describe('Localization loader', () => {
  it('loads English descriptions for HTMLElement macro', () => {
    const km = getKnownMacros('en');
    expect(km).to.have.property('HTMLElement');
    const info = km['HTMLElement'];
    expect(info).to.be.ok;
    // description should come from src/locales/macros.nls.json
    expect(info.description).to.be.a('string').and.to.contain('Insert or reference an HTML element');

    expect(info.params).to.be.an('array');
    const tagParam = info.params!.find(p => ['element'].includes(p.name));
    expect(tagParam).to.exist;
    expect(tagParam!.description).to.be.a('string').and.to.contain('The HTML element name');
  });
});
