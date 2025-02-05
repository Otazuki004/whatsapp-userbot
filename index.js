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
    const output = [];
    const sandbox = {
        console: {
            log: (...args) => output.push(args.join(' ')),
            error: (...args) => output.push(args.join(' ')),
            warn: (...args) => output.push(args.join(' ')),
        },
        setTimeout,
    };
    const context = vm.createContext(sandbox);
    const evalAsync = promisify((code, callback) => {
        try {
            const result = vm.runInContext(code, context);
            callback(null, result);
        } catch (error) {
            callback(error);
        }
    });

    await evalAsync(code);
    return output.join('\n');
}


let afk = false;

client.on('message_create', async (msg) => {
    if (afk) {
        await msg.reply("sorry, my owner currently offline. message later.");
    }

    if (msg.body === '!ping') {
        await msg.reply("pong, I'm alive");
    } else if (msg.body === '.afk') {
        await msg.reply("okay, ive set you afk");
        afk = true;
    } else if (msg.body.startsWith('.sh')) {
        const cmd = msg.body.slice(4).trim();
        if (cmd.length < 1) {
            return await msg.reply("Enter bash code");
        }
        try {
            let output = await run(cmd);
            await msg.reply(output);
        } catch (error) {
            await msg.reply(`Error executing command: ${error.message}`);
        }
    } else if (msg.body.startsWith('.eval')) {
        const cmd = msg.body.slice(5).trim();
        if (cmd.length < 1) {
            return await msg.reply("Enter eval code");
        }
        try {
            let output = await evalCode(cmd);
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
