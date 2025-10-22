import { type ExtensionContext, type TextDocument, type TextEditorDecorationType } from 'vscode'
import { Range } from 'vscode'

abstract class Decoration {
  abstract getDecorations(context: ExtensionContext): { [k: string]: TextEditorDecorationType }
  abstract findRanges(doc: TextDocument): { [k: string]: Range[] }
}

export { Decoration }
