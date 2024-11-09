import type {
	ContextInstance,
	LogLevel
} from "@fourtune/types/realm-js-and-web/v0/runtime"

import logLevelToNumber from "../logLevelToNumber.mts"

function toLowerCase(v : any) {
	if (!("toLowerCase" in v)) return ""

	return v.toLowerCase()
}

export default function(
	context: ContextInstance
) : LogLevel {
	let current_log_level = "info"

	if (typeof process === "object") {
		if ("FOURTUNE_RUNTIME_LOG_LEVEL" in process.env) {
			current_log_level = toLowerCase(process.env["FOURTUNE_RUNTIME_LOG_LEVEL"])
		}
	} else if (typeof window === "object") {
		if ("FOURTUNE_RUNTIME_LOG_LEVEL" in window) {
			current_log_level = toLowerCase(window.FOURTUNE_RUNTIME_LOG_LEVEL)
		}
	}

	if (logLevelToNumber(current_log_level) === -1) {
		context.options.printLine(context, `Warning: invalid log level '${current_log_level}'`)

		current_log_level = "info"
	}

	return current_log_level as LogLevel
}
