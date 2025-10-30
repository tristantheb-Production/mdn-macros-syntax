import * as path from 'path'
import * as fs from 'fs'
import { MacroDefinition, BaseMacroJSON, LocalizedMacroEntry, MacroParam, ParamType } from '../types/macro'
import { appendLine, LogLevel } from '../utils/output'

/**
 * Load base macro definitions from JSON files.
 * @returns A mapping of macro names to their definitions.
 */
const loadBaseMacros = (): { [key: string]: Omit<MacroDefinition, 'description'> & { descriptionKey?: string } } => {
  // Resolve path to macro definitions
  const repoDefinitionsPath = path.resolve(process.cwd(), 'src', 'macros', 'definitions')
  const upLevelSourceDefinitionsPath = path.resolve(__dirname, '..', '..', 'src', 'macros', 'definitions')
  const packagedDefinitionsPath = path.resolve(__dirname, 'definitions')
  let definitionsDirectory = ''

  // Get definitions directory from possible locations (pick first that exists)
  const candidates = [repoDefinitionsPath, upLevelSourceDefinitionsPath, packagedDefinitionsPath]
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        definitionsDirectory = candidate
        break
      }
    } catch { /* ignore */ }
  }

  // Load macro definitions from JSON files in the definitions directory
  const result: { [key: string]: Omit<MacroDefinition, 'description'> & { descriptionKey?: string } } = {}
  if (!definitionsDirectory) return result

  // Read all .json files in the definitions directory
  try {
    const files = fs.readdirSync(definitionsDirectory).filter(f => f.endsWith('.json'))
    for (const f of files) {
      const full = path.join(definitionsDirectory, f)
      try {
        const raw = fs.readFileSync(full, 'utf8')
        const parsed = JSON.parse(raw) as BaseMacroJSON
        const name = path.basename(f, '.json')
        if (parsed.params && !Array.isArray(parsed.params)) {
          appendLine(LogLevel.WARN, `[macros] invalid params in ${f}`)
          continue
        }
        const parsedObj = parsed as unknown as Omit<MacroDefinition, 'description'> & { descriptionKey?: string }
        result[name] = parsedObj
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        appendLine(LogLevel.ERROR, `[macros] failed to load macro definition ${f} ${msg}`)
      }
    }
    appendLine(LogLevel.INFO, `[macros] loaded macro definitions from ${definitionsDirectory}`)
    appendLine(LogLevel.INFO, `[macros] definitions count: ${Object.keys(result).length}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    appendLine(LogLevel.ERROR, `[macros] error reading macro definitions ${msg}`)
  }

  return result
}

// Load base macro definitions once
const BASE_MACROS = loadBaseMacros()

/**
 * Load localized macro descriptions for a given language code.
 */
const loadLocalizedDescriptions = (lang: string): { [key: string]: LocalizedMacroEntry } => {
  const filename = lang === 'en' ? 'macros.nls.json' : `macros.nls.${lang}.json`
  const candidates: string[] = []

  // repository source locations (development)
  candidates.push(path.resolve(process.cwd(), 'src', 'locales', filename))
  candidates.push(path.resolve(process.cwd(), 'locales', filename))

  // up-level source (when modules are loaded from compiled out/ folder)
  candidates.push(path.resolve(__dirname, '..', '..', 'src', 'locales', filename))

  // packaged extension locations relative to this module
  candidates.push(path.resolve(__dirname, '..', 'locales', filename))
  candidates.push(path.resolve(__dirname, 'locales', filename))

  for (const cand of candidates) {
    if (!!cand && fs.existsSync(cand)) {
      const raw = fs.readFileSync(cand, 'utf8')
      const parsed = JSON.parse(raw) as { [key: string]: LocalizedMacroEntry }
      return parsed || {}
    }
  }

  return {}
}

/**
 * Get known macro definitions for a specific locale.
 */
const getKnownMacros = (locale?: string): { [key: string]: MacroDefinition } => {
  const lang = (locale || process.env.VSCODE_UI_LANGUAGE || 'en').toLowerCase()
  const short = lang.split('-')[0]
  // load english base first
  const en = loadLocalizedDescriptions('en') || {}
  // then short (e.g. 'fr') then full (e.g. 'pt-br')
  const shortLoc = short === 'en' ? {} : (loadLocalizedDescriptions(short) || {})
  const fullLoc = (lang === short) ? {} : (loadLocalizedDescriptions(lang) || {})

  const result: { [key: string]: MacroDefinition } = {}
  for (const k of Object.keys(BASE_MACROS)) {
    const base = BASE_MACROS[k] as BaseMacroJSON
    const enEntry = en[k] || {}
    const shortEntry = shortLoc[k] || {}
    const fullEntry = fullLoc[k] || {}
    const desc = fullEntry.description || shortEntry.description || enEntry.description || ''

    const params = base.params ? base.params.map((p): MacroParam => {
      const t = String(p.type)
      const allowed = ['string', 'number', 'string-number', 'boolean', 'enum']
      const typeValue = allowed.includes(t) ? (t as ParamType) : 'string'
      return {
        name: p.name,
        type: typeValue,
        optional: !!p.optional,
        allowedValues: p.allowedValues,
        description: undefined
      }
    }) : undefined
    if (params) {
      const enParamsMap = (enEntry.params && typeof enEntry.params === 'object') ?
        (enEntry.params as { [k: string]: string }) :
        {}
      const shortParamsMap = (shortEntry.params && typeof shortEntry.params === 'object') ?
        (shortEntry.params as { [k: string]: string }) :
        {}
      const fullParamsMap = (fullEntry.params && typeof fullEntry.params === 'object') ?
        (fullEntry.params as { [k: string]: string }) :
        {}

      const fullVals = Object.values(fullParamsMap || {})
      const shortVals = Object.values(shortParamsMap || {})
      const enVals = Object.values(enParamsMap || {})

      for (let i = 0; i < params.length; i++) {
        const param = params[i]
        const byName = fullParamsMap[param.name] || shortParamsMap[param.name] || enParamsMap[param.name]
        const byPos = fullVals[i] || shortVals[i] || enVals[i]
        param.description = byName || byPos || undefined
      }
    }
    const deprecated = !!(base && (base as BaseMacroJSON).deprecated)
    result[k] = { description: desc, params, deprecated } as MacroDefinition
  }
  return result
}

export { getKnownMacros }
