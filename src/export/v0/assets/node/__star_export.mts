import {initializeAssets} from "#~src/v0/init/assets/index.mts"
import {getAssetAsURLImplementation} from "#~assets/getAssetAsURLImplementation.mts"

const assets = await initializeAssets(null)

import type {ProjectAsset} from "@fourtune/types/realm-js-and-web/v0/assets"

function _getAssetType(url : string) {
	for (const asset of assets.list) {
		if (asset.url === url) {
			return asset.type
		}
	}

	throw new Error(`Unable to locate asset "${url}" (dynamic).`)
}

export type * from "@fourtune/types/realm-js-and-web/v0/assets"

export function getAsset(url : string) : ProjectAsset {
	for (const asset of assets.list) {
		if (asset.url === url) {
			return asset.data
		}
	}

	throw new Error(`Unable to locate asset "${url}" (dynamic).`)
}

export function getAssetAsURL(url : string) : string {
	return getAssetAsURLImplementation(
		url, getAsset(url), _getAssetType(url)
	)
}
