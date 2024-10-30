import {initializeProjectData} from "#/init/project/index.mts"

import initializeRuntime from "&/runtime/initializeRuntime.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/runtime/v0/"
//-- glue code start ; do not remove or edit this line --//
const {
	createDefaultContext,
	getRuntimeVersion,
	useContext
} = initializeRuntime(project)

export {
	createDefaultContext,
	getRuntimeVersion,
	useContext
}

export default {
	createDefaultContext,
	getRuntimeVersion,
	useContext
}
