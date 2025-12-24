const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Бот запущен как ${client.user.tag}`);
});

client.on("messageCreate", message => {
  if (!message.content.startsWith("!vzp")) return;

  const args = message.content.split(" ").slice(1);

  if (args.length === 0) {
    return message.reply("Используй: `!vzp 17:33 16:33`");
  }

  let text = "🕒 **ВЗП таймер**\n\n";

  args.forEach((time, i) => {
    const [h, m] = time.split(":").map(Number);

    if (isNaN(h) || isNaN(m)) {
      text += `❌ Неверное время: ${time}\n\n`;
      return;
    }

    const base = new Date();
    base.setHours(h, m, 0, 0);

    const att = new Date(base.getTime() + 4 * 60 * 60 * 1000);
    const def = new Date(base.getTime() + 2 * 60 * 60 * 1000);

    const format = d =>
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    text +=
      `⏰ **Время ${i + 1}: ${time}**\n` +
      `⚔ Атт: **${format(att)}**\n` +
      `🛡 Деф: **${format(def)}**\n\n`;
  });

  message.channel.send(text);
});

// Сервер для Render
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(3000);

client.login(process.env.TOKEN);
