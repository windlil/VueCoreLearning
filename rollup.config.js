
const path = require('path')
const ts = require('rollup-plugin-typescript2')
const json = require('@rollup/plugin-json')
const nodeResolve = require('@rollup/plugin-node-resolve')

const packagesDir = path.resolve(__dirname,'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET ?? '')

function resolve(p) {
  return path.resolve(packageDir, p)
}

const packgeJSON = require(resolve('package.json'))
const buildOptions = packgeJSON.buildOptions


const outPutConfig = {
    'cjs': {
      file: resolve(`dist/${buildOptions.name}.cjs`),
      format: 'cjs'
    },
    'esm-bundler': {
      file: resolve(`dist/${buildOptions.name}.esm-bundler.js`),
      format: 'es'
    },
    'global': {
      file: resolve(`dist/${buildOptions.name}.global.js`),
      format: 'iife'
    }
}


function createConfig(format, output) {
  output.sourcemap = true
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      nodeResolve()
    ]
  }
}

const config = buildOptions.formats.map((item) => {
  return createConfig(item, outPutConfig[item])
})

module.exports = config

