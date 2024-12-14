import type {
	LogLevel,
	ContextInstance,
	ContextOptionsLogWithLevel as Impl
} from "@fourtune/types/realm-js-and-web/v0/runtime"

const impl : Impl = function(
	context: ContextInstance,
	level : LogLevel,
	lines : string[]
) {
	const tag = context.options.tag
	const pkg = context.__internal_do_not_use.origin_package

	const should_log_result = context.options.shouldLog(context, level, pkg, tag)

	if (should_log_result === null) {
		if (context.defaults.shouldLog(context, level, pkg, tag) !== true) {
			return
		}
	} else if (should_log_result !== true) {
		return
	}

	let pkg_name = `<${pkg.name}>`

	if (pkg.name !== context.project.package_json.name) {
		pkg_name = `<${context.project.package_json.name}> (${pkg.name})`
	}

	// todo: add bundle identifier?
	let first_line = `[${level.padStart(5, " ")}] ${pkg_name} `
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

	context.options.printLine(
		context, str.slice(0, str.length - 1)
	)
}

export default impl
