/* eslint-disable import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { dts } from 'rollup-plugin-dts'
import { mkdir, readdir, readFile, writeFile, copyFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
/* eslint-enable import/no-extraneous-dependencies */
import pkg from './package.json'

const copyComponentAssets = async () => {
  const sourceRoot = 'src/components'
  const destinationRoot = 'dist/mpop/components'

  const readAndCopyRecursive = async currentPath => {
    const entries = await readdir(currentPath, { withFileTypes: true })

    const tasks = entries.map(async entry => {
      const sourcePath = join(currentPath, entry.name)

      if (entry.isDirectory()) {
        return readAndCopyRecursive(sourcePath)
      }

      if (entry.isFile() && (entry.name.endsWith('.njk') || entry.name.endsWith('.scss'))) {
        const relativePath = relative(sourceRoot, sourcePath)
        const destinationPath = join(destinationRoot, relativePath)

        await mkdir(dirname(destinationPath), { recursive: true })
        return copyFile(sourcePath, destinationPath)
      }

      return null
    })

    await Promise.all(tasks)
  }

  await readAndCopyRecursive(sourceRoot)
}

const copyJsAssets = async () => {
  const sourceRoot = 'src/assets/js'
  const destinationRoot = 'dist/js'
  let entries

  try {
    entries = await readdir(sourceRoot, { withFileTypes: true })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return
    }
    throw error
  }

  const copyPromises = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
    .map(async entry => {
      const sourcePath = join(sourceRoot, entry.name)
      const destinationPath = join(destinationRoot, entry.name)
      await mkdir(dirname(destinationPath), { recursive: true })
      return copyFile(sourcePath, destinationPath)
    })

  await Promise.all(copyPromises)
}

const copyAndTransformAllScss = async () => {
  const sourcePath = 'src/assets/scss/_all.scss'
  const destinationPath = 'dist/_all.scss'
  const content = await readFile(sourcePath, 'utf8')
  await mkdir(dirname(destinationPath), { recursive: true })
  await writeFile(destinationPath, content.replaceAll('../../components/', './mpop/components/'))
}

const copyAssetsPlugin = () => ({
  name: 'copy-assets',
  async writeBundle() {
    await Promise.all([copyComponentAssets(), copyJsAssets(), copyAndTransformAllScss()])
  },
})

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: true }),
      copyAssetsPlugin(),
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [nodeResolve({ preferBuiltins: true }), dts()],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  },
]
