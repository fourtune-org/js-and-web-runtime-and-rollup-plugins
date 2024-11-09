import {initializeProjectData} from "#~src/init/project/index.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/v0/project"
//-- glue code start ; do not remove or edit this line --//
import type {PackageJSON, FourtuneConfiguration} from "@fourtune/types/realm-js-and-web/v0/project"

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
