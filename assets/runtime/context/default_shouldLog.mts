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

	return compareLogLevel(
		level,
		">=",
		context.options.getCurrentLogLevel(context)
	)
}

export default impl
