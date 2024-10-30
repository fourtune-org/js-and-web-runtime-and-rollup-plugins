import {initializeProjectData} from "#/init/project/index.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/project/v0/"
//-- glue code start ; do not remove or edit this line --//
import type {PackageJSON, FourtuneConfiguration} from "@fourtune/types/realm-js-and-web/project/v0/"

export function getProjectPackageJSON() : PackageJSON {
	return project.package_json
}

export function getFourtuneConfiguration() : FourtuneConfiguration {
	return project.fourtune_configuration
}

export default {
	getProjectPackageJSON,
	getFourtuneConfiguration
}
