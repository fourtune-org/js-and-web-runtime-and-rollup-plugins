import type {
	DefaultExportObject as BaseObject
} from "@fourtune/types/base-realm-js-and-web/v0/"

import type {
	JsParseAssetURLResult,
	JsAssetURLProtocol
} from "@fourtune/types/base-realm-js-and-web/v0/"

import {scandir} from "@anio-fs/scandir"
import path from "node:path"

function getSupportedProtocolsByExtension(name : string) : JsAssetURLProtocol[] {
	if (name.endsWith(".mts")) {
		return ["text", "js-bundle"]
	} else {
		return ["text"]
	}
}

export async function getListOfAllAssets(
	base : BaseObject, project_root : string
) : Promise<JsParseAssetURLResult[]> {
	const {jsParseAssetURL} = base

	const ret = []

	const entries = (await scandir(
		path.join(project_root, "assets"), {
			allow_missing_dir: true,
			async filter({type}) {
				return type === "regularFile"
			}
		}
	)) ?? []

	for (const entry of entries) {
		const protocols = getSupportedProtocolsByExtension(entry.name)

		for (const protocol of protocols) {
			ret.push(
				jsParseAssetURL(`${protocol}://${entry.relative_path}`)
			)
		}
	}

	return ret
}
