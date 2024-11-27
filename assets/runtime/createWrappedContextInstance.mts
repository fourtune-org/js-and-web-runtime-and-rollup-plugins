import type {Project} from "@fourtune/types/realm-js-and-web/v0/project"
import type {RuntimeWrappedContextInstance} from "@fourtune/types/realm-js-and-web/runtime"

import default_getCurrentLogLevel from "./context/default_getCurrentLogLevel.mts"
import default_printLine from "./context/default_printLine.mts"
import default_logWithLevel from "./context/default_logWithLevel.mts"
import default_shouldLog from "./context/default_shouldLog.mts"

import type {
	ContextInstance,
	ContextOptions,
	LogLevel
} from "@fourtune/types/realm-js-and-web/v0/runtime"

export default function(project : Project, {
	tag                = "",
	getCurrentLogLevel = default_getCurrentLogLevel,
	printLine          = default_printLine,
	logWithLevel       = default_logWithLevel,
	shouldLog          = default_shouldLog
} = {}) : RuntimeWrappedContextInstance {
	const options : ContextOptions = {
		tag,
		getCurrentLogLevel,
		printLine,
		logWithLevel,
		shouldLog
	}

	let _instance : Partial<ContextInstance> = {}

	const log : any = (function log(...messages : string[]) {
		const inst = _instance as Required<typeof _instance>

		inst.options.logWithLevel(inst, "debug", messages)
	}).bind(_instance as ContextInstance)

	const log_levels : LogLevel[] = ["error", "warn", "info", "debug", "trace"]

	for (const level of log_levels) {
		log[level] = function(...messages: string[]) {
			const inst = _instance as Required<typeof _instance>

			inst.options.logWithLevel(inst, level, messages)
		}
	}

	_instance.project = project
	_instance.options = options
	_instance.log = log

	return {
		_kind: "RuntimeContextInstance",
		_version: 0,
		_revision: 0,
		_instance
	}
}
