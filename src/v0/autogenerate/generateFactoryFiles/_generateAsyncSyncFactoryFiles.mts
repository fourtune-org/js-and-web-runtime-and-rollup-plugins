import path from "node:path"
import {getPaths, type Source} from "./getPaths.mts"
import type {
	GenerateFactoryFilesOptions
} from "@fourtune/types/realm-js-and-web/v0/autogenerate"

import type {
	DefaultExportObject as BaseObject
} from "@fourtune/types/base-realm-js-and-web/v0"

import type {
	FourtuneFileGenerator,
	FourtuneSession
} from "@fourtune/types/fourtune/v0"

import {expandAsyncSyncVariantSourceFile} from "#~src/v0/utils/expandAsyncSyncVariantSourceFile.mts"

function generateFunctionFileFactory(
	options: GenerateFactoryFilesOptions,
	paths: Source,
	variant: "async" | "sync"
) : FourtuneFileGenerator {
	return async (fourtune_session: FourtuneSession) => {
		// NB: we must create our own version of async/sync
		// since we would be potentially using outdated code
		// (e.g. if we read the code from the file system (auto/src/ folder))
		const source = expandAsyncSyncVariantSourceFile(
			path.join(fourtune_session.getProjectRoot(), options.source_file), variant
		)

		const base : BaseObject = fourtune_session.getDependency("@fourtune/base-realm-js-and-web") as BaseObject

		const {tsGenerateFunctionFactoryCodeForRealmJSAndWebV0} = base

		const {fn} = await tsGenerateFunctionFactoryCodeForRealmJSAndWebV0(
			fourtune_session.getProjectRoot(),
			paths,
			source,
			variant === "async"
		)

		return fn
	}
}

function generateFactoryFileFactory(
	options: GenerateFactoryFilesOptions,
	paths: Source,
	variant: "async" | "sync"
) : FourtuneFileGenerator {
	return async (fourtune_session: FourtuneSession) => {
		// NB: we must create our own version of async/sync
		// since we would be potentially using outdated code
		// (e.g. if we read the code from the file system (auto/src/ folder))
		const source = expandAsyncSyncVariantSourceFile(
			path.join(fourtune_session.getProjectRoot(), options.source_file), variant
		)

		const base : BaseObject = fourtune_session.getDependency("@fourtune/base-realm-js-and-web") as BaseObject

		const {tsGenerateFunctionFactoryCodeForRealmJSAndWebV0} = base

		const {factory} = await tsGenerateFunctionFactoryCodeForRealmJSAndWebV0(
			fourtune_session.getProjectRoot(),
			paths,
			source,
			variant === "async"
		)

		return factory
	}
}

type Result = {
	[key: string]: FourtuneFileGenerator
}

export function _generateAsyncSyncFactoryFiles(
	options: GenerateFactoryFilesOptions
) : Result {
	let ret : Result= {}

	const [async_paths, sync_paths] = getPaths(options) as [Source, Source]

	if (options.only_factory_files !== true) {
		ret[async_paths.output.fn] = generateFunctionFileFactory(
			options, async_paths, "async"
		)

		ret[sync_paths.output.fn] = generateFunctionFileFactory(
			options, sync_paths, "sync"
		)
	}

	ret[async_paths.output.factory] = generateFactoryFileFactory(
		options, async_paths, "async"
	)

	ret[sync_paths.output.factory] = generateFactoryFileFactory(
		options, sync_paths, "sync"
	)

	return ret
}
