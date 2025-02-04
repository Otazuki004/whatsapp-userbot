import { Client } from 'whatsapp-web.js';
const client = new Client();

client.on('qr', async qr => {
    console.log(qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
