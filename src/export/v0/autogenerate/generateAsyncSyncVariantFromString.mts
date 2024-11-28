import type {
	FourtuneSession,
	FourtuneFileGenerator
} from "@fourtune/types/fourtune/v0"

import {_generateAsyncSyncVariantFromString} from "#~src/autogenerate/_generateAsyncSyncVariantFromString.mts"

export function generateAsyncSyncVariantFromString(
	code: string,
	variant: "async"|"sync",
	file_name?: string
) : FourtuneFileGenerator {
	return async function(f: FourtuneSession) : Promise<string> {
		return _generateAsyncSyncVariantFromString(code, variant)
	}
}
