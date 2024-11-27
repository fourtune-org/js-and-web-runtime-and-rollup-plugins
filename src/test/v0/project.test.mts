import type {
	ExportObject,
	DefaultExportObject,
} from "@fourtune/types/realm-js-and-web/v0/project"

import * as project from "#~src/export/v0/project/node/__index.mts"
import def_export from "#~src/export/v0/project/node/__index.mts"

project satisfies ExportObject
def_export satisfies DefaultExportObject
