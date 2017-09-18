const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const imageminPlugins = [
  imageminJpegtran(),
  imageminPngquant({ quality: '90-100' }),
]

function minifyImageFiles(files, outputDir) {
  return imagemin(files, outputDir, {
    plugins: imageminPlugins,
  })
}

function minifyImageBuffer(buffer) {
  return imagemin.buffer(buffer, {
    plugins: imageminPlugins,
  })
}

module.exports = {
  minifyImageFiles,
  minifyImageBuffer,
}
