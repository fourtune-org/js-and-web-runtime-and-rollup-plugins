import {_expandAsyncSyncVariantSourceCodeFromString} from "./_expandAsyncSyncVariantSourceCodeFromString.mts"

export function expandAsyncSyncVariantSourceCodeFromString(
	code: string,
	variant: "async"|"sync",
	file_name?: string
) : string {
	return _expandAsyncSyncVariantSourceCodeFromString(code, variant, file_name)
}
