import {initializeAssets} from "#~src/init/assets/index.mts"
import {getAsset} from "@fourtune/realm-js/assets"

const getAssetAsURLImplementation = getAsset(
	"tsmodule://getAssetAsURLImplementation.mts"
)

const marker = `bc0f0b62-2d9a-4f26-915f-4c5a78b9a526`

export async function factory(project_root : string) {
	const {assets} = await initializeAssets(project_root)

	let assets_declarations = ``
	let assets_lookup_fn = ``
	let assets_lookup_fn2 = ``
	let index = 0

	for (const asset of assets) {
		let var_name = asset.url

		var_name  = var_name.split("/").join("_s_")
		var_name  = var_name.split(".").join("_d_")
		var_name  = var_name.split(":").join("_c_")
		var_name  = var_name.split("@").join("_at_")
		var_name += "_" + (index++)

		//
		// declaration like this allows rollup to
		// remove assets that are not loaded in
		//
		const asset_meta_data = `${asset.url.length},${asset.url},${asset.data.length};`
		const asset_header = marker + ":" + asset_meta_data.length + ":" + asset_meta_data

		assets_declarations += `const ${var_name}_data = ${JSON.stringify(
			asset_header + asset.data
		)}\n`

		const asset_offset : number = asset_header.length

		assets_declarations += `const ${var_name}_type = ${JSON.stringify(asset.type)}\n`

		assets_lookup_fn += `\tif (url === ${JSON.stringify(asset.url)}) {\n`
		assets_lookup_fn += `\t\treturn ${var_name}_data.slice(${asset_offset});\n`
		assets_lookup_fn += `\t}\n`

		assets_lookup_fn2 += `\tif (url === ${JSON.stringify(asset.url)}) {\n`
		assets_lookup_fn2 += `\t\treturn getAssetAsURLImplementation(url, ${var_name}_data.slice(${asset_offset}), ${var_name}_type);\n`
		assets_lookup_fn2 += `\t}\n`
	}

	return {
		id: "plugin",

		resolveId(id : string) {
			if (id === `\0fourtune:getAssetAsURLImplementation`) {
				return id
			} else if (id === "@fourtune/realm-js/assets") {
				return `\0fourtune:assets`
			}

			return null
		},

		load(id : string) {
			if (id === `\0fourtune:getAssetAsURLImplementation`) {
				return getAssetAsURLImplementation
			} else if (id === `\0fourtune:assets`) {
				return {
					code: `
import {getAssetAsURLImplementation} from "\0fourtune:getAssetAsURLImplementation"

${assets_declarations}

export function getAsset(url) {
${assets_lookup_fn}

	throw new Error(
		\`Unable to locate asset "\${url}" (static).\`
	)
}

export function getAssetAsURL(url) {
${assets_lookup_fn2}
	throw new Error(
		\`Unable to locate asset "\${url}" (static).\`
	)
}
`
				}
			}

			return null
		}
	}
}
