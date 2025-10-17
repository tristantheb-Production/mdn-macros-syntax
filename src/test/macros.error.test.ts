import { expect } from 'chai';
import { getKnownMacros } from '../macros';

describe('getKnownMacros edge cases', () => {
  it('falls back to english when locale is unknown', () => {
    const macros = getKnownMacros('zz'); // nonexistent locale
    expect(macros['Glossary']).to.not.be.undefined;
    expect(macros['Glossary'].description).to.equal('Create a glossary reference for a term.');
  });

  it('preserves enum allowedValues on definitions (InteractiveExample)', () => {
    const macros = getKnownMacros('en');
    const ie = macros['InteractiveExample'];
    expect(ie).to.not.be.undefined;
    const secondParam = ie.params ? ie.params[1] : undefined;
    expect(secondParam).to.not.be.undefined;
    expect(secondParam!.type).to.equal('enum');
    expect(secondParam!.allowedValues).to.include('shorter');
  });
});
