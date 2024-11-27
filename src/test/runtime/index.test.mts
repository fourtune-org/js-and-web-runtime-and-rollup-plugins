import type {
	ExportObject
} from "@fourtune/types/realm-js-and-web/runtime"

import {useContext} from "#~src/export/runtime/useContext.mts"

useContext satisfies ExportObject["useContext"]
