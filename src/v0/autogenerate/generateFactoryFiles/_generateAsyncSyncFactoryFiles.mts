import {getPaths, type Source, type Result as Paths} from "./getPaths.mts"
import type {
	GenerateFactoryFilesOptions
} from "@fourtune/types/realm-js-and-web/v0/autogenerate"

import type {
	FourtuneFileGenerator,
	FourtuneSession
} from "@fourtune/types/fourtune/v0"

import {generateAsyncSyncVariant} from "#~src/v0/autogenerate/generateAsyncSyncVariant.mts"

function generateFunctionFileFactory(
	options: GenerateFactoryFilesOptions,
	paths: Paths,
	variant: "async" | "sync"
) : FourtuneFileGenerator {
	return async (fourtune_session: FourtuneSession) => {
		// NB: we must create our own version of async/sync
		// since we would be potentially using outdated code
		// (e.g. if we read the code from the file system (auto/src/ folder))
		const generate = generateAsyncSyncVariant(options.source_file, variant)
		const source = await generate(fourtune_session, variant)
		const base = await fourtune_session.getDependency("@fourtune/base-realm-js-and-web")

		const {tsGenerateFunctionFactoryCode} = base

		const {fn} = await tsGenerateFunctionFactoryCode(
			paths,
			source,
			variant === "async"
		)

		return fn
	}
}

function generateFactoryFileFactory(
	options: GenerateFactoryFilesOptions,
	paths: Paths,
	variant: "async" | "sync"
) : FourtuneFileGenerator {
	return async (fourtune_session: FourtuneSession) => {
		// NB: we must create our own version of async/sync
		// since we would be potentially using outdated code
		// (e.g. if we read the code from the file system (auto/src/ folder))
		const generate = generateAsyncSyncVariant(options.source_file, variant)
		const source = await generate(fourtune_session, variant)
		const base = await fourtune_session.getDependency("@fourtune/base-realm-js-and-web")

		const {tsGenerateFunctionFactoryCode} = base

		const {factory} = await tsGenerateFunctionFactoryCode(
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