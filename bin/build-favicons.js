const path = require('path')
const os = require('os')
const yargs = require('yargs')
const gaze = require('gaze')
const favicons = require('favicons')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { writeFile } = require('./fs-tools')
const { minifyImageBuffer } = require('./image-tools')

const config = require('../config')

const inputFile = path.join(config.favicon.inputDir, config.favicon.inputFile)
const outputDir = config.favicon.outputDir
const outputHtmlFile = path.join(
  config.favicon.outputHtmlDir,
  config.favicon.outputHtmlFile
)

const argv = yargs.argv

if (argv.watch) {
  watch()
} else {
  build()
}

function watch() {
  gaze(inputFile, (error, watcher) => {
    if (error) {
      logError(error.toString())
    } else {
      watcher.on('changed', handleChange)
    }
  })
}

function handleChange() {
  build()
}

function build() {
  logInfo('Building favicons')
  return buildFavicons()
    .then(() => logSuccess('Favicons built'))
    .catch(error => logError(error.toString()))
}

function buildFavicons() {
  return new Promise((resolve, reject) => {
    favicons(inputFile, config.favicon.config, (error, response) => {
      if (error) {
        reject(error)
        return
      }

      const promises = []

      if (response.images) {
        promises.push(
          ...response.images.map(image => {
            if (argv.minify) {
              return minifyImageBuffer(image.contents).then(buffer => {
                return writeFile(path.join(outputDir, image.name), buffer)
              })
            } else {
              return writeFile(path.join(outputDir, image.name), image.contents)
            }
          })
        )
      }

      if (response.files) {
        promises.push(
          ...response.files.map(file => {
            return writeFile(path.join(outputDir, file.name), file.contents)
          })
        )
      }

      if (response.html) {
        promises.push(writeFile(outputHtmlFile, response.html.join(os.EOL)))
      }

      resolve(Promise.all(promises))
    })
  })
}
