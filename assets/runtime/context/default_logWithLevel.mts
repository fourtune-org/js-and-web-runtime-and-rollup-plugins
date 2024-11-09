import type {LogLevel} from "@fourtune/types/realm-js-and-web/v0/runtime"
import type {ContextInstance} from "@fourtune/types/realm-js-and-web/v0/runtime"

export default function(
	this: ContextInstance,
	level : LogLevel,
	lines : string[]
) {
	const package_name = this.project.package_json.name

	if (!this.options.shouldLog.call(this, level, package_name, "")) {
		return
	}

	// todo: add bundle identifier?
	let first_line = `[${level.padStart(5, " ")}] <${package_name}> `
	let padding = " ".repeat(first_line.length)

	const log_message = lines.map(arg => {
		return arg.toString()
	}).join("\n")

	const log_lines = log_message.split("\n")

	let str = ``

	for (let i = 0; i < log_lines.length; ++i) {
		let current_line = padding

		if (i === 0) {
			current_line = first_line
		}

		current_line += log_lines[i]

		str += `${current_line}\n`
	}

	this.options.printLine.call(
		this, str.slice(0, str.length - 1)
	)
}
