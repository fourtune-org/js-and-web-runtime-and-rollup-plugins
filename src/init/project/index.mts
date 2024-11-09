import fs from "node:fs/promises"
import path from "node:path"
import resolveProjectRoot from "#~src/resolveProjectRoot.mts"
import type {Project} from "@fourtune/types/realm-js-and-web/v0/project"

export async function initializeProjectData(
	project_root : string | null
) : Promise<Project> {
	project_root = await resolveProjectRoot(project_root)

	const package_json_str = (await fs.readFile(
		path.join(project_root, "package.json")
	)).toString()

	const package_json = JSON.parse(package_json_str)

	const fourtune_configuration = (
		await import(path.join(project_root, "fourtune.config.mjs"))
	).default

	return {
		package_json,
		fourtune_configuration
	}
}
