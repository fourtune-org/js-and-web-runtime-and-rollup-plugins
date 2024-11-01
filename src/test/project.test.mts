import type {
	ExportObject,
	DefaultExportObject,
} from "@fourtune/types/realm-js-and-web/project/v0/"

import * as project from "#~src/export/project/node/__index.mts"
import def_export from "#~src/export/project/node/__index.mts"

project satisfies ExportObject
def_export satisfies DefaultExportObject
