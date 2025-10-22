import { type ExtensionContext, type TextDocument, type TextEditorDecorationType } from 'vscode'
import { Range } from 'vscode'

abstract class DecorationComponent {
  abstract getDecorations(context: ExtensionContext): { [k: string]: TextEditorDecorationType }
  abstract findRanges(doc: TextDocument): { [k: string]: Range[] }
}

export { DecorationComponent }
