import type {
	LogLevel,
	ContextInstance,
	ContextOptionsShouldLog as Impl
} from "@fourtune/types/realm-js-and-web/v0/runtime"
import logLevelToNumber from "../logLevelToNumber.mts"

const impl : Impl = function(
	context: ContextInstance,
	level : LogLevel,
	package_name : string,
	tag : string
) {
	void package_name;
	void tag;

	const message_log_level = logLevelToNumber(level)
	const current_log_level = logLevelToNumber(
		context.options.getCurrentLogLevel(context)
	)

	return !(message_log_level > current_log_level)
}

export default impl
