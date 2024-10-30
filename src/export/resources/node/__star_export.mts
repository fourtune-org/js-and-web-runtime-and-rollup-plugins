import {initializeResourcesData} from "#/init/resources/index.mts"
import {loadResourceAsURLImplementation} from "&/loadResourceAsURLImplementation.mts"

const {resources} = await initializeResourcesData(null)

import type {ProjectResource} from "@fourtune/types/realm-js-and-web/resources/v0/"

function _getResourceType(url : string) {
	for (const resource of resources) {
		if (resource.url === url) {
			return resource.type
		}
	}

	throw new Error(`Unable to locate resource "${url}" (dynamic).`)
}

export type * from "@fourtune/types/realm-js-and-web/resources/v0/"

export function loadResource(url : string) : ProjectResource {
	for (const resource of resources) {
		if (resource.url === url) {
			return resource.data
		}
	}

	throw new Error(`Unable to locate resource "${url}" (dynamic).`)
}

export function loadResourceAsURL(url : string) : string {
	return loadResourceAsURLImplementation(
		url, loadResource(url), _getResourceType(url)
	)
}
