const { argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const { translateText, sendMessage } = require('../../services/translateText')

function waste(text) {
  return text
    .replace(/[A-Z]/g, c => {
      switch (c) {
        case 'A': return 'А'; case 'B': return 'В'; case 'C': return 'С';
        case 'D': return 'Д'; case 'E': return 'Е'; case 'F': return 'Г';
        case 'G': return 'Ж'; case 'H': return 'Н'; case 'I': return 'I'; // <- as is
        case 'J': return 'Ь'; case 'K': return 'К'; case 'L': return 'Л';
        case 'M': return 'М'; case 'N': return 'И'; case 'O': return 'О';
        case 'P': return 'Р'; case 'Q': return 'Ц'; case 'R': return 'Я';
        case 'S': return 'Ы'; case 'T': return 'Т'; case 'U': return 'Ю';
        case 'V': return 'Ф'; case 'W': return 'Ш'; case 'X': return 'Х';
        case 'Y': return 'У'; case 'Z': return 'П'; default : return  c ;
      }
    })
    .replace(/[а-яё]/g, c => c.toUpperCase())
    .replace(/[А-ЯЁ4]/g, c => {
      switch (c) {
        case 'Б': return '6'; case 'Ё': return 'Е'; case 'З': return '3';
        case 'Й': return 'И'; case 'Щ': return 'Ш'; case 'Ъ': return 'Ь';
        case 'Э': return '3'; case '4': return 'Ч'; default : return  c ;
      }
    })
}

module.exports = {
  name: 'waste',
  aliases: [],
  description: `Translates text using PROMT 7.8, and then makes the Russian text look like from a True Wasted Translation. Only English and Russian are supported.\nThanks to @nonk123 for hosting this API.`,
  desc: 'Wasted translation with PROMT',
  permissions: '',
  usage: '<text>',
  typing: true,
  async execute(message, args) {
    let untranslated = args

    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != untranslated && untranslated.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      untranslated = reply
    } else {
      return argsError(this, message)
    }

    const outputText = await translateText(untranslated, message)
    if (outputText === undefined) {
      return
    }

    //console.log(text)
    outputText.text = waste(outputText.text)
    
    return sendMessage(outputText, message)
  },
}