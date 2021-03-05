import * as fs from 'fs/promises'
import * as path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'
import babel from 'rollup-plugin-babel'

(async () => await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true }))()

function CopyFile () {
  return {
    name: 'copy-file',
    async writeBundle () {
      await fs.copyFile(path.join(__dirname, 'src/index.d.ts'), path.join(__dirname, 'dist/index.d.ts'))
    }
  }
}

const rollupConfigs = []

const outputConfigs = {
  'esm-bundler': {
    file: pkg.module,
    format: 'es'
  },
  global: {
    file: pkg.unpkg,
    format: 'iife'
  },
  esm: {
    file: pkg.browser,
    format: 'es'
  }
}

function createConfig (format, config) {
  return {
    input: 'src/index.ts',
    output: {
      file: config.file,
      format: config.format,
      name: format === 'global' ? 'VueInsertComponent' : 'vue-insert-component',
      globals: {
        vue: 'Vue'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      babel({
        exclude: 'node_modules/**'
      }),
      CopyFile()
    ],
    external: ['vue']
  }
}

Object.entries(outputConfigs).forEach(([key, config]) => {
  rollupConfigs.push(createConfig(key, config))
})

module.exports = rollupConfigs
