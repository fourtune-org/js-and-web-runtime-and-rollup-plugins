import resolveProjectRoot from "#~src/resolveProjectRoot.mjs"
import {loadRealmDependencies} from "@fourtune/base-realm"

import type {
	DefaultExportObject as BaseObject,
	JsParseAssetURLResult
} from "@fourtune/types/base-realm-js-and-web/v0/"

import {getListOfAllAssets} from "./getListOfAllAssets.mts"
import {getListOfUsedProjectAssets} from "./getListOfUsedProjectAssets.mts"
import {createAssetData} from "./createAssetData.mts"

export type InitializeAssetsResult = Promise<{
	assets: {
		url: string,
		type: string,
		data: string
	}[],
	included_all_assets: boolean
}>

export type InitializeAssets = (
	project_root : string | null,
	is_in_static_ambient? : boolean
) => InitializeAssetsResult

// todo:
// if we pass the input source file we might be able to
// filter out assets on a per file basis?
const initializeAssets : InitializeAssets = async function(
	project_root : string | null,
	is_in_static_ambient : boolean = false
) : InitializeAssetsResult {
	let included_all_assets = false

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
		included_all_assets = true

		assets = await getListOfAllAssets(base, project_root)
	}

	const project_assets : Map<
		JsParseAssetURLResult, 1
	> = assets

	for (const [asset] of project_assets.entries()) {
		ret.push({
			url: `${asset.protocol}://${asset.path}`,
			type: asset.protocol,
			data: await createAssetData(
				initializeAssets,
				project_root,
				base,
				asset.protocol,
				asset.path
			)
		})
	}

	return {
		assets: ret,
		included_all_assets
	}
}

export {initializeAssets}
