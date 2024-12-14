import type {RuntimePackageInformation} from "@fourtune/types/realm-js-and-web/_versionless/runtime"
import type {
	LogLevel,
	ContextInstance,
	ContextOptionsShouldLog as Impl
} from "@fourtune/types/realm-js-and-web/v0/runtime"
import {compareLogLevel} from "../compareLogLevel.mts"

const impl : Impl = function(
	context: ContextInstance,
	level : LogLevel,
	pkg : RuntimePackageInformation,
	tag : string
) {
	void pkg;
	void tag;

	let current_log_level = context.options.getCurrentLogLevel(context)

	if (current_log_level === null) {
		current_log_level = context.defaults.getCurrentLogLevel(context) as LogLevel
	}

	return compareLogLevel(
		level,
		">=",
		current_log_level
	)
}

export default impl
