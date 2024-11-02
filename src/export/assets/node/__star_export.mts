import {initializeAssets} from "#~src/init/assets/index.mts"
import {getAssetAsURLImplementation} from "#~assets/getAssetAsURLImplementation.mts"

const {assets} = await initializeAssets(null)

import type {ProjectAsset} from "@fourtune/types/realm-js-and-web/assets/v0/"

function _getAssetType(url : string) {
	for (const asset of assets) {
		if (asset.url === url) {
			return asset.type
		}
	}

	throw new Error(`Unable to locate asset "${url}" (dynamic).`)
}

export type * from "@fourtune/types/realm-js-and-web/assets/v0/"

export function loadResource(url : string) : ProjectAsset {
	for (const asset of assets) {
		if (asset.url === url) {
			return asset.data
		}
	}

	throw new Error(`Unable to locate asset "${url}" (dynamic).`)
}

export function loadResourceAsURL(url : string) : string {
	return getAssetAsURLImplementation(
		url, loadResource(url), _getAssetType(url)
	)
}
