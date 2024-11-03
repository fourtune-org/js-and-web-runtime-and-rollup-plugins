import {initializeAssets} from "#~src/init/assets/index.mts"
import {pluginFactory} from "#~src/init/assets/rollup/pluginFactory.mjs"

type AssetReporter = (
	assets: {
		url : string,
		size : number
	}[],
	included_all_assets: boolean
) => any

export async function factory(
	project_root : string,
	asset_reporter? : AssetReporter|null
) {
	const {assets, included_all_assets} = await initializeAssets(project_root)

	if (typeof asset_reporter === "function") {
		await asset_reporter(
			assets.map(({url, data}) => {
				return {
					url,
					size: data.length
				}
			}), included_all_assets
		)
	}

	return await pluginFactory(
		assets, "rollup-plugin-fourtune-assets"
	)
}
