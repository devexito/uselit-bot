const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')


module.exports = {
  name: 'g2',
  description: 'Completes text using Порфирьевич',
  permissions: '',
  cooldown: 5,
  args: true,
  usage: '<text>',
  owner: true,
  async execute(message, args, client, disbut, generateController) {
    
  },
}