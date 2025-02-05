const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const run = require('./helpers/run')
const { promisify } = require('util');
const vm = require('vm');

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

async function eval(code) {
    const sandbox = { console, setTimeout };
    const context = vm.createContext(sandbox);
    const evalAsync = promisify((code, callback) => {
        try {
            const result = vm.runInContext(code, context);
            callback(null, result);
        } catch (error) {
            callback(error);
        }
    });

    return evalAsync(code);
}

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
        let cmd = msg.body.slice(4).trim();
        try {
            let output = await run(cmd);
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

client.on('message_create', async (msg) => {
    if (!msg.body.startsWith('.eval')) {
        return null;
    }
    if (msg.body.length < 7) {
        return await msg.reply("Enter eval code");
    } else {
        let cmd = msg.body.slice(4).trim();
        try {
            let output = await eval(cmd);
            await msg.reply(output);
        } catch (error) {
            await msg.reply(`Error executing command: ${error.message}`);
        }
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
