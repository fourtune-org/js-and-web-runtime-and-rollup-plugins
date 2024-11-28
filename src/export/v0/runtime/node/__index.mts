import {initializeProjectData} from "#~src/v0/init/project/index.mts"

import initializeRuntime from "#~assets/runtime/initializeRuntime.mts"

const project = await initializeProjectData(null)

export type * from "@fourtune/types/realm-js-and-web/v0/runtime"
//-- glue code start ; do not remove or edit this line --//
const {
	createContext
} = initializeRuntime(project)

export {
	createContext
}

export default {
	createContext
}
