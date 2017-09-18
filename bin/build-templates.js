const path = require('path')
const async = require('async')
const url = require('url')
const yargs = require('yargs')
const gaze = require('gaze')
const pug = require('pug')
const minify = require('html-minifier').minify

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { readDirectory, writeFile } = require('./fs-tools')

const config = require('../config')

const pugVariables = {
  basedir: config.tmpDir,
  title: config.title,
  description: config.description,
  url: config.url,
  twitterUsername: config.twitterUsername,
  shareFacebook: url.resolve(config.url, config.share.facebook),
  shareTwitter: url.resolve(config.url, config.share.twitter),
  stylesFile: path.join(config.styles.outputDir, config.styles.outputFile),
  scriptsFile: path.join(config.scripts.outputDir, config.scripts.outputFile),
}

const minifyOptions = {
  removeComments: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeScriptTypeAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
}

const argv = yargs.argv

if (argv.watch) {
  watch()
} else {
  build()
}

function watch() {
  const prey = [
    path.join(config.templates.inputDir, '**', '*.pug'),
    path.join(config.svg.outputDir, config.svg.outputFile),
    path.join(config.favicon.outputHtmlDir, config.favicon.outputHtmlFile),
    path.join(
      config.tmpDir,
      config.scripts.outputDir,
      config.scripts.inlineOutputFile
    ),
    path.join(
      config.tmpDir,
      config.styles.outputDir,
      config.styles.inlineOutputFile
    ),
  ]
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
  logInfo('Building templates')
  return readDirectory(config.templates.inputDir)
    .then(files => {
      async.each(
        files.filter(file => path.extname(file) === '.pug'),
        compileFile,
        error => {
          if (error) {
            logError(error.toString())
          } else {
            logSuccess('Templates built')
          }
        }
      )
    })
    .catch(error => logError(error.toString()))
}

function compileFile(file, done) {
  try {
    let html = pug.renderFile(
      path.join(config.templates.inputDir, file),
      pugVariables
    )
    if (argv.minify) {
      html = minify(html, minifyOptions)
    }
    const htmlFile = path.basename(file, '.pug') + '.html'
    const outputFile = path.join(config.templates.outputDir, htmlFile)
    writeFile(outputFile, html)
      .then(done)
      .catch(done)
  } catch (error) {
    done(error)
  }
}
