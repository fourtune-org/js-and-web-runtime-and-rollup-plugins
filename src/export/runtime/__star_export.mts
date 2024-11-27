import type {
	UseContext,
	GetVersionOfContext,
	RuntimeWrappedContextInstance
} from "@fourtune/types/realm-js-and-web/runtime"

export type * from "@fourtune/types/realm-js-and-web/runtime"

export const useContext : UseContext = (function(
	ctx: RuntimeWrappedContextInstance,
	version: number
) : unknown {
	const actual = ctx._version

	if (actual !== version) {
		throw new Error(
			`Incompatible version, expected v${version} but got v${actual}.`
		)
	}

	return ctx._instance
}) as UseContext

export const getVersionOfContext : GetVersionOfContext = (function(
	ctx: RuntimeWrappedContextInstance
) {
	return {
		major: ctx._version,
		revision: ctx._revision
	}
})
