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
		createContext(
			instance_or_options: RuntimeWrappedContextInstance|Partial<ContextOptions>|undefined
		) : RuntimeWrappedContextInstance {
			// handle "undefined" case
			if (!instance_or_options) {
				return createWrappedContextInstance(
					current_project, {}
				)
			}

			// handle wrapped context instance
			if ("_kind" in instance_or_options) {
				return instance_or_options
			}

			// instance_or_options must be of type ContextOptions
			return createWrappedContextInstance(current_project, instance_or_options)
		}
	}
}

export default initializeRuntime
