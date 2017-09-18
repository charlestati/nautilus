const path = require('path')
const fs = require('fs')
const yargs = require('yargs')
const gaze = require('gaze')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { copyFile } = require('./fs-tools')

const config = require('../config')

const argv = yargs.argv

if (argv.watch) {
  watch()
} else {
  copyAllFonts()
}

function watch() {
  gaze(path.join(config.fonts.inputDir, '**', '*'), (error, watcher) => {
    if (error) {
      logError(error.toString())
    } else {
      watcher.on('changed', handleChange)
      watcher.on('added', handleChange)
      // todo Handle removed fonts to remove them from the dist directory
    }
  })
}

function handleChange(filepath) {
  const basename = path.basename(filepath)
  logInfo(`Copying ${basename}`)
  copyFile(filepath, path.join(config.fonts.outputDir, basename))
    .then(() => logSuccess(`${basename} copied`))
    .catch(error => logError(error.toString()))
}

function copyAllFonts() {
  fs.stat(config.fonts.inputDir, (error, stats) => {
    if (!error && stats.isDirectory()) {
      logInfo('Copying fonts')
      copyFile(config.fonts.inputDir, config.fonts.outputDir)
        .then(() => logSuccess('Fonts copied'))
        .catch(error => logError(error.toString()))
    }
  })
}
