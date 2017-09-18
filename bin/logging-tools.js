const chalk = require('chalk')
const figures = require('figures')

module.exports = {
  logInfo: str => {
    console.info(chalk.bold.blue(`${figures.pointer} ${str}`))
  },
  logSuccess: str => {
    console.log(chalk.bold.green(`${figures.tick} ${str}`))
  },
  logError: error => {
    if (typeof error === 'string') {
      console.error(chalk.bold.red(`${figures.cross} ${error}`))
    } else {
      console.error(error)
    }
  },
}
