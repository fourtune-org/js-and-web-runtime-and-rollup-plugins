//
// this is both used by the normal rollup plugin and
// rollup plugin specificially for assets
//
import {getAsset} from "@fourtune/realm-js/v0/assets"

const getAssetAsURLImplementation = getAsset(
	"js-bundle://getAssetAsURLImplementation.mts"
)

import type {Asset} from "../Asset.d.mts"

import {assetsToVirtualModuleCode} from "./assetsToVirtualModuleCode.mts"

export async function pluginFactory(
	assets: Asset[], plugin_id : string
) {
	return {
		id: plugin_id,

		resolveId(id : string) {
			if (id === `\0fourtune:getAssetAsURLImplementation`) {
				return id
			} else if (id === "@fourtune/realm-js/v0/assets") {
				return `\0fourtune:assets`
			}

			return null
		},

		load(id: string) {
			if (id === `\0fourtune:getAssetAsURLImplementation`) {
				return getAssetAsURLImplementation
			} else if (id === `\0fourtune:assets`) {
				return assetsToVirtualModuleCode(assets)
			}

			return null
		}
	}
}
