const path = require('path')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { makeDirectory } = require('./fs-tools')

const config = require('../config')

setup()

function setup() {
  logInfo('Creating directories')

  const directories = [
    config.favicon.outputHtmlDir,
    config.svg.outputDir,
    config.favicon.outputDir,
    config.fonts.outputDir,
    config.images.outputDir,
    path.join(config.distDir, config.scripts.outputDir),
    path.join(config.distDir, config.styles.outputDir),
    path.join(config.tmpDir, config.scripts.outputDir),
    path.join(config.tmpDir, config.styles.outputDir),
  ]

  Promise.all(directories.map(makeDirectory))
    .then(() => logSuccess('Directories created'))
    .catch(error => logError(error.toString()))
}
