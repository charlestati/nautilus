const path = require('path')
const async = require('async')
const yargs = require('yargs')
const gaze = require('gaze')
const svgSprite = require('svg2sprite')
const SVGO = require('svgo')
const dashify = require('dashify')

const { logInfo, logSuccess, logError } = require('./logging-tools')
const { readDirectory, readFile, writeFile } = require('./fs-tools')

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
  logInfo('Building SVG sprite sheet')

  readDirectory(config.svg.inputDir).then(files => {
    const spriteSheet = svgSprite.collection({
      inline: true,
      rootAttributes: { id: 'svg-spritesheet' },
    })

    const addFileToSpriteSheet = (file, done) => {
      if (file.startsWith('icon-')) {
        const filepath = path.join(config.svg.inputDir, file)
        readFile(filepath)
          .then(data => {
            spriteSheet.add(dashify(path.basename(file, '.svg')), data)
            done()
          })
          .catch(error => done(error))
      } else {
        done()
      }
    }

    const doneCallback = error => {
      if (error) {
        logError(error.toString())
      } else {
        const compiledSpriteSheet = spriteSheet.compile()
        // todo fill="none" is removed too. Is it risky?
        const svgo = new SVGO({
          plugins: [
            { removeAttrs: { attrs: '(stroke|fill)' } },
            { removeDimensions: true },
            { removeXMLNS: true },
            { cleanupIDs: false },
            { removeUselessDefs: false },
            { sortAttrs: true },
          ],
        })
        svgo.optimize(compiledSpriteSheet, result => {
          return writeFile(
            path.join(config.svg.outputDir, config.svg.outputFile),
            result.data
          ).then(() => logSuccess('SVG sprite built'))
        })
      }
    }

    async.each(
      files.filter(file => path.extname(file) === '.svg'),
      addFileToSpriteSheet,
      doneCallback
    )
  })
}
