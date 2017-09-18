const path = require('path')
const yargs = require('yargs')
const gaze = require('gaze')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { minifyImageFiles } = require('./image-tools')
const { copyFile } = require('./fs-tools')

const config = require('../config')

const argv = yargs.argv

const imagesGlob = path.join(config.images.inputDir, '**', '*')

if (argv.watch) {
  watch()
} else {
  build()
}

function watch() {
  gaze(imagesGlob, (error, watcher) => {
    if (error) {
      logError(error.toString())
    } else {
      watcher.on('changed', handleChange)
      watcher.on('added', handleChange)
      // todo Handle removed images to remove them from the dist directory
    }
  })
}

function handleChange(filepath) {
  if (argv.minify) {
    minifyImage(filepath)
  } else {
    copyImage(filepath)
  }
}

function minifyImage(filepath) {
  const basename = path.basename(filepath)
  logInfo(`Minifying ${basename}`)
  minifyImageFiles([filepath], config.images.outputDir)
    .then(() => logSuccess(`${basename} minified`))
    .catch(error => logError(error.toString()))
}

function copyImage(filepath) {
  const basename = path.basename(filepath)
  logInfo(`Copying ${basename}`)
  copyFile(filepath, path.join(config.images.outputDir, basename))
    .then(() => logSuccess(`${basename} copied`))
    .catch(error => logError(error.toString()))
}

function build() {
  if (argv.minify) {
    minifyAllImages()
  } else {
    copyAllImages()
  }
}

function minifyAllImages() {
  logInfo('Minifying images')
  minifyImageFiles([imagesGlob], config.images.outputDir)
    .then(() => logSuccess('Images minified'))
    .catch(error => logError(error.toString()))
}

function copyAllImages() {
  logInfo('Copying images')
  copyFile(config.images.inputDir, config.images.outputDir)
    .then(() => logSuccess('Images copied'))
    .catch(error => logError(error.toString()))
}
