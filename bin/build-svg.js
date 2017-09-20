const path = require('path')
const async = require('async')
const yargs = require('yargs')
const gaze = require('gaze')
const svgSprite = require('svg2sprite')
const dashify = require('dashify')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { readDirectory, readFile, writeFile } = require('./fs-tools')
const { minifySvgFiles, minifySvgBuffer } = require('./image-tools')

const config = require('../config')

const argv = yargs.argv

if (argv.watch) {
  watch()
} else {
  build()
}

function watch() {
  gaze(path.join(config.svg.inputDir, '**', '*.svg'), (error, watcher) => {
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
  readDirectory(config.svg.inputDir).then(files => {
    const spriteSheet = svgSprite.collection({
      inline: true,
      rootAttributes: { id: 'svg-spritesheet' },
    })

    const addFileToSpriteSheet = (file, done) => {
      const filepath = path.join(config.svg.inputDir, file)
      readFile(filepath)
        .then(data => {
          spriteSheet.add(dashify(path.basename(file, '.svg')), data)
          done()
        })
        .catch(error => done(error))
    }

    const writeSpriteSheet = error => {
      if (error) {
        logError(error.toString())
      } else {
        const compiledSpriteSheet = spriteSheet.compile()
        if (argv.minify) {
          minifySvgBuffer(
            Buffer.from(compiledSpriteSheet, 'utf8')
          ).then(minifiedSpriteSheet => {
            return writeFile(
              path.join(config.svg.outputDir, config.svg.outputFile),
              minifiedSpriteSheet
            ).then(() => logSuccess('SVG sprite built'))
          })
        } else {
          return writeFile(
            path.join(config.svg.outputDir, config.svg.outputFile),
            compiledSpriteSheet
          ).then(() => logSuccess('SVG sprite built'))
        }
      }
    }

    logInfo('Building SVG sprite sheet')

    async.each(
      files.filter(
        file => path.extname(file) === '.svg' && file.startsWith('icon-')
      ),
      addFileToSpriteSheet,
      writeSpriteSheet
    )

    logInfo('Minifying SVG files')

    minifySvgFiles(
      files
        .filter(
          file => path.extname(file) === '.svg' && !file.startsWith('icon-')
        )
        .map(file => path.join(config.svg.inputDir, file)),
      config.svg.outputDir
    ).then(() => logSuccess('SVG files minified'))
  })
}
