// @ts-ignore:next-line
import createTemporaryResource from "@anio-js-foundation/create-temporary-resource"
import type {ProjectResource} from "@fourtune/types/realm-js-and-web/resources/v0/"

const cache = new Map()

export function getAssetAsURLImplementation(
	url : string, resource : ProjectResource, resource_type : string
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
