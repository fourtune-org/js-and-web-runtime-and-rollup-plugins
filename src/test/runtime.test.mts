import type {
	ExportObject,
	DefaultExportObject
} from "@fourtune/types/realm-js-and-web/runtime/v0/"

import * as project from "#/export/runtime/node/__index.mts"
import def_export from "#/export/runtime/node/__index.mts"

project satisfies ExportObject
def_export satisfies DefaultExportObject
