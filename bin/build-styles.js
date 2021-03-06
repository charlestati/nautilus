const path = require('path')
const yargs = require('yargs')
const gaze = require('gaze')
const sass = require('node-sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { writeFile } = require('./fs-tools')

const config = require('../config')

const inputDir = path.join(config.sourceDir, config.styles.inputDir)
const inputFile = path.join(inputDir, config.styles.inputFile)
const outputDir = path.join(config.distDir, config.styles.outputDir)
const outputFile = path.join(outputDir, config.styles.outputFile)
const inlineInputFile = path.join(inputDir, config.styles.inlineInputFile)

const argv = yargs.argv

if (argv.watch) {
  watch()
} else {
  build()
}

function watch() {
  const prey = [path.join(inputDir, '**', '*.scss'), `!${inlineInputFile}`]
  gaze(prey, (error, watcher) => {
    if (error) {
      logError(error.toString())
    } else {
      watcher.on('changed', handleChange)
      watcher.on('added', handleChange)
    }
  })
}

function handleChange() {
  build()
}

function build() {
  logInfo('Building styles')
  return renderStyles()
    .then(postProcStyles)
    .then(data => writeFile(outputFile, data.css))
    .then(() => logSuccess('Styles built'))
    .catch(error => logError(error.toString()))
}

function renderStyles() {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: inputFile,
        precision: 10,
        sourceMapEmbed: !argv.minify,
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result.css)
        }
      }
    )
  })
}

function postProcStyles(data) {
  const plugins = [
    autoprefixer({
      browsers: config.browserslist,
    }),
  ]

  if (argv.minify) {
    plugins.push(cssnano)
  }

  return postcss(plugins).process(data)
}
