const BrowserSync = require('browser-sync')

const config = require('../config')

const bs = BrowserSync.create()

bs.init({
  server: config.distDir,
  files: config.distDir,
  ghostMode: false,
  notify: false,
  open: false,
})
