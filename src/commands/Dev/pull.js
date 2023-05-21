const Discord = require('discord.js')
const { execSync } = require('child_process')
const { shorten } = require('../../util/util')

module.exports = {
  name: 'pull',
  owner: true,
  description: 'Git pull changes from latest remote commit',
  desc: '.',
  aliases: [],
  args: true,
  async execute(message, args) {
    if (!owners.includes(message.author.id)) {
      return
    }
    
    const embed = new Discord.EmbedBuilder()
      .setTitle('Pulling changes from remote branch...')
    let msg = await message.reply({ embeds: [embed] })

    let response
    try {
      execSync("git reset --hard")
      response = execSync("git pull").toString().trim()
    } catch (e) {
      embed.setDescription('⚠️ ' + e)
      return msg.edit({ embeds: [embed] })
    }
  
    embed.setDescription('```js\n' + response + '\n```')
    await msg.edit({ embeds: [embed] })

  },
}