import {
	isExpandableFilePath,
	expandAsyncSyncVariantName,
	expandAsyncSyncVariantFilePath
} from "#~src/v0/utils/index.mts"

import type {
	GenerateFactoryFilesOptions
} from "@fourtune/types/realm-js-and-web/v0/autogenerate"

import path from "node:path"

export type Source = {
	source: string,
	output: {
		factory: string,
		fn: string
	}
}

export type Result = Source|[Source, Source]

export function getPaths(
	options: GenerateFactoryFilesOptions, _auto_src = false
) : Result {
	if (!isExpandableFilePath(options.source_file)) {
		const source = path.normalize(
			path.join(_auto_src ? "#~auto" : "#~src", options.source_file.slice(4))
		)

		const output = {
			fn: path.normalize(
				path.join(
				//	"#~auto",
					options.destination.slice(4),
					`${options.export_name}.mts`
				)
			),

			factory: path.normalize(
				path.join(
				//	"#~auto",
					options.destination.slice(4),
					`${options.export_name}Factory.mts`
				)
			)
		}

		return {source, output}
	}

	const [async_source_file, sync_source_file] = expandAsyncSyncVariantFilePath(
		options.source_file
	)

	const [async_export_name, sync_export_name] = expandAsyncSyncVariantName(
		options.export_name
	)

	return [
		getPaths({
			source_file: async_source_file,
			export_name: async_export_name,
			destination: options.destination
		}, true) as Source,

		getPaths({
			source_file: sync_source_file,
			export_name: sync_export_name,
			destination: options.destination
		}, true) as Source
	]
}
