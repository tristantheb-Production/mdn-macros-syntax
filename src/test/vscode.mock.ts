export const env = { language: 'en' }

export type Disposable = { dispose(): void }

export const window = {
  createOutputChannel(name: string) {
    void name
    const lines: string[] = []
    return {
      appendLine(line: string) { lines.push(line) },
      show() { /* noop */ },
      dispose() { /* noop */ }
    } as unknown as { appendLine(line: string): void; show(): void; dispose(): void }
  },
  showTextDocument: async (doc: unknown) => {
    void doc
    return ({ /* stub editor */ } as unknown)
  }
}

export const workspace = {
  workspaceFolders: [],
  getConfiguration(section?: unknown) {
    void section
    return { get: (k: string) => { void k; return undefined } }
  },
  openTextDocument: async (uri: unknown) => {
    void uri
    return {
      uri,
      getText: () => '',
      lineCount: 0,
      positionAt: (offset: number) => { void offset; return { line: 0, character: 0 } },
      lineAt: (line: number) => { void line; return { text: '' } }
    }
  },
  applyEdit: async () => true,
  fs: {}
}

export const languages = {
  registerHoverProvider: () => ({ dispose() {} } as Disposable),
  registerCompletionItemProvider: () => ({ dispose() {} } as Disposable),
  registerCodeActionsProvider: () => ({ dispose() {} } as Disposable),
  registerDocumentSemanticTokensProvider: () => ({ dispose() {} } as Disposable),
  registerCodeLensProvider: () => ({ dispose() {} } as Disposable)
}

export class Range {
  constructor(public start: unknown, public end: unknown) { void start; void end }
}

export class Position {
  constructor(public line: number, public character: number) {}
}

export class MarkdownString {
  value: string
  isTrusted = false
  constructor(v = '') { this.value = v }
  appendMarkdown(s: string) { void s; return this }
}

export class Diagnostic { constructor() {} }
export class DiagnosticRelatedInformation { constructor() {} }
export class DiagnosticCollection { set() {}; delete() {}; dispose() {} }

export const Uri = { parse: (s: string) => ({ toString: () => s, fsPath: s }) }

export const commands = { registerCommand: () => ({ dispose() {} } as Disposable) }

export const windowShowErrorMessage = (s: string) => { void s; return Promise.resolve(undefined) }
