import resolveProjectRoot from "#~src/resolveProjectRoot.mjs"
import core from "fourtune-embedded-core/v1"

import type {
	DefaultExportObject as BaseObject,
	JsGetRequestedAssetsFromCodeReason,
	JsGetRequestedAssetsFromCodeResult
} from "@fourtune/types/base-realm-js-and-web/v0/"

import type {Asset} from "./Asset.d.mts"

import {getListOfAllAssets} from "./getListOfAllAssets.mts"
import {getListOfUsedProjectAssets} from "./getListOfUsedProjectAssets.mts"
import {getListOfUsedProjectAssetsInStaticContext} from "./getListOfUsedProjectAssetsInStaticContext.mts"
import {createAssetData} from "./createAssetData.mts"

export type InitializeAssetsResult = Promise<{
	list: Asset[],
	included_all_assets: true,
	reason: JsGetRequestedAssetsFromCodeReason
} | {
	list: Asset[],
	included_all_assets: false
}>

export type InitializeAssets = (
	project_root : string | null,
	is_in_static_ambient? : boolean,
	// only relevant when in static ambient
	asset_absolute_path? : string|null
) => InitializeAssetsResult

// todo:
// if we pass the input source file we might be able to
// filter out assets on a per file basis?
const initializeAssets : InitializeAssets = async function(
	project_root : string | null,
	is_in_static_ambient : boolean = false,
	// only relevant when in static ambient
	asset_absolute_path : string|null = null
) : InitializeAssetsResult {
	// sanity check
	if (is_in_static_ambient && !asset_absolute_path) {
		throw new Error(
			`It is an error to set is_in_static_ambient without also setting asset_absolute_path.`
		)
	} else if (!is_in_static_ambient && asset_absolute_path) {
		throw new Error(
			`It is an error to set asset_absolute_path without enabling is_in_static_ambient.`
		)
	}

	project_root = await resolveProjectRoot(project_root)

	const base : BaseObject = (await core.loadRealmDependency(project_root, "js", "@fourtune/base-realm-js-and-web")).dependency

	const tmp : JsGetRequestedAssetsFromCodeResult = await (
		is_in_static_ambient ? getListOfUsedProjectAssetsInStaticContext(
			base, asset_absolute_path as string
		) : getListOfUsedProjectAssets(
			base, project_root
		)
	)

	// project doesn't use any assets
	if (!tmp.used) {
		return {
			list: [],
			included_all_assets: false
		}
	}

	const reason = ("reason" in tmp) ? tmp.reason : "unknown"

	const project_assets = (
		tmp.assets === "unknown"
	) ? await getListOfAllAssets(
		base, project_root
	) : tmp.assets

	const ret : Asset[] = []

	for (const asset of project_assets) {
		// in static context, js-bundle will never be generated
		if (asset.protocol === "js-bundle" && is_in_static_ambient) {
			continue
		}

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
		list: ret,
		included_all_assets: tmp.assets === "unknown",
		reason
	}
}

export {initializeAssets}
