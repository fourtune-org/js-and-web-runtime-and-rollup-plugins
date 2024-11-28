import type {
	DefaultExportObject as BaseObject
} from "@fourtune/types/base-realm-js-and-web/v0/"

import {scandir} from "@anio-fs/scandir"
import path from "node:path"

import type {
	JsGetRequestedAssetsFromCodeResult
} from "@fourtune/types/base-realm-js-and-web/v0/"

export async function getListOfUsedProjectAssets(
	base : BaseObject, project_root : string
) : Promise<JsGetRequestedAssetsFromCodeResult> {
	const entries = (await scandir(
		path.join(project_root, "src"), {
			async filter(entry) {
				if (entry.type !== "regularFile") return false

				if (entry.name.endsWith(".d.mts")) return false

				return entry.name.endsWith(".mts")
			}
		}
	)) ?? []

	const source_files = entries.map(entry => {
		return entry.absolute_path
	})

	const {jsGetRequestedAssetsFromFiles} = base

	return await jsGetRequestedAssetsFromFiles(source_files)
}
