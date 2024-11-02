import {initializeAssets} from "#~src/init/resources/index.mts"
import {loadResource} from "@fourtune/realm-js/resources"

const getAssetAsURLImplementation = loadResource(
	"tsmodule://getAssetAsURLImplementation.mts"
)

const marker = `bc0f0b62-2d9a-4f26-915f-4c5a78b9a526`

export async function factory(project_root : string) {
	const {assets} = await initializeAssets(project_root)

	let resources_declarations = ``
	let resources_lookup_fn = ``
	let resources_lookup_fn2 = ``
	let index = 0

	for (const resource of assets) {
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
		const resource_meta_data = `${resource.url.length},${resource.url},${resource.data.length};`
		const resource_header = marker + ":" + resource_meta_data.length + ":" + resource_meta_data

		resources_declarations += `const ${var_name}_data = ${JSON.stringify(
			resource_header + resource.data
		)}\n`

		const resource_offset : number = resource_header.length

		resources_declarations += `const ${var_name}_type = ${JSON.stringify(resource.type)}\n`

		resources_lookup_fn += `\tif (url === ${JSON.stringify(resource.url)}) {\n`
		resources_lookup_fn += `\t\treturn ${var_name}_data.slice(${resource_offset});\n`
		resources_lookup_fn += `\t}\n`

		resources_lookup_fn2 += `\tif (url === ${JSON.stringify(resource.url)}) {\n`
		resources_lookup_fn2 += `\t\treturn getAssetAsURLImplementation(url, ${var_name}_data.slice(${resource_offset}), ${var_name}_type);\n`
		resources_lookup_fn2 += `\t}\n`
	}

	return {
		id: "plugin",

		resolveId(id : string) {
			if (id === `\0fourtune:getAssetAsURLImplementation`) {
				return id
			} else if (id === "@fourtune/realm-js/resources") {
				return `\0fourtune:resources`
			}

			return null
		},

		load(id : string) {
			if (id === `\0fourtune:getAssetAsURLImplementation`) {
				return getAssetAsURLImplementation
			} else if (id === `\0fourtune:resources`) {
				return {
					code: `
import {getAssetAsURLImplementation} from "\0fourtune:getAssetAsURLImplementation"

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
