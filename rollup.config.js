import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'

export default defineConfig({
  input: './packages/index.ts',
  plugins: [
    nodeResolve(),
    typescript()
  ],
  output: [
    {
      name: 'vue',
      format: 'cjs',
      file: './dist/mini-vue.cjs.js',
    },
    {
      name: "vue",
      format: "es",
      file: './dist/mini-vue.mjs',
    },
  ]
})