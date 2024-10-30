import fs from "node:fs/promises"

import {
	factory as projectPluginFactory
} from "../dist/project.rollup/index.mjs"

import {
	factory as resourcesPluginFactory
} from "../dist/resources.rollup/index.mjs"

import {factory} from "../dist/runtime.rollup/index.mjs"

import {rollup} from "rollup"

const bundle = await rollup({
	input: "./rollup-test/entry.mjs",
	output: {
		file: "/tmp/p.mjs",
		format: "es"
	},
	plugins:[
		await projectPluginFactory("/tmp/pl/"),
		await resourcesPluginFactory("/tmp/pl/"),
		await factory("/tmp/pl/")
	],
	treeshake: true
})

const {output} = await bundle.generate({
	file: "/tmp/p.mjs",
	format: "es"
})

console.log(output[0].code)

await fs.writeFile("/tmp/p.mjs", output[0].code)
