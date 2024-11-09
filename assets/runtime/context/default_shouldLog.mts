import type {LogLevel} from "@fourtune/types/realm-js-and-web/v0/runtime"
import type {ContextInstance} from "@fourtune/types/realm-js-and-web/v0/runtime"
import logLevelToNumber from "../logLevelToNumber.mts"

export default function(
	this: ContextInstance,
	level : LogLevel,
	package_name : string,
	tag : string
) {
	void package_name;
	void tag;

	const message_log_level = logLevelToNumber(level)
	const current_log_level = logLevelToNumber(
		this.options.getCurrentLogLevel.call(this)
	)

	return !(message_log_level > current_log_level)
}
