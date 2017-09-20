const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')

const imagePlugins = [
  imageminJpegtran(),
  imageminPngquant({ quality: '90-100' }),
]

const svgPlugins = [
  imageminSvgo({
    plugins: [
      // todo fill="none" is removed too. Is it risky?
      { removeAttrs: { attrs: '(stroke|fill)' } },
      { removeDimensions: true },
      { removeTitle: true },
      { removeXMLNS: true },
      { cleanupIDs: false },
      { removeUselessDefs: false },
      { sortAttrs: true },
    ],
  }),
]

function minifyImageFiles(files, outputDir) {
  return imagemin(files, outputDir, {
    plugins: imagePlugins,
  })
}

function minifyImageBuffer(buffer) {
  return imagemin.buffer(buffer, {
    plugins: imagePlugins,
  })
}

function minifySvgFiles(files, outputDir) {
  return imagemin(files, outputDir, {
    plugins: svgPlugins,
  })
}

function minifySvgBuffer(buffer) {
  return imagemin.buffer(buffer, {
    plugins: svgPlugins,
  })
}

module.exports = {
  minifyImageFiles,
  minifyImageBuffer,
  minifySvgFiles,
  minifySvgBuffer,
}
