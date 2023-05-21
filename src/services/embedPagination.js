// stolen from npm library

const Discord = require('discord.js');
const { isInvalid } = require('../util/message');
const { shorten } = require('../util/util');
const gen = require('../services/generateText');

/**
 * Creates a pagination embed
 * @param {Message} msg (of bot)
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @param {Message} message (of user)
 * @param {boolean} replied
 * @returns
 */
const paginationEmbed = async (msg, resultEmbed, buttonList, timeout = 120000, message, args) => {
  if (!msg || !msg.channel)
    throw new Error('Channel is inaccessible.');

  if (resultEmbed.description && resultEmbed.description.length > 2999)
    buttonList[1].setDisabled(true);
  
  const row = new Discord.ActionRowBuilder().addComponents(buttonList).toJSON();
  let curPage = await msg.edit({
    embeds: [resultEmbed.setFooter({ text: ' ' })],
    components: [row],
  }).catch(() => {});
  
  const colFilter = i => buttonList.filter(bu => bu.customId == i.customId).length;

  let collector;
  try {
    collector = await curPage.createMessageComponentCollector({
      componentType: Discord.ComponentType.ActionRow,
      filter: colFilter,
      time: timeout,
    });
    console.log(collector);
  } catch (e) {
    return console.error(e);
  }
  
  const disabledRow = new Discord.ActionRowBuilder().setComponents(
    buttonList.map(bu => bu.setDisabled(true))
  ).toJSON();

  collector.on('collect', async (i) => {
    let output;

    let msgIsDeleted = await isInvalid(curPage);
  
    switch (i.customId) {
      case 'regenerate': // REGENERATE TEXT
        if (!args) {
          console.log(msgIsDeleted + ' ' + args)
          await i.deferUpdate();
          collector.stop();
          break;
        }
        await i.deferUpdate();
        await i.editReply({
          embeds: [resultEmbed.setFooter({ text: 'Regenerating text...' })],
          components: [disabledRow],
        }).catch(() => {});
        output = await gen.fetchText(msg, args);
        break;
      case 'generateMore': // GENERATE MORE TEXT
        await i.deferUpdate();
        await i.editReply({
          embeds: [resultEmbed.setFooter({ text: 'Generating more text...' })],
          components: [disabledRow],
        }).catch(() => {});
        let embedText = resultEmbed.description.split(' ');
        output = await gen.fetchText(msg, embedText);
        if (output)
          args = output.input.split(' ');
        break;
      case 'close': // CLOSE BUTTONS
        isPaging = false;
        await i.deferUpdate();
        if ((i.user.id == message.author.id) || msgIsDeleted || !args)
          collector.stop();
        break;
      case 'song':
        await i.deferUpdate();
        break;
      default:
        break;
    }

    if (output) {
      for (let i = 0; i < pages.length; i++) {
        pages[i] = pages[i].setDescription(shorten(output.input + output.res[i]));
      }

      if (resultEmbed.description.length > 2999) {
        row.spliceComponents(1, 1, buttonList[1].setDisabled(true))
      }
      
      await i.editReply({
        embeds: [resultEmbed.setFooter({ text: ' ' })],
        components: [row],
      }).catch(() => {});
    };
    
    collector.resetTimer();
  });
  
  collector.on('end', async () => {
    let isMessageInvalid = await isInvalid(curPage)
    if (!isMessageInvalid) {
      curPage.edit({
        embeds: [resultEmbed.setFooter({ text: ' ' })],
        components: [],
      }).catch(() => {});
    } else {
      console.log('the curPage message is invalid. huh.')
    }
  });
  
  return curPage;
};
module.exports = paginationEmbed;