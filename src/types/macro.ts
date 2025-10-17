/**
 * Supported parameter value kinds.
 * Add new kinds here if additional validation is added later.
 */
export type ParamType = 'string' | 'number' | 'string-number' | 'boolean' | 'enum';

/**
 * Shape of the JSON files sitting under `src/macros/definitions/*.json`.
 * This is the minimal raw shape we expect to parse from disk.
 */
export interface BaseMacroJSON {
	params?: Array<{
		name: string;
		type: ParamType | string;
		optional?: boolean;
		allowedValues?: string[];
	}>;
	deprecated?: boolean;
	/**
	 * Optional key indicating an alternate place to look up a description.
	 * Present for compatibility with some older macro files.
	 */
	descriptionKey?: string;
}

/**
 * Normalized parameter representation used at runtime by providers.
 */
export interface MacroParam {
	name: string;
	type: ParamType;
	optional?: boolean;
	description?: string;
	allowedValues?: string[];
}

/**
 * Fully materialized macro definition returned by `getKnownMacros`.
 * `description` is always present (may be empty string if unavailable).
 */
export interface MacroDefinition {
	description: string;
	params?: MacroParam[];
	deprecated?: boolean;
}

/**
 * Shape of entries in localization files `macros.nls*.json`.
 */
export interface LocalizedMacroEntry {
	description?: string;
	params?: { [paramName: string]: string };
}
