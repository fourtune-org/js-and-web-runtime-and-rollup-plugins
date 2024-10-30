import type {DefaultExportObject as BaseObject} from "@fourtune/types/base-realm-js-and-web/v0/"

import resolveProjectRoot from "#/resolveProjectRoot.mjs"
import {loadRealmDependencies} from "@fourtune/base-realm"
import {scandir} from "@anio-fs/scandir"
import path from "node:path"
import fs from "node:fs/promises"

import handleTypeScriptResource from "./handleTypeScriptResource.mts"

export type InitializeResourcesData = (
	project_root : string | null,
	is_in_static_ambient? : boolean
) => Promise<{resources: any[]}>

const initializeResourcesData : InitializeResourcesData = async function(
	project_root : string | null,
	is_in_static_ambient : boolean = false
) {
	project_root = await resolveProjectRoot(project_root)

	const {getDependency} = await loadRealmDependencies(project_root, "realm-js")
	const base : BaseObject = getDependency("@fourtune/base-realm-js-and-web")

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
					project_root, entry.absolute_path, base, initializeResourcesData
				)
			})
		} else {
			console.log("oof", entry.absolute_path)
		}
	}

	return {resources}
}

export {initializeResourcesData}
