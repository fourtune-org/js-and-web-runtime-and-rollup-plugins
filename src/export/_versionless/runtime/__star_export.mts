import type {
	UseContext,
	GetContextMetaData,
	RuntimeWrappedContextInstance
} from "@fourtune/types/realm-js-and-web/_versionless/runtime"

export type * from "@fourtune/types/realm-js-and-web/_versionless/runtime"

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

	(ctx._instance as any).__internal_do_not_use = {
		origin_package: ctx._package
	}

	return ctx._instance
}) as UseContext

export const getContextMetaData : GetContextMetaData = (function(
	ctx: RuntimeWrappedContextInstance
) {
	return {
		version: {
			major: ctx._version,
			revision: ctx._revision
		},
		package: ctx._package
	}
})
