import type {LogLevel} from "@fourtune/types/realm-js-and-web/v0/runtime"

export default function(level : LogLevel) : number {
	const map = {
		// uint16 max 65535
		"emerg": 60000,
		"error": 50000,
		"warn" : 40000,
		"info" : 30000,
		"debug": 20000,
		"trace": 10000
	}

	if (level in map) {
		return map[level]
	}

	return -1
}
