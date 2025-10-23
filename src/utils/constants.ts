const MACRO_REGEX_SOURCE = '\\{\\{\\s*([A-Za-z0-9_\\-]+)(?:\\s*\\(([^}]*)\\))?\\s*\\}\\}'

const DOCUMENT_SELECTOR = ['mdn-macros', 'markdown']

/**
 * Create a fresh RegExp instance for matching MDN macros.
 */
const makeMacroRegex = (): RegExp => {
  return new RegExp(MACRO_REGEX_SOURCE, 'g')
}

export { DOCUMENT_SELECTOR, MACRO_REGEX_SOURCE, makeMacroRegex }
