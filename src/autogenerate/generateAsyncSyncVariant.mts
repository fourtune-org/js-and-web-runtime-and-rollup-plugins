import type {
	FourtuneSession,
	FourtuneFileGenerator
} from "@fourtune/types/fourtune/v0"

import path from "node:path"
import fs from "node:fs/promises"

import {_generateAsyncSyncVariantFromString} from "#~src/autogenerate/_generateAsyncSyncVariantFromString.mts"

export function generateAsyncSyncVariant(
	source_path: string,
	variant: "async" | "sync"
) : FourtuneFileGenerator {
	return async function(f: FourtuneSession) : Promise<string> {
		const contents = (await fs.readFile(
			path.join(
				f.getProjectRoot(), source_path
			)
		)).toString()

		return _generateAsyncSyncVariantFromString(
			contents, variant
		)
	}
}
