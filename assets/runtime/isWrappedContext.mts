import type {UserContext} from "@fourtune/types/realm-js-and-web/v0/runtime"

export default function(val : UserContext) {
	if (!("_version" in val)) {
		return false
	}

	if (!("_instance" in val)) {
		return false
	}

	return true
}
