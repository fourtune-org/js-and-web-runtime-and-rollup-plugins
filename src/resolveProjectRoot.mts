import path from "node:path"
import process from "node:process"
import {findNearestFile} from "@anio-software/fs"

const input_file = process.argv[1]

const fourtune_config_file = await findNearestFile(
	"fourtune.config.mjs", path.dirname(input_file)
)

export default async function(project_root : string|null) {
	if (project_root !== null) {
		return project_root
	}

	if (fourtune_config_file === false) {
		throw new Error(`Wasn't able to determine fourtune project root.`)
	}

	return path.dirname(fourtune_config_file)
}
