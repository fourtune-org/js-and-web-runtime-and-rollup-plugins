import type {
	DefaultExportObject as BaseObject
} from "@fourtune/types/base-realm-js-and-web/v0/"

import fs from "node:fs/promises"
import {scandir} from "@anio-fs/scandir"
import path from "node:path"

export async function getListOfUsedProjectAssets(
	base : BaseObject, project_root : string
) : Promise<false|Map<string, 1>> {
	let ret = new Map()

	const source_files = (await scandir(
		path.join(project_root, "src"), {
			async filter(entry) {
				if (entry.type !== "regularFile") return false

				if (entry.name.endsWith(".d.mts")) return false

				return entry.name.endsWith(".mts")
			}
		}
	)) ?? []

	for (const source_file of source_files) {
		let code = (await fs.readFile(source_file.absolute_path)).toString()

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
	}

	return ret
}
