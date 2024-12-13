import logLevelToNumber from "./logLevelToNumber.mts"

import type {
	DefaultExportObject,
	LogLevel
} from "@fourtune/types/realm-js-and-web/v0/runtime"

export function compareLogLevel(
	log_level_left: LogLevel,
	operator: Parameters<DefaultExportObject["compareLogLevel"]>[1],
	log_level_right: LogLevel
) : boolean {
	const left = logLevelToNumber(log_level_left)
	const right = logLevelToNumber(log_level_right)

	if (left === -1) {
		throw new Error(`Invalid left log level.`)
	} else if (right === -1) {
		throw new Error(`Invalid right log level.`)
	}

	if (operator === ">") {
		return left > right
	} else if (operator === ">=") {
		return left >= right
	} else if (operator === "<") {
		return left < right
	} else if (operator === "<=") {
		return left <= right
	}

	throw new Error(`Invalid operator "${operator}".`)
}
