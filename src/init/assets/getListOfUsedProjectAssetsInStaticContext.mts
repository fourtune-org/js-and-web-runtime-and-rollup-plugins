import type {
	DefaultExportObject as BaseObject
} from "@fourtune/types/base-realm-js-and-web/v0/"

import fs from "node:fs/promises"

import type {JsParseAssetURLResult} from "@fourtune/types/base-realm-js-and-web/v0/"

export async function getListOfUsedProjectAssetsInStaticContext(
	base : BaseObject,
	absolute_path : string
) : Promise<false|Map<JsParseAssetURLResult, 1>> {
	let ret = new Map()

	let code = (await fs.readFile(absolute_path)).toString()

	code = await base.tsStripTypesFromCode(
		code
	)

	const used_assets = await base.jsGetRequestedAssetsFromCode(code)

	// false means we were not able to determine the
	// used assets
	if (used_assets === false) {
		return false
	}

	for (const asset of used_assets) {
		ret.set(asset, 1)
	}

	return ret
}
