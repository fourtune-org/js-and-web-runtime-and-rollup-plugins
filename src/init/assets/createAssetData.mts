import {
	DefaultExportObject as BaseObject,
	JsAssetURLProtocol
} from "@fourtune/types/base-realm-js-and-web/v0/"

import {createJSBundle} from "./creation/createJSBundle.mts"
import type {InitializeAssets} from "./index.mts"

import path from "node:path"
import fs from "node:fs/promises"

export async function createAssetData(
	initializeAssets: InitializeAssets,
	project_root : string,
	base : BaseObject,
	protocol : JsAssetURLProtocol,
	asset_path : string
) : Promise<any> {
	const absolute_path = path.join(project_root, "assets", asset_path)

	if (protocol === "js-bundle") {
		return await createJSBundle(
			project_root,
			base,
			absolute_path,
			initializeAssets
		)
	} else if (protocol === "text") {
		return (await fs.readFile(
			absolute_path
		)).toString()
	}

	throw new Error(`Invalid protocol "${protocol}".`)
}
