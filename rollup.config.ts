import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'

export default defineConfig({
  input: './packages/index.ts',
  plugins: [
    typescript(),
    nodeResolve()
  ],
  output: [
    {
      format: 'cjs',
      file: './dist/mini-vue.cjs.js',
    },
    {
      name: "vue",
      format: "es",
      file: './dist/mini-vue.js',
    },
  ]
})