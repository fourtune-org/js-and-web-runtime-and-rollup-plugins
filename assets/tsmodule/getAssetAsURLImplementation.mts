// @ts-ignore:next-line
import createTemporaryResource from "@anio-js-foundation/create-temporary-resource"
import type {ProjectAsset} from "@fourtune/types/realm-js-and-web/assets/v0/"

const cache = new Map()

export function getAssetAsURLImplementation(
	url : string, resource : ProjectAsset, resource_type : string
) {
	if (cache.has(url)) {
		return cache.get(url)
	}

	let content_type = "text/plain"

	if (resource_type === "tsmodule") {
		content_type = "text/javascript"
	}

	const {location} = createTemporaryResource(
		resource, {
			type: content_type
		}
	)

	cache.set(url, location)

	return location
}
