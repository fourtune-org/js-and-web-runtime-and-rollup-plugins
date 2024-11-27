// NB: this file needs to be node independent
import type {Project} from "@fourtune/types/realm-js-and-web/v0/project"

import type {
	DefaultExportObject,
	WrappedContext,
	ContextInstance,
	ContextOptions
} from "@fourtune/types/realm-js-and-web/v0/runtime"

import isWrappedContext from "./isWrappedContext.mts"
import createWrappedContextInstance from "./createWrappedContextInstance.mts"

function initializeRuntime(
	current_project : Project
) : DefaultExportObject {
	return {
		createDefaultContext(
			options_or_context: UserContext = {}
		) : WrappedContext {
			if (isWrappedContext(options_or_context)) {
				return options_or_context as WrappedContext
			}

			return createWrappedContextInstance(
				current_project, options_or_context as Partial<ContextOptions>
			)
		}
	}
}

export default initializeRuntime
