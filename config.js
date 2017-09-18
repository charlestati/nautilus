const path = require('path')

const appName = 'Nautilus'
const appDescription = 'Nautilus'
const appUrl = 'https://example.com/'
const themeColor = '#ffffff'
const language = 'en-US'
const twitterUsername = '@twitter'

const distDir = 'dist/'
const sourceDir = 'src/'
const tmpDir = '.tmp/'

const fontsDir = 'fonts/'
const htmlDir = 'html/'
const imagesDir = 'images/'
const scriptsDir = 'scripts/'
const staticDir = 'static/'
const stylesDir = 'styles/'
const svgDir = 'svg/'
const templatesDir = 'templates/'

const browserslist = ['last 2 versions']

const svgConfig = {
  inputDir: path.join(sourceDir, svgDir),
  outputDir: path.join(tmpDir, svgDir),
  outputFile: 'spritesheet.svg',
}

const fontsConfig = {
  inputDir: path.join(sourceDir, fontsDir),
  outputDir: path.join(distDir, fontsDir),
}

const imagesConfig = {
  inputDir: path.join(sourceDir, imagesDir),
  outputDir: path.join(distDir, imagesDir),
}

const templatesConfig = {
  inputDir: path.join(sourceDir, templatesDir),
  outputDir: distDir,
}

const shareConfig = {
  facebook: path.join(imagesDir, 'share-facebook.png'),
  twitter: path.join(imagesDir, 'share-twitter.png'),
}

const stylesConfig = {
  inputDir: stylesDir,
  inputFile: 'main.scss',
  inlineInputFile: 'inline.scss',
  outputDir: stylesDir,
  outputFile: 'main.css',
  inlineOutputFile: 'inline.css',
}

const scriptsConfig = {
  inputDir: scriptsDir,
  inputFile: 'main.js',
  inlineInputFile: 'inline.js',
  outputDir: scriptsDir,
  outputFile: 'main.js',
  inlineOutputFile: 'inline.js',
}

const faviconsConfig = {
  inputDir: svgConfig.inputDir,
  inputFile: 'favicon.svg',
  outputDir: path.join(distDir, staticDir),
  outputHtmlDir: path.join(tmpDir, htmlDir),
  outputHtmlFile: 'favicons.html',
  config: {
    path: staticDir,
    online: false,
    icons: {
      appleStartup: false,
      coast: false,
      firefox: false,
      yandex: false,
    },
    appName: appName,
    appDescription: appDescription,
    developerName: appName,
    developerURL: appUrl,
    background: themeColor,
    theme_color: themeColor,
    lang: language,
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/?homescreen=1',
    version: '1.0',
  },
}

module.exports = {
  url: appUrl,
  title: appName,
  description: appDescription,
  themeColor: themeColor,
  twitterUsername: twitterUsername,
  sourceDir: sourceDir,
  distDir: distDir,
  tmpDir: tmpDir,
  favicon: faviconsConfig,
  fonts: fontsConfig,
  images: imagesConfig,
  scripts: scriptsConfig,
  share: shareConfig,
  styles: stylesConfig,
  svg: svgConfig,
  templates: templatesConfig,
  browserslist: browserslist,
}
