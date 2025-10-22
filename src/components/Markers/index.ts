import * as vscode from 'vscode'
import { DeprecatedMarkerComponent } from './DeprecatedMarkerComponent'

const MARKER_COMPONENTS = [
  new DeprecatedMarkerComponent()
]

export function activateAllMarkers(context: vscode.ExtensionContext) {
  for (const comp of MARKER_COMPONENTS) {
    try {
      comp.activate(context)
    } catch (err) {
      // don't let a single marker break activation
      console.error('Marker component failed to activate', err)
    }
  }
}

export default activateAllMarkers
