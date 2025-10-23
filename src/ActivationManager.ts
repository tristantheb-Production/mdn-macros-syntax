import * as vscode from 'vscode'
import { activateAllDecorations } from './components/BlockDecorations'
import { activateAllHovers } from './components/Hovers'
import { activateAllMarkers } from './components/Markers'
import { registerHooks } from './hooks/activation'
import { codeActionProvider } from './providers/codeActionProvider'
import { completionProvider } from './providers/completionProvider'
import { computeDiagnostics } from './providers/diagnosticProvider'
import { provider as semanticProvider, legend as semanticLegend } from './providers/semanticTokensProvider'
import { DOCUMENT_SELECTOR } from './utils/constants'
import { isMdnRepo } from './utils/repoDetection'

class ActivationManager {
  private context: vscode.ExtensionContext
  private featuresActivated = false
  private output?: vscode.OutputChannel
  private diagnosticCollection?: vscode.DiagnosticCollection

  constructor(context: vscode.ExtensionContext, diagnosticCollection?: vscode.DiagnosticCollection) {
    this.context = context
    this.diagnosticCollection = diagnosticCollection
  }

  /** Ensure we have an OutputChannel and keep a single instance */
  private getOutput(): vscode.OutputChannel {
    if (!this.output) {
      this.output = vscode.window.createOutputChannel('mdn-macros')
      this.context.subscriptions.push(this.output)
    }
    return this.output
  }

  /** Ensure there's a DiagnosticCollection available */
  private ensureDiagnosticCollection(): void {
    if (!this.diagnosticCollection) {
      this.diagnosticCollection = vscode.languages.createDiagnosticCollection('mdn-macros')
      this.context.subscriptions.push(this.diagnosticCollection)
    }
  }

  /** Public entry to enable features (idempotent). Lazy-loads providers. */
  public async initFeatures(): Promise<void> {
    if (this.featuresActivated) return
    this.featuresActivated = true

    this.getOutput().appendLine('mdn-macros: enabling features')

    await this.registerProviders()
    await this.registerComponents()
    this.registerDiagnostics()
    try {
      registerHooks(this.context)
    } catch (err) {
      this.getOutput().appendLine('mdn-macros: failed to register hooks: ' + String(err))
    }
  }

  private async registerProviders(): Promise<void> {
    // lightweight decorators/hovers/markers are already plain imports
    try {
      this.context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(DOCUMENT_SELECTOR, completionProvider, '{')
      )

      this.context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
          DOCUMENT_SELECTOR,
          codeActionProvider,
          { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
        )
      )

      this.context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
          { language: 'markdown' },
          semanticProvider,
          semanticLegend
        )
      )
    } catch (err) {
      this.getOutput().appendLine('mdn-macros: failed to register providers: ' + String(err))
      console.error(err)
    }
  }

  private async registerComponents(): Promise<void> {
    try {
      activateAllHovers(this.context)
      activateAllDecorations(this.context)
      activateAllMarkers(this.context)
    } catch (err) {
      this.getOutput().appendLine('mdn-macros: failed to register providers: ' + String(err))
      console.error(err)
    }
  }

  /** Register diagnostics handlers and run an initial pass */
  private registerDiagnostics(): void {
    // TODO: Replace this as component
    this.ensureDiagnosticCollection()
    const refreshDiagnostics = (document: vscode.TextDocument) => {
      try {
        const diags = computeDiagnostics(document)
        this.diagnosticCollection?.set(document.uri, diags)
      } catch (err) {
        this.getOutput().appendLine('mdn-macros: diagnostic compute error: ' + String(err))
      }
    }

    this.context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(refreshDiagnostics))
    this.context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document)))
    if (vscode.workspace.textDocuments) {
      vscode.workspace.textDocuments.forEach(refreshDiagnostics)
    }
  }

  /** Run detection and (if positive) initialize features */
  public async detectAndInit(): Promise<void> {
    try {
      const out = this.getOutput()
      const detected = await isMdnRepo()
      if (detected) {
        out.appendLine('mdn-macros: MDN repo detected — initializing features')
        await this.initFeatures()
      } else {
        out.appendLine('mdn-macros: MDN repo not detected — features remain disabled')
      }
    } catch (err) {
      console.error('mdn-macros: error during repo detection', err)
    }
  }

  /** Watch workspace-folder changes and re-run detection if still disabled */
  public setupWatcher(): void {
    const watcher = vscode.workspace.onDidChangeWorkspaceFolders(async () => {
      if (this.featuresActivated) return
      await this.detectAndInit()
    })
    this.context.subscriptions.push(watcher)
  }
}

export default ActivationManager
