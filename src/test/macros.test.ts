import { expect } from 'chai';
import { getKnownMacros } from '../macros';

describe('getKnownMacros', () => {
    it('returns english description when locale missing', () => {
        const macros = getKnownMacros('zz'); // nonexistent locale
        expect(macros['Glossary']).to.not.be.undefined;
        expect(macros['Glossary'].description).to.equal('Create a glossary reference for a term.');
        expect(macros['HTMLElement'].params![0].description).to.equal("The HTML tag name, e.g. 'summary'.");
    });
});
