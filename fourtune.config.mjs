import path from "node:path"
import fs from "node:fs/promises"

const glue_code_start_line = `//-- glue code start ; do not remove or edit this line --//`

async function createGlueCodeFromFile(fourtune_session, file) {
	const contents = (await fs.readFile(
		path.join(fourtune_session.getProjectRoot(), file)
	)).toString()

	const lines = contents.split("\n")
	let glue_code = []
	let glue_code_start = false

	for (const line of lines) {
		if (line === glue_code_start_line) {
			glue_code_start = true
		} else if (glue_code_start) {
			glue_code.push(line)
		}
	}

	const {tsStripTypesFromCode} = await fourtune_session.getDependency(
		"@fourtune/base-realm-js-and-web"
	)

	return `export default ${JSON.stringify(await tsStripTypesFromCode(glue_code.join("\n")), null, 4)}\n`
}

export default {
	realm: "js",
	type: "package",

	autogenerate: {
		"src/project_gluecode.mts": async function(fourtune_session) {
			const file = path.join("src", "export", "v0", "project", "node", "__index.mts")

			return await createGlueCodeFromFile(fourtune_session, file)
		},

		"src/runtime_gluecode.mts": async function(fourtune_session) {
			const file = path.join("src", "export", "v0", "runtime", "node", "__index.mts")

			return await createGlueCodeFromFile(fourtune_session, file)
		}
	}
}
