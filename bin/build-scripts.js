const path = require('path')
const yargs = require('yargs')
const browserify = require('browserify')
const watchify = require('watchify')
const UglifyJS = require('uglify-js')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { writeFile } = require('./fs-tools')

const config = require('../config')

const inputDir = path.join(config.sourceDir, config.scripts.inputDir)
const inputFile = path.join(inputDir, config.scripts.inputFile)
const outputDir = path.join(config.distDir, config.scripts.outputDir)
const outputFile = path.join(outputDir, config.scripts.outputFile)

const argv = yargs.argv

const babelifyConfig = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: config.browserslist,
        },
      },
    ],
  ],
}

const b = browserify({
  entries: inputFile,
  cache: {},
  packageCache: {},
  debug: !argv.minify,
}).transform('babelify', babelifyConfig)

if (argv.watch) {
  b.plugin(watchify)
  b.on('update', handleChange)
}

build()

function build() {
  logInfo('Building scripts')
  return bundleScripts()
    .then(minifyScripts)
    .then(data => writeFile(outputFile, data))
    .then(() => logSuccess('Scripts built'))
    .catch(error => logError(error.toString()))
}

function bundleScripts() {
  return new Promise((resolve, reject) => {
    b.bundle((error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer.toString())
      }
    })
  })
}

function minifyScripts(data) {
  return new Promise((resolve, reject) => {
    if (argv.minify) {
      const minified = UglifyJS.minify(data)
      if (minified.error) {
        reject(minified.error)
      } else {
        resolve(minified.code)
      }
    } else {
      resolve(data)
    }
  })
}

function handleChange() {
  build()
}
