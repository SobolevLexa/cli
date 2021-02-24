const output = require('./output.js')
const opener = require('opener')

const { URL } = require('url')

// attempt to open URL in web-browser, print address otherwise:
const open = async (npm, url, errMsg) => {
  const browser = npm.config.get('browser')

  function printAlternateMsg () {
    const json = this.npm.config.get('json')
    const alternateMsg = json
      ? JSON.stringify({
        title: errMsg,
        url,
      }, null, 2)
      : `${errMsg}:\n  ${url}\n`

    output(alternateMsg)
  }

  if (browser === false) {
    printAlternateMsg()
    return
  }

  try {
    /^(https?|file):$/.test(new URL(url).protocol)
  } catch (_) {
    throw new Error('Invalid URL: ' + url)
  }

  const command = browser === true ? null : browser
  await new Promise((resolve, reject) => {
    opener(url, { command }, (err) => {
      if (err && err.code === 'ENOENT') {
        printAlternateMsg()
        resolve()
      } else
        reject(err)
    })
  })
}

module.exports = open
