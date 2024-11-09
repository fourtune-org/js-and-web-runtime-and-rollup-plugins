import {getAsset} from "@fourtune/realm-js/v0/assets"

const runtime_init = getAsset(
	"js-bundle://runtime/initializeRuntime.mts"
)

import {factory as projectPluginFactory} from "#~src/export/project/rollup/factory.mts"
import gluecode from "#~auto/runtime_gluecode.mts"

export async function factory(project_root : string) {
	const project_plugin = await projectPluginFactory(project_root)

	return {
		id: "plugin",

		resolveId(id : string) {
			let tmp = project_plugin.resolveId(id)

			if (tmp !== null) return tmp

			if (id === `\0fourtune:runtime-init`) {
				return id
			} else if (id === "@fourtune/realm-js/v0/runtime") {
				return `\0fourtune:runtime`
			}

			return null
		},

		load(id : string) {
			let tmp = project_plugin.load(id)

			if (tmp !== null) return tmp

			if (id === `\0fourtune:runtime-init`) {
				return runtime_init
			} else if (id === `\0fourtune:runtime`) {
				return `
import initializeRuntime from "\0fourtune:runtime-init"
import {getProjectPackageJSON, getFourtuneConfiguration} from "@fourtune/realm-js/v0/project"

const project = {
	package_json: getProjectPackageJSON(),
	fourtune_configuration: getFourtuneConfiguration()
}

${gluecode}
	`
			}

			return null
		}
	}
}
