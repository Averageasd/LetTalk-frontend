import {io} from 'socket.io-client';
import {baseUrl} from "../shared/basedUrl.js";

// "undefined" means the URL will be computed from the `window.location` object
export const socket = io(baseUrl, {
    autoConnect: false,
});