import type {
	ExportObject,
	DefaultExportObject
} from "@fourtune/types/realm-js-and-web/v0/runtime"

import * as project from "#~src/export/runtime/node/__index.mts"
import def_export from "#~src/export/runtime/node/__index.mts"

project satisfies ExportObject
def_export satisfies DefaultExportObject
