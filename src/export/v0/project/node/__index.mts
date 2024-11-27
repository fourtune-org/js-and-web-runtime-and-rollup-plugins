import {initializeProjectData} from "#~src/init/v0/project/index.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/v0/project"
//-- glue code start ; do not remove or edit this line --//
import type {PackageJSON, FourtuneConfiguration, Project} from "@fourtune/types/realm-js-and-web/v0/project"

export function getProjectPackageJSON() : PackageJSON {
	return project.package_json
}

export function getFourtuneConfiguration() : FourtuneConfiguration {
	return project.fourtune_configuration
}

export function getProject() : Project {
	return {
		package_json: getProjectPackageJSON(),
		fourtune_configuration: getFourtuneConfiguration()
	}
}

export default {
	getProjectPackageJSON,
	getFourtuneConfiguration,
	getProject
}
