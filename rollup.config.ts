import { defineConfig } from 'rollup'
import type { RollupOptions, ModuleFormat } from 'rollup'
import * as fs from 'fs/promises'
import * as path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'

(async () => await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true }))()

function CopyFile () {
  return {
    name: 'copy-file',
    async writeBundle () {
      await fs.copyFile(path.join(__dirname, 'src/index.d.ts'), path.join(__dirname, 'dist/index.d.ts'))
    }
  }
}

const rollupConfigs: RollupOptions[] = []

type ConfigItem = { format: ModuleFormat; file: string }
const outputConfigs: ConfigItem[] = [
  { format: 'commonjs', file: '.cjs' },
  { format: 'iife', file: '.js' },
  { format: 'es', file: '.mjs' }
]

function createConfig (config: ConfigItem) {
  return defineConfig({
    input: 'src/index.ts',
    output: {
      file: `./dist/vue-insert-component${config.file}`,
      format: config.format,
      name: config.format === 'iife' ? 'VueInsertComponent' : 'vue-insert-component',
      globals: {
        vue: 'Vue'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      CopyFile()
    ],
    external: ['vue']
  })
}

outputConfigs.forEach(item => {
  rollupConfigs.push(createConfig(item))
})

module.exports = rollupConfigs
