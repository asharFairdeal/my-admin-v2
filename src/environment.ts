// environment.ts

const pkg = require('../package.json');

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const WHATSAPP_BEARER_TOKEN = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
const APP_VERSION = pkg.version;

export const environment = {
    apiUrl: API_URL,
    socketUrl: SOCKET_URL,
    appName: APP_NAME,
    appVersion: APP_VERSION,
    WHATSAPP_TOKEN: WHATSAPP_BEARER_TOKEN,
};
