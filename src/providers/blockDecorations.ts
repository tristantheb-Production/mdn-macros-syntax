import * as vscode from 'vscode';
import * as path from 'path';

// Keywords mapping to icon filenames and background colors
const KEYWORD_CONFIG: { [key: string]: { icon: string; color: string } } = {
  'example-good': { icon: 'check.svg', color: 'rgba(76, 175, 80, 0.12)' },
  'example-bad': { icon: 'x.svg', color: 'rgba(244, 67, 54, 0.12)' },
  'interactive-example': { icon: 'console.svg', color: 'rgba(33, 150, 243, 0.12)' }
};

/**
 * Build decoration types appropriate for the current color theme.
 * We recreate decoration types when the active color theme changes to ensure correct light/dark icon is used.
 */
function buildDecorations(context: vscode.ExtensionContext) {
  const decorationsBg: { [k: string]: vscode.TextEditorDecorationType } = {};
  const decorationsIcon: { [k: string]: vscode.TextEditorDecorationType } = {};

  const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
    || vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast;

  for (const k of Object.keys(KEYWORD_CONFIG)) {
    const cfg = KEYWORD_CONFIG[k];
    const lightPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'light', cfg.icon));
    const darkPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'dark', cfg.icon));
    const chosen = isDark ? darkPath : lightPath;

    // background decoration (whole block) with top-right icon as backgroundImage
    const bgDeco = vscode.window.createTextEditorDecorationType({
      backgroundColor: cfg.color,
      isWholeLine: true,
      backgroundImage: chosen as any,
      backgroundPosition: 'right top',
      backgroundSize: '16px 16px',
      backgroundRepeat: 'no-repeat'
    } as vscode.DecorationRenderOptions);

    // icon decoration for the opening fence line only (gutter icon)
    const iconDeco = vscode.window.createTextEditorDecorationType({
      gutterIconPath: chosen,
      gutterIconSize: '16px'
    });

    decorationsBg[k] = bgDeco;
    decorationsIcon[k] = iconDeco;
  }

  return { decorationsBg, decorationsIcon };
}

export function activateBlockDecorations(context: vscode.ExtensionContext) {
  // current decoration sets
  let currentBg: { [k: string]: vscode.TextEditorDecorationType } = {};
  let currentIcon: { [k: string]: vscode.TextEditorDecorationType } = {};

  // create initial decorations
  function rebuild() {
    // dispose old
    for (const k of Object.keys(currentBg)) currentBg[k].dispose();
    for (const k of Object.keys(currentIcon)) currentIcon[k].dispose();
    // build new
    const built = buildDecorations(context);
    currentBg = built.decorationsBg;
    currentIcon = built.decorationsIcon;
    // register disposables so they are cleaned up on extension deactivate
    for (const k of Object.keys(currentBg)) context.subscriptions.push(currentBg[k]);
    for (const k of Object.keys(currentIcon)) context.subscriptions.push(currentIcon[k]);
  }

  rebuild();

  function updateDecorations(editor: vscode.TextEditor | undefined) {
    if (!editor) return;
    const doc = editor.document;
    if (doc.languageId !== 'markdown' && doc.languageId !== 'mdn-macros') return;

    const rangesBgMap: { [k: string]: vscode.Range[] } = {};
    const rangesIconMap: { [k: string]: vscode.Range[] } = {};
    for (const k of Object.keys(KEYWORD_CONFIG)) {
      rangesBgMap[k] = [];
      rangesIconMap[k] = [];
    }

    // scan lines to find fenced code blocks
    const lineCount = doc.lineCount;
    let line = 0;
    while (line < lineCount) {
      const textLine = doc.lineAt(line).text;
      if (textLine.trim().startsWith('```')) {
        const infoString = textLine.trim().substring(3).trim();
        // find end
        let endLine = line + 1;
        while (endLine < lineCount && !doc.lineAt(endLine).text.trim().startsWith('```')) {
          endLine++;
        }
        if (endLine < lineCount) {
          // block range includes the closing fence line
          const blockRange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(endLine, doc.lineAt(endLine).text.length));
          // icon range is a zero-length range at the start of the opening fence line so gutter icon appears only once
          const iconRange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, 0));

          // check for keywords in infoString
          const parts = infoString.split(/\s+/).map(p => p.trim()).filter(Boolean);
          for (const part of parts) {
            const key = part.toLowerCase();
            if (rangesBgMap[key]) {
              rangesBgMap[key].push(blockRange);
              rangesIconMap[key].push(iconRange);
              // only first matching keyword applies per block — break to avoid multiple
              break;
            }
          }
        }
        line = endLine + 1;
      } else {
        line++;
      }
    }

    // apply decorations
    for (const k of Object.keys(rangesBgMap)) {
      editor.setDecorations(currentBg[k], rangesBgMap[k]);
      editor.setDecorations(currentIcon[k], rangesIconMap[k]);
    }
  }

  // update on active editor change and document changes
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e) => updateDecorations(e)));
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
    if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document) {
      updateDecorations(vscode.window.activeTextEditor);
    }
  }));

  // rebuild decorations when theme changes
  context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme(() => {
    // Rebuild decorations for new theme without logging.
    rebuild();
    updateDecorations(vscode.window.activeTextEditor);
  }));

  // initial run
  updateDecorations(vscode.window.activeTextEditor);
}
