import {initializeProjectData} from "#~src/init/project/index.mts"

import initializeRuntime from "#~assets/runtime/initializeRuntime.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/v0/runtime"
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
