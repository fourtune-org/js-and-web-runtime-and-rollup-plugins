import {initializeProjectData} from "#~src/v0/init/project/index.mts"
import gluecode from "#~auto/project_gluecode.mts"

export async function factory(project_root : string) {
	const project = await initializeProjectData(project_root)

	return {
		id: "plugin",

		resolveId(id : string) {
			if (id === "@fourtune/realm-js/v0/project") {
				return `\0fourtune:project`
			}

			return null
		},

		load(id : string) {
			if (id === `\0fourtune:project`) {
				return `
const project = ${JSON.stringify(project)}

${gluecode}
`
			}

			return null
		}
	}
}
