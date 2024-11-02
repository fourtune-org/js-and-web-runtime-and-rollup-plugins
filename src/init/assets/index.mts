import resolveProjectRoot from "#~src/resolveProjectRoot.mjs"
import {loadRealmDependencies} from "@fourtune/base-realm"
import {scandir} from "@anio-fs/scandir"
import path from "node:path"
import fs from "node:fs/promises"

import handleTypeScriptAsset from "./handleTypeScriptAsset.mts"

export type InitializeAssets = (
	project_root : string | null,
	is_in_static_ambient? : boolean
) => Promise<{assets: any[]}>

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

	let assets = []

	for (const entry of entries) {
		if (entry.type !== "regularFile") continue
		if (!entry.parents.length) continue

		const asset_type = entry.parents[0]
		const url_part1 = "/" + entry.parents.slice(1).join("/") + "/" + entry.name
		const asset_url = `${asset_type}:/` + path.normalize(
			url_part1
		)

		if (asset_type === "text") {
			assets.push({
				url: asset_url,
				type: asset_type,
				data: (await fs.readFile(
					entry.absolute_path
				)).toString()
			})
		} else if (asset_type === "tsmodule") {
			assets.push({
				url: asset_url,
				type: asset_type,
				data: is_in_static_ambient ? "<static>" : await handleTypeScriptAsset(
					project_root, entry.absolute_path, getDependency, initializeAssets
				)
			})
		} else {
			console.log("oof", entry.absolute_path)
		}
	}

	return {assets}
}

export {initializeAssets}
