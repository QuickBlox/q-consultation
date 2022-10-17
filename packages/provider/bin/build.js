const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const configFactory = require('../webpack.config')

const ROOT = process.cwd()
const TMP_DIR = '.tmp'
const PUBLIC_DIR = 'public'
const BUILD_DIR = 'build'

const TMP_DIR_PATH = path.resolve(ROOT, TMP_DIR)
const PUBLIC_DIR_PATH = path.resolve(ROOT, PUBLIC_DIR)
const BUILD_DIR_PATH = path.resolve(ROOT, BUILD_DIR)

process.env.NODE_ENV = 'production'

process.on('unhandledRejection', (err) => {
  throw err
})

function removeFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    clearFolder(folderPath)
    fs.rmdirSync(folderPath)
  }
}

function clearFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.resolve(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        removeFolder(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
  }
}

function createOrClearFolder(folder) {
  if (fs.existsSync(folder)) {
    clearFolder(folder)
  } else {
    fs.mkdirSync(folder)
  }
}

/**
 * @param {string} from
 * @param {string} to
 * @param {RegExp} [excludeRegex]
 */
function copyDir(from, to, excludeRegex) {
  fs.readdirSync(from)
    .filter((file) =>
      file ? (excludeRegex ? excludeRegex.test(file) === false : true) : false,
    )
    .forEach((file) => {
      const fromPath = path.resolve(from, file)
      const toPath = path.resolve(to, file)

      if (fs.lstatSync(fromPath).isDirectory()) {
        createOrClearFolder(toPath)
        copyDir(fromPath, toPath)
      } else {
        fs.copyFileSync(fromPath, toPath)
      }
    })
}

function main() {
  createOrClearFolder(TMP_DIR_PATH)
  copyDir(PUBLIC_DIR_PATH, TMP_DIR_PATH, /\.html$/)

  const config = configFactory()
  config.output.path = TMP_DIR_PATH

  webpack(config, (err, stats) => {
    if (err) {
      return process.stderr.write(err.message + '\n')
    } else {
      if (stats.hasErrors()) {
        return process.stderr.write(stats.toString({ colors: true }) + '\n')
      }
    }

    process.stdout.write(stats.toString({ colors: true }) + '\n')

    createOrClearFolder(BUILD_DIR_PATH)
    copyDir(TMP_DIR_PATH, BUILD_DIR_PATH)
    removeFolder(TMP_DIR_PATH)
  })
}

main()
