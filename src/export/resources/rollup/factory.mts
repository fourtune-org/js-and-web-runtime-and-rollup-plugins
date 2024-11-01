import {initializeResourcesData} from "#~src/init/resources/index.mts"
import {loadResource} from "@fourtune/realm-js/api"

const loadResourceAsURLImplementation = loadResource(
	"tsmodule://loadResourceAsURLImplementation.mts"
)

export async function factory(project_root : string) {
	const {resources} = await initializeResourcesData(project_root)

	let resources_declarations = ``
	let resources_lookup_fn = ``
	let resources_lookup_fn2 = ``
	let index = 0

	for (const resource of resources) {
		let var_name = resource.url

		var_name  = var_name.split("/").join("_s_")
		var_name  = var_name.split(".").join("_d_")
		var_name  = var_name.split(":").join("_c_")
		var_name  = var_name.split("@").join("_at_")
		var_name += "_" + (index++)

		//
		// declaration like this allows rollup to
		// remove resources that are not loaded in
		//
		resources_declarations += `const ${var_name}_data = ${JSON.stringify(resource.data)}\n`
		resources_declarations += `const ${var_name}_type = ${JSON.stringify(resource.type)}\n`

		resources_lookup_fn += `\tif (url === ${JSON.stringify(resource.url)}) {\n`
		resources_lookup_fn += `\t\treturn ${var_name}_data;\n`
		resources_lookup_fn += `\t}\n`

		resources_lookup_fn2 += `\tif (url === ${JSON.stringify(resource.url)}) {\n`
		resources_lookup_fn2 += `\t\treturn loadResourceAsURLImplementation(url, ${var_name}_data, ${var_name}_type);\n`
		resources_lookup_fn2 += `\t}\n`
	}

	return {
		id: "plugin",

		resolveId(id : string) {
			if (id === `\0fourtune:loadResourceAsURLImplementation`) {
				return id
			} else if (id === "@fourtune/realm-js/resources") {
				return `\0fourtune:resources`
			}

			return null
		},

		load(id : string) {
			if (id === `\0fourtune:loadResourceAsURLImplementation`) {
				return loadResourceAsURLImplementation
			} else if (id === `\0fourtune:resources`) {
				return {
					code: `
import {loadResourceAsURLImplementation} from "\0fourtune:loadResourceAsURLImplementation"

${resources_declarations}

export function loadResource(url) {
${resources_lookup_fn}

	throw new Error(
		\`Unable to locate resource "\${url}" (static).\`
	)
}

export function loadResourceAsURL(url) {
${resources_lookup_fn2}
	throw new Error(
		\`Unable to locate resource "\${url}" (static).\`
	)
}
`
				}
			}

			return null
		}
	}
}
