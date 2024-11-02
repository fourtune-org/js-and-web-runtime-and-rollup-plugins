import {initializeAssets} from "#~src/init/resources/index.mts"
import {loadResourceAsURLImplementation} from "#~assets/loadResourceAsURLImplementation.mts"

const {assets} = await initializeAssets(null)

import type {ProjectResource} from "@fourtune/types/realm-js-and-web/resources/v0/"

function _getAssetType(url : string) {
	for (const asset of assets) {
		if (asset.url === url) {
			return asset.type
		}
	}

	throw new Error(`Unable to locate asset "${url}" (dynamic).`)
}

export type * from "@fourtune/types/realm-js-and-web/resources/v0/"

export function loadResource(url : string) : ProjectResource {
	for (const asset of assets) {
		if (asset.url === url) {
			return asset.data
		}
	}

	throw new Error(`Unable to locate asset "${url}" (dynamic).`)
}

export function loadResourceAsURL(url : string) : string {
	return loadResourceAsURLImplementation(
		url, loadResource(url), _getAssetType(url)
	)
}
