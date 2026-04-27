const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");
const axios = require("axios");
const readline = require("readline");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ["Dark Devil & Dark Venom", "Chrome", "3.0.0"]
    });

    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        console.log("⚡ DARK SYSTEM STARTING... ⚡");
        const phoneNumber = await new Promise(resolve => rl.question('Number (+923098047638) enter karein: ', resolve));
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`\n🔥 YOUR PAIRING CODE: ${code}\n`);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages;
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const command = body.trim().split(/ +/)[0].toLowerCase();

        const channelLink = "https://whatsapp.com";
        const youtubeLink = "http://youtube.com";

        if (command === '.menu') {
            await sock.sendPresenceUpdate('composing', from);
            await delay(1000);
            const menuText = `*╭───── 「 🔱 𝐃𝐀𝐑𝐊 𝐃𝐄𝐕𝐈𝐋 𝐏𝐑𝐎 🔱 」 ─────*
*│*          *⚡ 𝐃𝐀𝐑𝐊 𝐕𝐄𝐍𝐎𝐌 𝐑𝐎𝐁𝐎𝐓 ⚡*
*╰──────────────────────────────────*
📢 *SUPPORT:* ${youtubeLink}
*👑 OWNER:* Dark Devil & Dark Venom
*📥 TOOLS:* .dl, .ytmp3, .fb, .s, .ai, .ping
*🛡️ SYSTEM:* Anti-Delete & ViewOnce Active
*╰──────────────────────────────────*`;
            await sock.sendMessage(from, { text: menuText });
        }
        
        if (command === '.ping') {
            await sock.sendMessage(from, { text: '⚡ Dark System Active!' });
        }
    });

    sock.ev.on('connection.update', (u) => { if (u.connection === 'open') console.log("✅ DARK SYSTEM LIVE!"); });
}
startBot();
