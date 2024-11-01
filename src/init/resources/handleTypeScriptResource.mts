import type {
	DefaultExportObject as BaseObject,
	JsBundlerPlugin
} from "@fourtune/types/base-realm-js-and-web/v0/"
import {factory as projectRollupPlugin} from "#~src/export/project/rollup/factory.mts"

import type {InitializeResourcesData} from "./index.mts"

export default async function(
	project_root : string,
	entry_path : string,
	base : BaseObject,
	init_resources : InitializeResourcesData
) : Promise<string> {
	const additional_plugins : JsBundlerPlugin[] = []

	const {tsBundler} = base

	additional_plugins.push({
		when: "pre",
		plugin: await projectRollupPlugin(project_root)
	})

	const static_resources = await init_resources(project_root, true)

	additional_plugins.push({
		when: "pre",
		plugin: {
			resolveId(id : string) {
				if (id === "@fourtune/realm-js/resources") {
					return `\0fourtune:static_resources`
				}

				return null
			},

			load(id : string) {
				if (id !== `\0fourtune:static_resources`) return null

				return `
const static_resources = ${JSON.stringify(static_resources, null, 4)};

export function loadResource(url) {
	return static_resources
}
`
			}
		}
	})

	return await tsBundler(
		project_root, `import ${JSON.stringify(entry_path)}`, {
			additional_plugins,
			// never treeshake resources
			treeshake: false
		}
	)
}
