import * as vscode from 'vscode'
import { MacroHoverComponent } from './MacroHoverComponent'
import { DOCUMENT_SELECTOR } from '../../utils/constants'

const HOVER_COMPONENTS = [
  new MacroHoverComponent()
]

const activateAllHovers = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(DOCUMENT_SELECTOR, {
      provideHover(document, position) {
        for (const component of HOVER_COMPONENTS) {
          const hover = component.getHover(document, position)
          if (hover) return hover
        }
        return undefined
      }
    })
  )
}

export { activateAllHovers }
