import type {
	DefaultExportObject as BaseObject,
	JsGetRequestedAssetsFromCodeResult
} from "@fourtune/types/base-realm-js-and-web/v0/"

export async function getListOfUsedProjectAssetsInStaticContext(
	base : BaseObject,
	absolute_path : string
) : Promise<JsGetRequestedAssetsFromCodeResult> {
	const {jsGetRequestedAssetsFromFiles} = base

	return await jsGetRequestedAssetsFromFiles([absolute_path])
}
