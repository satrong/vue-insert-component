import * as fs from 'fs/promises'
import * as path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'
import babel from 'rollup-plugin-babel'

function CopyFile () {
  return {
    name: 'copy-file',
    async writeBundle () {
      await fs.copyFile(path.join(__dirname, 'src/index.d.ts'), path.join(__dirname, 'dist/index.d.ts'))
    }
  }
}

export default {
  input: 'src/index.ts',
  output: {
    file: pkg.browser,
    format: 'es',
    name: 'vue-insert-component',
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
