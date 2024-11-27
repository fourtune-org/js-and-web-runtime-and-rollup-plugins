// NB: this file needs to be node independent
import type {Project} from "@fourtune/types/realm-js-and-web/v0/project"
import type {RuntimeWrappedContextInstance} from "@fourtune/types/realm-js-and-web/runtime"

import type {
	DefaultExportObject,
	ContextOptions
} from "@fourtune/types/realm-js-and-web/v0/runtime"

import createWrappedContextInstance from "./createWrappedContextInstance.mts"

function initializeRuntime(
	current_project : Project
) : DefaultExportObject {
	return {
		createDefaultContext(
			options_or_context: RuntimeWrappedContextInstance|Partial<ContextOptions>|undefined
		) : RuntimeWrappedContextInstance {
			// handle "undefined" case
			if (!options_or_context) {
				return createWrappedContextInstance(
					current_project, {}
				)
			}

			// handle wrapped context instance
			if ("_kind" in options_or_context) {
				return options_or_context
			}

			return createWrappedContextInstance(current_project, options_or_context)
		}
	}
}

export default initializeRuntime
