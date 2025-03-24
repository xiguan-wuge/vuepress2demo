const cheerio = require('cheerio')

const stripScript = (html) => {
  const $ = cheerio.load(html)
  $('script').remove()
  return $.html()
}

const stripTemplate = (html) => {
  const $ = cheerio.load(html)
  $('template').remove()
  return $.html()
}

const genInlineComponentText = (html, script) => {
  const template = html
    .replace(/<(\/?)template>/g, '<$1div>')
    .replace(/<(\/?)script>/g, '<$1script>')

  return `
    export default {
      render() {
        return (
          ${template}
        )
      },
      ${script}
    }
  `
}

module.exports = {
  stripScript,
  stripTemplate,
  genInlineComponentText
}