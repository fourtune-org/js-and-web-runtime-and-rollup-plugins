import {getPaths, type Source} from "./getPaths.mjs"
import path from "node:path"
import fs from "node:fs/promises"
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

type Result = {
	[key: string]: FourtuneFileGenerator
}

export function _generateFactoryFiles(
	options: GenerateFactoryFilesOptions
) : Result {
	let ret : Result = {}
	const paths = getPaths(options) as Source

	if (options.only_factory_files !== true) {
		ret[paths.output.fn] = async (fourtune_session: FourtuneSession) => {
			const source_code = (await fs.readFile(
				path.join(fourtune_session.getProjectRoot(), options.source_file)
			)).toString()

			const base : BaseObject = await fourtune_session.getDependency("@fourtune/base-realm-js-and-web") as BaseObject

			const {tsGenerateFunctionFactoryCode} = base

			const {fn} = await tsGenerateFunctionFactoryCode(
				paths,
				source_code,
				null
			)

			return fn
		}
	}

	ret[paths.output.factory] = async (fourtune_session) => {
		//todo: use fourtune_session.paths.getBuildPathFromProjectRoot(options.source_file)?

		const source_code = (await fs.readFile(
			path.join(fourtune_session.getProjectRoot(), options.source_file)
		)).toString()

		const base : BaseObject = await fourtune_session.getDependency("@fourtune/base-realm-js-and-web") as BaseObject

		const {tsGenerateFunctionFactoryCode} = base

		const {factory} = await tsGenerateFunctionFactoryCode(
			paths,
			source_code,
			null
		)

		return factory
	}

	return ret
}
