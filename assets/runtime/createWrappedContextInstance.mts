import default_getCurrentLogLevel from "./context/default_getCurrentLogLevel.mts"
import default_printLine from "./context/default_printLine.mts"
import default_logWithLevel from "./context/default_logWithLevel.mts"
import default_shouldLog from "./context/default_shouldLog.mts"

import type {
	Project,
	ContextInstance,
	WrappedContext,
	ContextOptions
} from "@fourtune/types/realm-js-and-web/runtime/v0/"

export default function(project : Project, {
	tag                = "",
	getCurrentLogLevel = default_getCurrentLogLevel,
	printLine          = default_printLine,
	logWithLevel       = default_logWithLevel,
	shouldLog          = default_shouldLog
} = {}) : WrappedContext {
	const options : ContextOptions = {
		tag,
		getCurrentLogLevel,
		printLine,
		logWithLevel,
		shouldLog
	}

	function log(this : ContextInstance, ...messages : string[]) {
		this.options.logWithLevel.call(this, "debug", messages)
	}

	log.error   = function error(this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "error", messages) }
	log.warn    = function warn (this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "warn" , messages) }
	log.info    = function info (this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "info" , messages) }
	log.debug   = function debug(this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "debug", messages) }
	log.trace   = function trace(this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "trace", messages) }

	const _instance : ContextInstance = {
		project,
		options,
		log
	}

	return {
		_version: 0,
		_instance
	}
}
