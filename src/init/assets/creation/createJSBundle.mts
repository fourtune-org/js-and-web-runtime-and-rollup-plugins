import {
	DefaultExportObject as BaseObject,
	JsBundlerPlugin
} from "@fourtune/types/base-realm-js-and-web/v0/"

import fs from "node:fs/promises"
import {factory as projectRollupPlugin} from "#~src/export/project/rollup/factory.mts"
import type {InitializeAssets} from "../index.mts"

import {pluginFactory} from "../rollup/pluginFactory.mts"

async function getEntryCode(
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

export async function createJSBundle(
	project_root : string,
	base : BaseObject,
	absolute_path : string,
	initializeAssets: InitializeAssets
) : Promise<string> {
	const {tsBundler} = base

	const entry_code = await getEntryCode(
		base, absolute_path
	)

	const additional_plugins : JsBundlerPlugin[] = []

	additional_plugins.push({
		when: "pre",
		plugin: await projectRollupPlugin(project_root)
	})

	const assets = await initializeAssets(
		project_root, true, absolute_path
	)

	additional_plugins.push({
		when: "pre",
		plugin: await pluginFactory(
			assets.list, "rollup-plugin-fourtune-static-assets"
		)
	})

	return await tsBundler(
		project_root, entry_code, {
			additional_plugins,
			// never treeshake assets
			treeshake: false
		}
	)
}
