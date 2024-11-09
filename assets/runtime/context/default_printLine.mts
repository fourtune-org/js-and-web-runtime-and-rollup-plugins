import type {
	ContextInstance
} from "@fourtune/types/realm-js-and-web/v0/runtime"

export default function(
	context: ContextInstance,
	line : string
) {
	if (typeof process === "object") {
		process.stderr.write(`${line}\n`)
	} else if (typeof console === "object") {
		console.log(line)
	}
}
