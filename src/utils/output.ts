import * as vscode from 'vscode'

let channel: vscode.OutputChannel | undefined

const initOutput = (context?: vscode.ExtensionContext): void => {
  if (!channel) {
    channel = vscode.window.createOutputChannel('MDN Macros')
  }
  if (context && channel) {
    const alreadyRegistered = (context.subscriptions || []).some((d) => d === channel)
    if (!alreadyRegistered) context.subscriptions.push(channel)
  }
}

const getOutputChannel = (): vscode.OutputChannel => {
  if (!channel) {
    channel = vscode.window.createOutputChannel('MDN Macros')
  }
  return channel
}

enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

const appendLine = (level: LogLevel, s: string): void => {
  getOutputChannel().appendLine(`[${level}] ${s}`)
}

export { initOutput, appendLine, LogLevel }
