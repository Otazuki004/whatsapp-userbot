const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const run = require('./helpers/run')

const app = express();
const client = new Client();

let qrCodeUrl = '';

client.on('qr', async qr => {
    qrCodeUrl = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message_create', async (msg) => {
    if (msg.body === '!ping') {
        await msg.reply("pong, I'm alive");
    }
});
var afk = false;

client.on('message_create', async (msg) => {
    if (msg.body === '.afk') {
        await msg.reply("okay, ive set you afk");
        afk = true;
    }
});

client.on('message_create', async (msg) => {
    if (!msg.body.startsWith('.sh')) {
        return null;
    }
    if (msg.body.length < 5) {
        return await msg.reply("Enter bash code");
    } else {
        const cmd = msg.body.slice(4).trim();
        try {
            const output = await run(cmd);
            await msg.reply(output);
        } catch (error) {
            await msg.reply(`Error executing command: ${error.message}`);
        }
    }
});

client.on('message', async (msg) => {
    if (afk) {
      await msg.reply("sorry, my owner currently offline. message later.");
    }
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
                <h2>Scan the QR Code</h2>
                <img src="${qrCodeUrl}" alt="QR Code"/>
            </body>
        </html>
    `);
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
