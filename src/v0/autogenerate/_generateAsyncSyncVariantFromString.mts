import path from "node:path"
import {
	expandAsyncSyncVariantFilePath
} from "#~src/v0/utils/index.mts"

function removeFileExtension(file_name: string) {
	if (file_name.endsWith(".d.mts")) {
		return file_name.slice(0, -6)
	} else if (file_name.endsWith(".mts")) {
		return file_name.slice(0, -4)
	}

	return file_name
}

export function _generateAsyncSyncVariantFromString(
	source: string,
	variant: "async" | "sync",
	source_file_path?: string
) : string {
	const lines = source.toString().split("\n")

	let output = []

	for (let i = 0; i < lines.length; ++i) {
		const line = lines[i]
		const next_line = (lines.length > (i + 1)) ? lines[i + 1] : null

		if (next_line === null) {
			output.push(line)

			continue
		}

		if (!line.startsWith("//") && next_line.startsWith("//>")) {
			output.push(
				variant === "sync" ? next_line.slice(3) : line
			)
			++i

			continue
		}

		output.push(line)
	}

	if (!source_file_path) {
		return output.join("\n")
	}

	//
	// replace __XX__ with the expanded file name (minus the extension)
	//
	const [
		async_file_path,
		sync_file_path
	] = expandAsyncSyncVariantFilePath(source_file_path)

	return output.join("\n").split("__XX__").join(
		removeFileExtension(
			path.basename(variant === "async" ? async_file_path : sync_file_path)
		)
	)
}
