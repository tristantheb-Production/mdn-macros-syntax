import { CodeLens, Range } from 'vscode'

class CodeLensComponent extends CodeLens {
  constructor(
    commandRange: Range,
    readonly replaceRange?: Range
  ) {
    super(commandRange)
    this.replaceRange = replaceRange ?? commandRange
    this.command = undefined
  }

  setCommand(title: string, command: string, args: Array<unknown>) {
    this.command = {
      title,
      command,
      arguments: args
    }

    return this
  }
}

export { CodeLensComponent }
