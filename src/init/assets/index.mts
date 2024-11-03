import resolveProjectRoot from "#~src/resolveProjectRoot.mjs"
import {loadRealmDependencies} from "@fourtune/base-realm"

import type {
	DefaultExportObject as BaseObject,
	JsParseAssetURLResult
} from "@fourtune/types/base-realm-js-and-web/v0/"

import {getListOfAllAssets} from "./getListOfAllAssets.mts"
import {getListOfUsedProjectAssets} from "./getListOfUsedProjectAssets.mts"

export type InitializeAssets = (
	project_root : string | null,
	is_in_static_ambient? : boolean
) => Promise<{assets: any[]}>

// todo:
// if we pass the input source file we might be able to
// filter out assets on a per file basis?
const initializeAssets : InitializeAssets = async function(
	project_root : string | null,
	is_in_static_ambient : boolean = false
) {
	project_root = await resolveProjectRoot(project_root)

	const {getDependency} = await loadRealmDependencies(project_root, "realm-js")

	const base : BaseObject = getDependency("@fourtune/base-realm-js-and-web")

	const ret : {
		url: string,
		type: string,
		data: string
	}[] = []

	let assets = await getListOfUsedProjectAssets(
		base, project_root
	)

	if (assets === false) {
		process.stderr.write(
			`[!!!] could not determine which assets are used, including all of them.\n`
		)

		assets = await getListOfAllAssets(base, project_root)
	}

	const project_assets : Map<
		JsParseAssetURLResult, 1
	> = assets

	for (const [asset] of project_assets.entries()) {
		console.log(asset)
	}

	return {assets: ret}
}

export {initializeAssets}
