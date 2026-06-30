const fs = require('fs');
const path = require('path');

// Simple dotenv-like parser
function loadEnv() {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        console.log('Loading configuration from .env.local...');
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv();

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
        const parts = arg.slice(2).split('=');
        const key = parts[0];
        const val = parts.slice(1).join('=');
        args[key] = val;
    }
});

const token = args.token || process.env.WHATSAPP_ACCESS_TOKEN;
const phoneId = args.phoneId || process.env.WHATSAPP_PHONE_NUMBER_ID || '1274364629082910'; // Defaulting to user's phone ID from screenshot
const pin = args.pin; // Require explicit PIN or ask

console.log('\n--- WhatsApp Registration Utility ---');
console.log(`Phone Number ID: ${phoneId}`);
console.log(`Access Token: ${token ? (token.substring(0, 10) + '...' + token.substring(token.length - 5)) : 'Missing'}`);
console.log(`Verification PIN: ${pin ? '******' : 'Missing'}\n`);

if (!token || token === 'your_whatsapp_access_token_here') {
    console.error('ERROR: Missing WhatsApp Access Token.');
    console.error('Please either pass it as an argument: --token="YOUR_TOKEN"');
    console.error('Or set WHATSAPP_ACCESS_TOKEN in .env.local');
    process.exit(1);
}

if (!phoneId || phoneId === 'your_phone_number_id_here') {
    console.error('ERROR: Missing Phone Number ID.');
    console.error('Please either pass it as an argument: --phoneId="YOUR_PHONE_ID"');
    console.error('Or set WHATSAPP_PHONE_NUMBER_ID in .env.local');
    process.exit(1);
}

if (!pin || pin.length !== 6 || isNaN(pin)) {
    console.error('ERROR: Missing or invalid 6-digit PIN.');
    console.error('Please pass your 6-digit verification PIN as an argument: --pin="XXXXXX"');
    console.error('If you haven\'t set up a PIN yet, any 6-digit number you choose now will set it.');
    process.exit(1);
}

async function register() {
    const url = `https://graph.facebook.com/v18.0/${phoneId}/register`;
    
    console.log(`Sending POST request to ${url}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                pin: pin
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('\n=========================================');
            console.log('🎉 SUCCESS: WhatsApp Phone Number Registered!');
            console.log('=========================================');
            console.log(JSON.stringify(data, null, 2));
            console.log('\nYour WhatsApp Business integration is now active.');
            console.log('Remember to subscribe to the "messages" and "statuses" fields in the Webhook Settings of your Meta Dashboard.');
        } else {
            console.error('\n=========================================');
            console.error('❌ ERROR: Registration Failed');
            console.error('=========================================');
            console.error(`Status Code: ${response.status}`);
            console.error(JSON.stringify(data, null, 2));
            console.log('\nTroubleshooting tips:');
            console.log('1. Verify your Access Token has the correct permissions (whatsapp_business_management, whatsapp_business_messaging).');
            console.log('2. Make sure the phone number display name is approved on Meta Developer Dashboard.');
            console.log('3. Ensure the PIN matches your existing WhatsApp Business PIN (if you set one previously).');
        }
    } catch (err) {
        console.error('Network or request error:', err);
    }
}

register();
