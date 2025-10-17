# MDN Macros Syntax VSCode Extension

This extension provides syntax highlighting and snippets for MDN Macros in Visual Studio Code.

## Features

### Code Highlighting

The MDN code blocks have 3 keyword types: `interactive-example`, `example-bad`, and `example-good`. Each keyword type has its own color scheme for better readability.

![Code Highlighting in light theme](./docs/images/block-code-colors-light.png)
![Code Highlighting in dark theme](./docs/images/block-code-colors-dark.png)

### Macros snippets and syntax coloring

All MDN Macros have snippets and syntax coloring to help you write MDN Macros quickly and accurately.

For example, trying to type `{{Glossary` will suggest the full macro with a description:

![Example of Glossary completion](./docs/images/macros-completions-glossary-example.png)

The plugin also provide a typo explainer when a macro is not recognized:

```md example-bad
{{glossary("")}} // Unknown MDN macro: glossary. Did you mean 'Glossary'? `mdn-macros(unknownMacro)`
```

```md example-good
{{Glossary("")}}
```
