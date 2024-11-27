import {initializeAssets} from "#~src/init/v0/assets/index.mts"
import {pluginFactory} from "#~src/init/v0/assets/rollup/pluginFactory.mjs"

type AssetReporter = (
	assets: {
		url : string,
		size : number
	}[],
	included_all_assets: boolean,
	reason: string
) => any

export async function factory(
	project_root : string,
	asset_reporter? : AssetReporter|null
) {
	const assets = await initializeAssets(project_root)

	if (typeof asset_reporter === "function") {
		const reason = ("reason" in assets) ? assets.reason : ""

		await asset_reporter(
			assets.list.map(({url, data}) => {
				return {
					url,
					size: data.length
				}
			}), assets.included_all_assets, reason
		)
	}

	return await pluginFactory(
		assets.list, "rollup-plugin-fourtune-assets"
	)
}
