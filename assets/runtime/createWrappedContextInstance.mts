import default_getCurrentLogLevel from "./context/default_getCurrentLogLevel.mts"
import default_printLine from "./context/default_printLine.mts"
import default_logWithLevel from "./context/default_logWithLevel.mts"
import default_shouldLog from "./context/default_shouldLog.mts"

import type {
	Project,
	ContextInstance,
	WrappedContext,
	ContextOptions
} from "@fourtune/types/realm-js-and-web/v0/runtime"

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

	let _instance : Partial<ContextInstance> = {}

	const log : any = (function log(this : ContextInstance, ...messages : string[]) {
		this.options.logWithLevel.call(this, "debug", messages)
	}).bind(_instance as ContextInstance)

	log.error   = (function error(this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "error", messages) }).bind(_instance as ContextInstance)
	log.warn    = (function warn (this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "warn" , messages) }).bind(_instance as ContextInstance)
	log.info    = (function info (this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "info" , messages) }).bind(_instance as ContextInstance)
	log.debug   = (function debug(this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "debug", messages) }).bind(_instance as ContextInstance)
	log.trace   = (function trace(this : ContextInstance, ...messages: string[]) { this.options.logWithLevel.call(this, "trace", messages) }).bind(_instance as ContextInstance)

	_instance.project = project
	_instance.options = options
	_instance.log = log

	return {
		_version: 0,
		_instance
	}
}
