export default function(level : string) : number {
	const map = {
		"error": 3,
		"warn" : 4,
		"info" : 5,
		"debug": 6,
		"trace": 7
	} as const

	if (level in map) {
		return map[level as keyof typeof map]
	}

	return -1
}
