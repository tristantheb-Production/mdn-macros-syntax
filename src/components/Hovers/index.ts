import * as vscode from 'vscode'
import { MacroHoverComponent } from './MacroHoverComponent'

const HOVER_COMPONENTS = [
  new MacroHoverComponent()
]

export function activateAllHovers(context: vscode.ExtensionContext) {
  const selector: vscode.DocumentSelector = [
    { language: 'markdown' },
    { language: 'mdn-macros' }
  ]
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(selector, {
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
