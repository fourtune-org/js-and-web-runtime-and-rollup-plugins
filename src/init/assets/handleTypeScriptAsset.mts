import fs from "node:fs/promises"
import type {
	DefaultExportObject as BaseObject,
	JsBundlerPlugin
} from "@fourtune/types/base-realm-js-and-web/v0/"
import {factory as projectRollupPlugin} from "#~src/export/project/rollup/factory.mts"

import type {InitializeAssets} from "./index.mts"

async function getEntryCodeForResource(
	base : BaseObject,
	absolute_path : string
) {
	const source_code = (await fs.readFile(absolute_path)).toString()

	const {tsGetDeclaredExportNamesFromCode} = base

	const export_names = await tsGetDeclaredExportNamesFromCode(source_code)
	const source = JSON.stringify(absolute_path)
	let entry_code = ``

	if (export_names.length === 0) {
		entry_code = `import ${source}\n`
	} else if (export_names.length === 1 && export_names[0] === "default") {
		entry_code  = `export {default} from ${source}\n`
	} else {
		if (export_names.includes("default")) {
			entry_code  = `export {default} from ${source}\n`
		}

		entry_code  = `export * from ${source}\n`
	}

	return entry_code
}

export default async function(
	project_root : string,
	entry_path : string,
	getDependency : (dependency : string) => any,
	initializeAssets : InitializeAssets
) : Promise<string> {
	const additional_plugins : JsBundlerPlugin[] = []

	const base : BaseObject = getDependency("@fourtune/base-realm-js-and-web")

	const {tsBundler} = base

	additional_plugins.push({
		when: "pre",
		plugin: await projectRollupPlugin(project_root)
	})

	const static_resources = await initializeAssets(project_root, true)

	additional_plugins.push({
		when: "pre",
		plugin: {
			resolveId(id : string) {
				if (id === "@fourtune/realm-js/assets") {
					return `\0fourtune:static_resources`
				}

				return null
			},

			load(id : string) {
				if (id !== `\0fourtune:static_resources`) return null

				return `
const static_resources = ${JSON.stringify(static_resources, null, 4)};

export function getAsset(url) {
	return static_resources
}
`
			}
		}
	})

	const entry_code = await getEntryCodeForResource(
		base, entry_path
	)

	return await tsBundler(
		project_root, entry_code, {
			additional_plugins,
			// never treeshake assets
			treeshake: false
		}
	)
}
