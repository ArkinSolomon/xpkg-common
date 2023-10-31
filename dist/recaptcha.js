import axios from 'axios';
import logger from './logger.js';
const disableCaptcha = process.env.RECAPTCHA_DISABLE || process.env.NODE_ENV !== 'production';
if (disableCaptcha)
    logger.warn('reCAPTCHA disabled');
export default async function (token, ip) {
    if (disableCaptcha)
        return true;
    try {
        const params = new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET,
            response: token,
            remoteip: ip
        });
        const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', params);
        const response = res.data;
        return response.success;
    }
    catch (e) {
        logger.error(e, 'Error with reCAPTCHA verification');
        return false;
    }
}
//# sourceMappingURL=recaptcha.js.map