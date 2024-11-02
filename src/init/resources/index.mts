import resolveProjectRoot from "#~src/resolveProjectRoot.mjs"
import {loadRealmDependencies} from "@fourtune/base-realm"
import {scandir} from "@anio-fs/scandir"
import path from "node:path"
import fs from "node:fs/promises"

import handleTypeScriptResource from "./handleTypeScriptResource.mts"

export type InitializeAssets = (
	project_root : string | null,
	is_in_static_ambient? : boolean
) => Promise<{resources: any[]}>

const initializeAssets : InitializeAssets = async function(
	project_root : string | null,
	is_in_static_ambient : boolean = false
) {
	project_root = await resolveProjectRoot(project_root)

	const {getDependency} = await loadRealmDependencies(project_root, "realm-js")

	const entries = (await scandir(
		path.join(project_root, "assets"), {
			allow_missing_dir: true
		}
	)) ?? []

	let resources = []

	for (const entry of entries) {
		if (entry.type !== "regularFile") continue
		if (!entry.parents.length) continue

		const resource_type = entry.parents[0]
		const url_part1 = "/" + entry.parents.slice(1).join("/") + "/" + entry.name
		const resource_url = `${resource_type}:/` + path.normalize(
			url_part1
		)

		if (resource_type === "text") {
			resources.push({
				url: resource_url,
				type: resource_type,
				data: (await fs.readFile(
					entry.absolute_path
				)).toString()
			})
		} else if (resource_type === "tsmodule") {
			resources.push({
				url: resource_url,
				type: resource_type,
				data: is_in_static_ambient ? "<static>" : await handleTypeScriptResource(
					project_root, entry.absolute_path, getDependency, initializeAssets
				)
			})
		} else {
			console.log("oof", entry.absolute_path)
		}
	}

	return {resources}
}

export {initializeAssets}
