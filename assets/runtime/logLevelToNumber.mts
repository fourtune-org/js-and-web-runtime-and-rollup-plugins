import type {LogLevel} from "@fourtune/types/realm-js-and-web/v0/runtime"

export default function(level : LogLevel) : number {
	const map = {
		"emerg": 1,
		"error": 3,
		"warn" : 4,
		"info" : 5,
		"debug": 6,
		"trace": 7
	}

	if (level in map) {
		return map[level]
	}

	return -1
}
