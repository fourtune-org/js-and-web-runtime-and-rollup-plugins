import type {RuntimePackageInformation} from "@fourtune/types/realm-js-and-web/runtime"
import type {
	LogLevel,
	ContextInstance,
	ContextOptionsShouldLog as Impl
} from "@fourtune/types/realm-js-and-web/v0/runtime"
import logLevelToNumber from "../logLevelToNumber.mts"

const impl : Impl = function(
	context: ContextInstance,
	level : LogLevel,
	pkg : RuntimePackageInformation,
	tag : string
) {
	void pkg;
	void tag;

	const message_log_level = logLevelToNumber(level)
	const current_log_level = logLevelToNumber(
		context.options.getCurrentLogLevel(context)
	)

	return !(message_log_level > current_log_level)
}

export default impl
