export const MACRO_REGEX_SOURCE = '\\{\\{\\s*([A-Za-z0-9_\\-]+)(?:\\s*\\(([^}]*)\\))?\\s*\\}\\}';

/**
 * Create a fresh RegExp instance for matching MDN macros.
 * Using a factory avoids shared-state issues with global RegExp objects (lastIndex).
 */
export function makeMacroRegex(): RegExp {
  return new RegExp(MACRO_REGEX_SOURCE, 'g');
}
