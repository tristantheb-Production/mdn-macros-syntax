import * as vscode from 'vscode'

let channel: vscode.OutputChannel | undefined

const initOutput = (context?: vscode.ExtensionContext): void => {
  if (channel) return
  channel = vscode.window.createOutputChannel('mdn-macros')
  if (context) context.subscriptions.push(channel)
}

const getOutputChannel = (): vscode.OutputChannel => {
  return channel ?? vscode.window.createOutputChannel('mdn-macros')
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

const appendLine = (level: LogLevel, s: string): void => {
  getOutputChannel().appendLine(`[${level}] ${s}`)
}

export { initOutput, appendLine, LogLevel }
