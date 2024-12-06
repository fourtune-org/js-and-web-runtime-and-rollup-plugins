import fs from "node:fs"

import {_expandAsyncSyncVariantSourceCodeFromString} from "./_expandAsyncSyncVariantSourceCodeFromString.mts"

export function expandAsyncSyncVariantSourceCode(
	source_path: string,
	variant: "async" | "sync"
) : string {
	const contents = fs.readFileSync(source_path).toString()

	return _expandAsyncSyncVariantSourceCodeFromString(
		contents, variant, source_path
	)
}
