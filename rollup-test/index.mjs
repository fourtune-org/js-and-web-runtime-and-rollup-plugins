import fs from "node:fs/promises"

import {
	factory as projectPluginFactory
} from "../dist/project.rollup/index.mjs"

import {
	factory as assetsPluginFactory
} from "../dist/assets.rollup/index.mjs"

import {factory} from "../dist/runtime.rollup/index.mjs"

import {rollup} from "/tmp/pl/node_modules/rollup/dist/rollup.js"

const bundle = await rollup({
	input: "/tmp/pl/src/myfile.mts",
	output: {
		file: "/tmp/p.mjs",
		format: "es"
	},
	plugins:[
		await projectPluginFactory("/tmp/pl/"),
		await assetsPluginFactory("/tmp/pl/"),
		await factory("/tmp/pl/")
	],
	treeshake: true
})

const {output} = await bundle.generate({
	file: "/tmp/p.mjs",
	format: "es"
})

//console.log(output[0].code)

await fs.writeFile("/tmp/p.mjs", output[0].code)
