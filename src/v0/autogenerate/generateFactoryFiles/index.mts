import path from "node:path"

import type {
	GenerateFactoryFilesOptions
} from "@fourtune/types/realm-js-and-web/v0/autogenerate"

import type {
	FourtuneFileGenerator
} from "@fourtune/types/fourtune/v0"

import {
	isExpandableName,
	isExpandableFilePath
} from "#~src/v0/utils/index.mts"

import {_generateAsyncSyncFactoryFiles} from "./_generateAsyncSyncFactoryFiles.mts"
import {_generateFactoryFiles} from "./_generateFactoryFiles.mts"

type Result = {
	[key: string]: FourtuneFileGenerator
}

function appendSrc(files: Result) {
	let ret : Result = {}

	for (const file in files) {
		ret[path.join("src", file)] = files[file]
	}

	return ret
}

export function generateFactoryFiles(
	options: GenerateFactoryFilesOptions
) {
	const required_options = ["source_file", "export_name", "destination"]

	for (const o of required_options) {
		if (!(o in options)) {
			throw new Error(`Required option '${o}' not set.`)
		}
	}

	if (!options.source_file.startsWith("src/")) {
		throw new Error(`source file must be inside src/.`)
	} else if (!options.destination.startsWith("src/")) {
		throw new Error(`destination must start with src/.`)
	}

	let files = {}

	//
	// if input source file is an async/sync variant file
	// export_name **must** also be expandable
	//
	if (isExpandableFilePath(options.source_file)) {
		if (!isExpandableName(options.export_name)) {
			throw new Error(
				`Cannot have async/sync variant source without expandable export_name.`
			)
		}

		files = _generateAsyncSyncFactoryFiles(options)
	} else {
		files = _generateFactoryFiles(options)
	}

	return appendSrc(files)
}
