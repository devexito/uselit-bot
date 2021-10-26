
//const { argsError } = require('../util/util')

module.exports = {
  name: 'ytc',
  aliases: ['youtubecomment', 'ytcomment', 'ytp', 'ytс'],
  description: 'Simulate a comment on YouTube',
  permissions: '',
  args: true,
  usage: '[user] <text>', 
  async execute(message, args) {
      let text = encodeURIComponent(args.join(' ').slice(args[0].length).trim())

      let targetUser = message.client.users.cache.get(args[0])
      if (!targetUser) {
        targetUser = message.mentions.users.first()
        if (!message.mentions.users.size) {
          targetUser = message.author
          text = encodeURIComponent(args.join(' ').trim())
        }
      }
     // console.log(text)
      
      //start of bing translate code
      const targetName = encodeURIComponent(targetUser.username)
      const address = `https://some-random-api.ml/canvas/youtube-comment?avatar=${targetUser.displayAvatarURL({ format: 'png' }) }&username=${targetName}&comment=${text}`

        message.reply({
          files: [{
            attachment: address,
            name: 'youtube-comment.png'
          }]
        })
      
      //end of bing translate code
  },
}