import {
	loadResource, loadResourceAsURL
} from "@fourtune/realm-js/resources"

//console.log(createDefaultContext()._instance)
console.log(loadResource("tsmodule://a.mts"))
console.log(loadResourceAsURL("tsmodule://a.mts"))
console.log(loadResourceAsURL("tsmodule://a.mts"))
console.log(loadResourceAsURL("tsmodule://a.mts"))
