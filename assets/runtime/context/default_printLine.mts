import type {
	ContextInstance,
	ContextOptionsPrintLine as Impl
} from "@fourtune/types/realm-js-and-web/v0/runtime"

const impl : Impl = function(
	context: ContextInstance,
	line : string
) {
	if (typeof process === "object") {
		process.stderr.write(`${line}\n`)
	} else if (typeof console === "object") {
		console.log(line)
	}
}

export default impl
