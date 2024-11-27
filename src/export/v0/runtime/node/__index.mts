import {initializeProjectData} from "#~src/init/v0/project/index.mts"

import initializeRuntime from "#~assets/runtime/initializeRuntime.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/v0/runtime"
//-- glue code start ; do not remove or edit this line --//
const {
	createDefaultContext
} = initializeRuntime(project)

export {
	createDefaultContext
}

export default {
	createDefaultContext
}
