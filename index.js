const { Client, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

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

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
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
