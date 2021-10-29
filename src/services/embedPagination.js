// stolen from npm library

const {
  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const gen = require("../services/generateText");

/**
 * Creates a pagination embed
 * @param {Message} msg
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const paginationEmbed = async (msg, pages, buttonList, timeout = 120000) => {
  if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
    throw new Error(
      "Link buttons are not supported with discordjs-button-pagination"
    );
  if (buttonList.length < 2) throw new Error("Need two buttons.");

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  const curPage = await msg.edit({
    embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
    components: [row],
  });

  const disabledRow = new MessageActionRow().addComponents(
    buttonList[0].setDisabled(true),
    buttonList[1].setDisabled(true),
    buttonList[2].setDisabled(true),
    buttonList[3].setDisabled(true)
  );

  const filter = (i) =>
    i.customId === buttonList[0].customId ||
    i.customId === buttonList[1].customId ||
    i.customId === buttonList[2].customId ||
    i.customId === buttonList[3].customId;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  let isPaging = false;
  let commandBody;
  let args;

  collector.on("collect", async (i) => {
    let output;
    let author;
    await msg.channel.messages.fetch(i.message.reference.messageId)
      .then(message => {
        commandBody = message.content.slice(1);
        args = commandBody.trim().replace(/ +(?= )/g,'').split(' ');
        if (args) args.splice(0, 1);
        author = message.author.id;
    }).catch(e => {
      console.error(e);
    });
    
    switch (i.customId) {
      case buttonList[0].customId:
        page = page > 0 ? --page : pages.length - 1;
        isPaging = true;
        break;
      case buttonList[1].customId:
        page = page + 1 < pages.length ? ++page : 0
        isPaging = true;
        break;
      case buttonList[2].customId:
        if (!i.message.reference || !args) {
          await i.deferUpdate();
          collector.stop();
          break;
        }
        await i.deferUpdate();
        await i.editReply({
          embeds: [pages[page].setFooter('Generating new text...')],
          components: [disabledRow],
        });
        output = await gen.fetchText(msg, args);
        page = 0;
        break;
      case buttonList[3].customId:
        isPaging = false;
        await i.deferUpdate();
        if (i.user.id == author) {
          collector.stop();
        }
        break;
      default:
        break;
    }
    if (output) {
      pages[0] = pages[0].setDescription(args.join(' ').trim() + output[0]);
      pages[1] = pages[1].setDescription(args.join(' ').trim() + output[1]);
      pages[2] = pages[2].setDescription(args.join(' ').trim() + output[2]);
      await i.editReply({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row],
      });
    } else if (isPaging) {
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row],
      });
    }
    collector.resetTimer();
  });

  collector.on("end", () => {
    if (!curPage.deleted) {
      curPage.edit({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [],
      });
    }
  });

  return curPage;
};
module.exports = paginationEmbed;