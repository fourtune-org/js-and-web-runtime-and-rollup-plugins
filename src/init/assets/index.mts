import resolveProjectRoot from "#~src/resolveProjectRoot.mjs"
import {loadRealmDependencies} from "@fourtune/base-realm"
import {scandir} from "@anio-fs/scandir"
import path from "node:path"
import fs from "node:fs/promises"

import type {
	DefaultExportObject as BaseObject
} from "@fourtune/types/base-realm-js-and-web/v0/"

import {getListOfUsedProjectAssets} from "./getListOfUsedProjectAssets.mts"
import handleTypeScriptAsset from "./handleTypeScriptAsset.mts"

export type InitializeAssets = (
	project_root : string | null,
	is_in_static_ambient? : boolean
) => Promise<{assets: any[]}>

function checkIfShouldIncludeAsset(
	used_assets : false|Map<string, 1>, asset_url : string
) : boolean {
	if (used_assets === false) return true

	return used_assets.has(asset_url)
}

const initializeAssets : InitializeAssets = async function(
	project_root : string | null,
	is_in_static_ambient : boolean = false
) {
	project_root = await resolveProjectRoot(project_root)

	const {getDependency} = await loadRealmDependencies(project_root, "realm-js")

	const base : BaseObject = getDependency("@fourtune/base-realm-js-and-web")

	const assets : {
		url: string,
		type: string,
		data: string
	}[] = []

	const entries = (await scandir(
		path.join(project_root, "assets"), {
			allow_missing_dir: true
		}
	)) ?? []

	const used_assets = await getListOfUsedProjectAssets(
		base, project_root
	)

	if (used_assets === false) {
		process.stderr.write(
			`[!!!] could not determine which assets are used, including all of them.\n`
		)
	}

	for (const entry of entries) {
		if (entry.type !== "regularFile") continue
		if (!entry.parents.length) continue

		const asset_type = entry.parents[0]
		const url_part1 = "/" + entry.parents.slice(1).join("/") + "/" + entry.name
		const asset_url = `${asset_type}:/` + path.normalize(
			url_part1
		)

		const skip = checkIfShouldIncludeAsset(
			used_assets, asset_url
		) === false

		if (skip) {
			process.stderr.write(
				`skipping asset '${asset_url}'\n`
			)

			continue
		}

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
